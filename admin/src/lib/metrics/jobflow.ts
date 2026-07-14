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

export async function jobflowMetrics(): Promise<ProjectReport> {
  const sql = db("JOBFLOW_DATABASE_URL");
  if (!sql) return UNCONFIGURED;

  try {
    const [users, evals, apps, series, last, llm] = await Promise.all([
      // Join auth.users so orphaned profiles left behind by E2E test runs
      // (auth account deleted, profile row not) never inflate the count.
      sql`SELECT
            count(*)::int AS total,
            count(*) FILTER (WHERE up.created_at >= now() - interval '7 days')::int AS new7,
            count(*) FILTER (WHERE up.created_at >= now() - interval '30 days')::int AS new30
          FROM user_profiles up
          JOIN auth.users au ON au.id = up.user_id`,
      sql`SELECT
            count(*)::int AS total,
            count(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS new7
          FROM evaluations`,
      sql`SELECT
            count(*)::int AS total,
            count(*) FILTER (WHERE status NOT IN ('Evaluated', 'SKIP', 'Discarded'))::int AS in_motion
          FROM applications`,
      sql`SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
                 count(*)::int AS value
          FROM evaluations
          WHERE created_at >= now() - interval '30 days'
          GROUP BY 1 ORDER BY 1`,
      sql`SELECT max(created_at) AS at FROM evaluations`,
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
          label: "evaluations",
          value: evals[0].total,
          hint: `+${evals[0].new7} past 7d`,
        },
        {
          label: "applications",
          value: apps[0].total,
          hint: `${apps[0].in_motion} in motion`,
        },
      ],
      more: [{ label: "new users 30d", value: users[0].new30 }],
      llm,
      series: {
        label: "evaluations / day",
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

// ── Drill-down loaders (/{jobflow} page) ────────────────────────────────────

export async function jobflowSeries90(): Promise<ActivitySeries | null> {
  const sql = db("JOBFLOW_DATABASE_URL");
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
             count(*)::int AS value
      FROM evaluations
      WHERE created_at >= now() - interval '90 days'
      GROUP BY 1 ORDER BY 1`;
    return {
      label: "evaluations / day",
      points: fillDays(
        rows.map((r) => ({ day: r.day as string, value: r.value as number })),
        90,
      ),
    };
  } catch {
    return null;
  }
}

export async function jobflowProduct(): Promise<ProductBreakdown[]> {
  const sql = db("JOBFLOW_DATABASE_URL");
  if (!sql) return [];
  try {
    const [byStatus, byArchetype, scoreBuckets, topCompanies] =
      await Promise.all([
        sql<LabeledRow[]>`SELECT status AS label, count(*)::int AS value
            FROM applications GROUP BY 1 ORDER BY 2 DESC`,
        sql<LabeledRow[]>`SELECT coalesce(archetype, '—') AS label, count(*)::int AS value
            FROM evaluations
            WHERE created_at >= now() - interval '30 days'
            GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
        sql<LabeledRow[]>`SELECT CASE
              WHEN score >= 4 THEN '4.0+'
              WHEN score >= 3 THEN '3.0 – 3.9'
              WHEN score >= 2 THEN '2.0 – 2.9'
              ELSE 'under 2.0' END AS label,
            count(*)::int AS value
            FROM evaluations WHERE score IS NOT NULL
            GROUP BY 1 ORDER BY min(score) DESC`,
        sql<LabeledRow[]>`SELECT company AS label, count(*)::int AS value
            FROM evaluations
            WHERE created_at >= now() - interval '30 days' AND company IS NOT NULL
            GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      ]);
    const rows = (r: LabeledRow[]) =>
      r.map((x) => ({ label: String(x.label), value: Number(x.value) }));
    return [
      { title: "applications by status", rows: rows(byStatus) },
      { title: "evaluations by archetype · 30d", rows: rows(byArchetype) },
      { title: "score distribution · all-time", rows: rows(scoreBuckets) },
      { title: "top companies evaluated · 30d", rows: rows(topCompanies) },
    ];
  } catch {
    return [];
  }
}

export async function jobflowLlmDaily() {
  const sql = db("JOBFLOW_DATABASE_URL");
  if (!sql) return null;
  try {
    return foldDailySpend(await mastraDailySpend(sql));
  } catch {
    return null;
  }
}
