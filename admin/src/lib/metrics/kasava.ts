import { db } from "../db";
import {
  foldDailySpend,
  mastraDailySpend,
  mastraSpanUsage,
} from "./llm-usage";
import {
  failed,
  fillDays,
  UNCONFIGURED,
  type ActivitySeries,
  type ProductBreakdown,
  type ProjectReport,
} from "./types";

export async function kasavaMetrics(): Promise<ProjectReport> {
  const sql = db("KASAVA_DATABASE_URL");
  if (!sql) return UNCONFIGURED;

  try {
    const [users, entities, series, last, llm] = await Promise.all([
      sql`SELECT
            count(*)::int AS total,
            count(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS new7,
            count(*) FILTER (WHERE created_at >= now() - interval '30 days')::int AS new30
          FROM profiles
          WHERE deleted_at IS NULL`,
      sql`SELECT
            (SELECT count(*) FROM organizations)::int AS orgs,
            (SELECT count(*) FROM products WHERE archived_at IS NULL)::int AS products,
            (SELECT count(*) FROM repositories WHERE is_active)::int AS repos,
            (SELECT count(*) FROM integrations WHERE is_active)::int AS integrations`,
      sql`SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
                 count(*)::int AS value
          FROM intelligence_events
          WHERE created_at >= now() - interval '30 days'
          GROUP BY 1 ORDER BY 1`,
      sql`SELECT max(created_at) AS at FROM intelligence_events`,
      mastraSpanUsage(sql),
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
          label: "products",
          value: entities[0].products,
          hint: `${entities[0].repos} active repos`,
        },
        { label: "integrations", value: entities[0].integrations },
      ],
      more: [
        { label: "organizations", value: entities[0].orgs },
        { label: "new users 30d", value: users[0].new30 },
      ],
      llm,
      series: {
        label: "intel events / day",
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

// ── Drill-down loaders (/kasava page) ───────────────────────────────────────

export async function kasavaSeries90(): Promise<ActivitySeries | null> {
  const sql = db("KASAVA_DATABASE_URL");
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
             count(*)::int AS value
      FROM intelligence_events
      WHERE created_at >= now() - interval '90 days'
      GROUP BY 1 ORDER BY 1`;
    return {
      label: "intel events / day",
      points: fillDays(
        rows.map((r) => ({ day: r.day as string, value: r.value as number })),
        90,
      ),
    };
  } catch {
    return null;
  }
}

export async function kasavaProduct(): Promise<ProductBreakdown[]> {
  const sql = db("KASAVA_DATABASE_URL");
  if (!sql) return [];
  try {
    const [byType, bySource] = await Promise.all([
      sql<LabeledRow[]>`SELECT event_type AS label, count(*)::int AS value
          FROM intelligence_events
          WHERE created_at >= now() - interval '30 days'
          GROUP BY 1 ORDER BY 2 DESC LIMIT 12`,
      sql<LabeledRow[]>`SELECT coalesce(source, '—') AS label, count(*)::int AS value
          FROM intelligence_events
          WHERE created_at >= now() - interval '30 days'
          GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
    ]);
    const rows = (r: LabeledRow[]) =>
      r.map((x) => ({ label: String(x.label), value: Number(x.value) }));
    return [
      { title: "intel events by type · 30d", rows: rows(byType) },
      { title: "intel events by source · 30d", rows: rows(bySource) },
    ];
  } catch {
    return [];
  }
}

export async function kasavaLlmDaily() {
  const sql = db("KASAVA_DATABASE_URL");
  if (!sql) return null;
  try {
    return foldDailySpend(await mastraDailySpend(sql));
  } catch {
    return null;
  }
}
