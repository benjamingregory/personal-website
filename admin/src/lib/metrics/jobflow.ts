import { db } from "../db";
import {
  failed,
  fillDays,
  UNCONFIGURED,
  type ProjectReport,
} from "./types";

export async function jobflowMetrics(): Promise<ProjectReport> {
  const sql = db("JOBFLOW_DATABASE_URL");
  if (!sql) return UNCONFIGURED;

  try {
    const [users, evals, apps, series, last] = await Promise.all([
      sql`SELECT
            count(*)::int AS total,
            count(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS new7,
            count(*) FILTER (WHERE created_at >= now() - interval '30 days')::int AS new30
          FROM user_profiles`,
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
        { label: "new users 30d", value: users[0].new30 },
      ],
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
