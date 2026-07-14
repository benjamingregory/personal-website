import type { DailyPoint } from "./metrics/types";

export type PosthogProject = "JOBFLOW" | "KASAVA" | "MONROE" | "WEBSITE";

export interface WebAnalytics {
  configured: boolean;
  error?: string;
  visitors7d?: number;
  visitors30d?: number;
  pageviews30d?: number;
  logins30d?: number;
  daily?: DailyPoint[]; // unique visitors per day, last 30 days
}

// Event that counts as a "login" per product, where one exists. PostHog's
// own $identify is too noisy (fires on every page load for a known user).
// None of the products emit a dedicated sign-in event yet — add entries here
// as they get instrumented, e.g. MONROE: "user_signed_in".
const LOGIN_EVENTS: Partial<Record<PosthogProject, string>> = {};

interface Config {
  projectId: string;
  apiKey: string;
  host: string;
}

function config(project: PosthogProject): Config | null {
  const projectId = process.env[`POSTHOG_PROJECT_ID_${project}`];
  const apiKey =
    process.env[`POSTHOG_API_KEY_${project}`] ?? process.env.POSTHOG_API_KEY;
  if (!projectId || !apiKey) return null;
  return {
    projectId,
    apiKey,
    host: process.env.POSTHOG_HOST ?? "https://us.posthog.com",
  };
}

async function hogql(cfg: Config, query: string): Promise<unknown[][]> {
  const res = await fetch(`${cfg.host}/api/projects/${cfg.projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PostHog ${res.status}: ${body.slice(0, 160)}`);
  }
  const data = (await res.json()) as { results?: unknown[][] };
  return data.results ?? [];
}

export async function webAnalytics(
  project: PosthogProject,
): Promise<WebAnalytics> {
  const cfg = config(project);
  if (!cfg) return { configured: false };

  const loginEvent = LOGIN_EVENTS[project];
  try {
    const [totals, daily] = await Promise.all([
      hogql(
        cfg,
        `SELECT
           uniq(person_id),
           count(),
           uniqIf(person_id, timestamp >= now() - INTERVAL 7 DAY)
           ${loginEvent ? `, countIf(event = '${loginEvent}')` : ""}
         FROM events
         WHERE (event = '$pageview' ${loginEvent ? `OR event = '${loginEvent}'` : ""})
           AND timestamp >= now() - INTERVAL 30 DAY`,
      ),
      hogql(
        cfg,
        `SELECT toDate(timestamp) AS day, uniq(person_id) AS visitors
         FROM events
         WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY
         GROUP BY day ORDER BY day`,
      ),
    ]);

    const t = totals[0] ?? [];
    return {
      configured: true,
      visitors30d: Number(t[0] ?? 0),
      pageviews30d: Number(t[1] ?? 0),
      visitors7d: Number(t[2] ?? 0),
      logins30d: loginEvent ? Number(t[3] ?? 0) : undefined,
      daily: daily.map((r) => ({
        day: String(r[0]),
        value: Number(r[1]),
      })),
    };
  } catch (error) {
    return {
      configured: true,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
