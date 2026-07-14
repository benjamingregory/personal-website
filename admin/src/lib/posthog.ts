import type { DailyPoint } from "./metrics/types";

export type PosthogProject = "JOBFLOW" | "KASAVA" | "MONROE" | "WEBSITE";

// A ranked row in one of the breakdown lists (top pages, sources, events).
export interface Breakdown {
  label: string;
  value: number;
  // Secondary number shown dim to the right of `value`, e.g. "3 people".
  hint?: string;
}

export interface WebAnalytics {
  configured: boolean;
  error?: string;
  visitors7d?: number;
  visitors30d?: number;
  pageviews30d?: number;
  logins30d?: number;
  daily?: DailyPoint[]; // unique visitors per day, last 30 days
  topPages?: Breakdown[];
  sources?: Breakdown[];
  events?: Breakdown[]; // product events (non-`$`), 30d
}

// Event that counts as a "login" per product, where one exists. PostHog's
// own $identify is too noisy (fires on every page load for a known user).
// None of the products emit a dedicated sign-in event yet — add entries here
// as they get instrumented, e.g. MONROE: "user_signed_in".
const LOGIN_EVENTS: Partial<Record<PosthogProject, string>> = {};

// Jobflow and the personal site share one PostHog project (free-tier account),
// so their sections split the same event stream by host.
//
// It has to be an exact-host allowlist, not a LIKE: Jobflow is served from
// jobflow.benjaminrgregory.com, a *subdomain* of the personal site's own apex,
// so any `$host LIKE '%benjaminrgregory.com'` test matches both products (and
// the admin) and silently files Jobflow's traffic under the personal site.
// Projects with their own PostHog project need no entry. Drop these once that
// account gets separate projects.
const PROJECT_HOSTS: Partial<Record<PosthogProject, string[]>> = {
  WEBSITE: ["benjaminrgregory.com", "www.benjaminrgregory.com"],
  JOBFLOW: ["jobflow.benjaminrgregory.com", "jobflow-fawn.vercel.app"],
};

// Local dev is the operator's own machine, not a user — counting it would make
// a dead product look alive. Preview deploys are excluded the same way, by
// being absent from PROJECT_HOSTS above.
const DEV_HOSTS =
  "(properties.$host LIKE 'localhost%' OR properties.$host LIKE '127.0.0.1%')";

// Events PostHog itself emits during setup — never product signal.
const NOISE_EVENTS = ["setup_check"];

function hostClause(project: PosthogProject): string {
  const hosts = PROJECT_HOSTS[project];
  if (hosts) {
    // An exact allowlist already excludes localhost, so no DEV_HOSTS needed.
    return ` AND properties.$host IN (${hosts.map((h) => `'${h}'`).join(", ")})`;
  }
  return ` AND NOT ${DEV_HOSTS}`;
}

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

function people(n: unknown): string {
  const count = Number(n ?? 0);
  return `${count.toLocaleString("en-US")} ${count === 1 ? "person" : "people"}`;
}

export async function webAnalytics(
  project: PosthogProject,
): Promise<WebAnalytics> {
  const cfg = config(project);
  if (!cfg) return { configured: false };

  const loginEvent = LOGIN_EVENTS[project];
  const scope = hostClause(project);
  const noise = NOISE_EVENTS.map((e) => `'${e}'`).join(", ");

  try {
    const [totals, daily, topPages, sources, events] = await Promise.all([
      hogql(
        cfg,
        `SELECT
           uniq(person_id),
           count(),
           uniqIf(person_id, timestamp >= now() - INTERVAL 7 DAY)
           ${loginEvent ? `, countIf(event = '${loginEvent}')` : ""}
         FROM events
         WHERE (event = '$pageview' ${loginEvent ? `OR event = '${loginEvent}'` : ""})
           AND timestamp >= now() - INTERVAL 30 DAY${scope}`,
      ),
      hogql(
        cfg,
        `SELECT toDate(timestamp) AS day, uniq(person_id) AS visitors
         FROM events
         WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY${scope}
         GROUP BY day ORDER BY day`,
      ),
      hogql(
        cfg,
        `SELECT properties.$pathname AS path, count() AS views, uniq(person_id) AS visitors
         FROM events
         WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY${scope}
         GROUP BY path ORDER BY views DESC LIMIT 5`,
      ),
      // A direct hit reaches us two ways — PostHog's "$direct" sentinel, and a
      // null/empty referrer on events it didn't stamp. Fold both into one
      // bucket in SQL, or the list renders "direct" twice.
      hogql(
        cfg,
        `SELECT
           coalesce(nullIf(nullIf(properties.$referring_domain, '$direct'), ''), 'direct') AS source,
           uniq(person_id) AS visitors
         FROM events
         WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY${scope}
         GROUP BY source ORDER BY visitors DESC LIMIT 5`,
      ),
      hogql(
        cfg,
        `SELECT event, count() AS c, uniq(person_id) AS people
         FROM events
         WHERE NOT startsWith(event, '$') AND event NOT IN (${noise})
           AND timestamp >= now() - INTERVAL 30 DAY${scope}
         GROUP BY event ORDER BY c DESC LIMIT 5`,
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
      topPages: topPages.map((r) => ({
        label: String(r[0] || "/"),
        value: Number(r[1]),
        hint: people(r[2]),
      })),
      sources: sources.map((r) => ({
        label: String(r[0] ?? "direct"),
        value: Number(r[1]),
      })),
      events: events.map((r) => ({
        label: String(r[0]),
        value: Number(r[1]),
        hint: people(r[2]),
      })),
    };
  } catch (error) {
    return {
      configured: true,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
