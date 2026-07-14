import { db } from "../db";
import {
  foldDailySpend,
  mastraDailySpend,
  mastraSpanUsage,
  mergeWindows,
  monroeDailySpend,
  monroeLlmUsageTable,
} from "./llm-usage";
import {
  failed,
  fillDays,
  UNCONFIGURED,
  type ActivitySeries,
  type ProductBreakdown,
  type ProjectReport,
} from "./types";

// Monroe's schema is Prisma-origin: PascalCase table names and camelCase
// timestamp columns must be double-quoted; FK columns are snake_case.
export async function monroeMetrics(): Promise<ProjectReport> {
  const sql = db("MONROE_DATABASE_URL");
  if (!sql) return UNCONFIGURED;

  try {
    const [users, entities, active, series, last, spans, sdkCalls] =
      await Promise.all([
      sql`SELECT
            count(*)::int AS total,
            count(*) FILTER (WHERE "createdAt" >= now() - interval '7 days')::int AS new7,
            count(*) FILTER (WHERE "createdAt" >= now() - interval '30 days')::int AS new30
          FROM "User"`,
      sql`SELECT
            (SELECT count(*) FROM "UserShow")::int AS shows_tracked,
            (SELECT count(*) FROM "UserEpisode" WHERE watched IS TRUE)::int AS episodes_watched,
            (SELECT count(*) FROM "UserList")::int AS lists,
            (SELECT count(*) FROM "Subscription" WHERE status = 'active')::int AS subscriptions`,
      sql`SELECT count(DISTINCT user_id)::int AS active7
          FROM "UserEpisode"
          WHERE "createdAt" >= now() - interval '7 days'`,
      sql`SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day,
                 count(*)::int AS value
          FROM "UserEpisode"
          WHERE "createdAt" >= now() - interval '30 days'
          GROUP BY 1 ORDER BY 1`,
      sql`SELECT max("createdAt") AS at FROM "UserEpisode"`,
      // Two usage sources: Mastra spans (app chat agent) + the LlmUsage
      // table (raw Anthropic/OpenAI SDK calls in the Workers API).
      mastraSpanUsage(sql),
      monroeLlmUsageTable(sql),
    ]);

    return {
      configured: true,
      stats: [
        {
          label: "users",
          value: users[0].total,
          hint: `+${users[0].new7} past 7d`,
        },
        {
          label: "episodes",
          value: entities[0].episodes_watched,
          hint: `${active[0].active7} active / 7d`,
        },
        { label: "subscriptions", value: entities[0].subscriptions },
      ],
      more: [
        {
          label: "shows tracked",
          value: entities[0].shows_tracked,
          hint: `${entities[0].lists} lists`,
        },
        { label: "new users 30d", value: users[0].new30 },
      ],
      llm: mergeWindows(spans, sdkCalls),
      series: {
        label: "episodes logged / day",
        points: fillDays(
          series.map((r) => ({ day: r.day as string, value: r.value as number })),
        ),
      },
      lastActivityAt: (last[0]?.at as Date | null) ?? null,
    };
  } catch (error) {
    return failed(error);
  }
}

interface LabeledRow {
  label: string;
  value: number;
}

// ── Drill-down loaders (/monroe page) ───────────────────────────────────────

export async function monroeSeries90(): Promise<ActivitySeries | null> {
  const sql = db("MONROE_DATABASE_URL");
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day,
             count(*)::int AS value
      FROM "UserEpisode"
      WHERE "createdAt" >= now() - interval '90 days'
      GROUP BY 1 ORDER BY 1`;
    return {
      label: "episodes logged / day",
      points: fillDays(
        rows.map((r) => ({ day: r.day as string, value: r.value as number })),
        90,
      ),
    };
  } catch {
    return null;
  }
}

export async function monroeProduct(): Promise<ProductBreakdown[]> {
  const sql = db("MONROE_DATABASE_URL");
  if (!sql) return [];
  try {
    const [topShows, ratings] = await Promise.all([
      sql<LabeledRow[]>`SELECT s.name AS label, count(*)::int AS value
          FROM "UserEpisode" ue
          JOIN "UserShow" us ON ue.user_show_id = us.id
          JOIN "Show" s ON us.show_id = s.id
          WHERE ue."createdAt" >= now() - interval '30 days'
          GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      sql<LabeledRow[]>`SELECT 'rated ' || rating AS label, count(*)::int AS value
          FROM "UserEpisode"
          WHERE rating IS NOT NULL
          GROUP BY rating ORDER BY rating DESC`,
    ]);
    const rows = (r: LabeledRow[]) =>
      r.map((x) => ({ label: String(x.label), value: Number(x.value) }));
    return [
      { title: "top shows by episodes · 30d", rows: rows(topShows) },
      { title: "ratings given · all-time", rows: rows(ratings) },
    ];
  } catch {
    return [];
  }
}

export async function monroeLlmDaily() {
  const sql = db("MONROE_DATABASE_URL");
  if (!sql) return null;
  try {
    const [spans, sdk] = await Promise.all([
      mastraDailySpend(sql),
      monroeDailySpend(sql),
    ]);
    return foldDailySpend(spans, sdk);
  } catch {
    return null;
  }
}
