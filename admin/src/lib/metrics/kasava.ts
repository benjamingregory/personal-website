import { db } from "../db";
import {
  failed,
  fillDays,
  UNCONFIGURED,
  type ProjectReport,
} from "./types";

export async function kasavaMetrics(): Promise<ProjectReport> {
  const sql = db("KASAVA_DATABASE_URL");
  if (!sql) return UNCONFIGURED;

  try {
    const [users, entities, series, last] = await Promise.all([
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
    ]);

    return {
      configured: true,
      stats: [
        {
          label: "users",
          value: users[0].total,
          hint: `+${users[0].new7} past 7d`,
        },
        { label: "organizations", value: entities[0].orgs },
        {
          label: "products",
          value: entities[0].products,
          hint: `${entities[0].repos} active repos`,
        },
        { label: "integrations", value: entities[0].integrations },
      ],
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
