import { fillDays, type DailyPoint } from "./metrics/types";

export type PosthogProject = "INROLE" | "KASAVA" | "MONROE" | "WEBSITE";

// One day of production web traffic — the two series the trend chart draws.
export interface TrendPoint {
  day: string; // ISO date, e.g. "2026-07-13"
  visitors: number;
  views: number;
}

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
  exceptions24h?: number;
  exceptions7d?: number;
  trend?: TrendPoint[]; // visitors + pageviews per day, last 30 days
  topPages?: Breakdown[];
  sources?: Breakdown[];
  events?: Breakdown[]; // product events (non-`$`), 30d
}

// Event that counts as a "login" per product, where one exists. PostHog's
// own $identify is too noisy (fires on every page load for a known user).
// None of the products emit a dedicated sign-in event yet — add entries here
// as they get instrumented, e.g. MONROE: "user_signed_in".
const LOGIN_EVENTS: Partial<Record<PosthogProject, string>> = {};

// Inrole and the personal site share one PostHog project (free-tier account),
// so their sections split the same event stream by host.
//
// It has to be an exact-host allowlist, not a LIKE: Inrole's historical
// traffic was captured from jobflow.benjaminrgregory.com, a *subdomain* of the
// personal site's own apex, so any `$host LIKE '%benjaminrgregory.com'` test
// matches both products (and the admin) and silently files Inrole's traffic
// under the personal site. The legacy hosts stay listed so pre-rename events
// keep counting. Projects with their own PostHog project need no entry. Drop
// these once that account gets separate projects.
const PROJECT_HOSTS: Partial<Record<PosthogProject, string[]>> = {
  WEBSITE: ["benjaminrgregory.com", "www.benjaminrgregory.com"],
  INROLE: [
    "app.inrole.xyz",
    // Legacy hosts from before the jobflow → inrole rename; keep for history.
    "jobflow.benjaminrgregory.com",
    "jobflow-fawn.vercel.app",
  ],
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

// PostHog only returns days that had events; the chart needs the quiet days
// too so the x-axis stays a stable 30-point run of consecutive dates.
function fillTrend(rows: unknown[][], days = 30): TrendPoint[] {
  const byDay = new Map(rows.map((r) => [String(r[0]), r]));
  const out: TrendPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const row = byDay.get(key);
    out.push({
      day: key,
      visitors: Number(row?.[1] ?? 0),
      views: Number(row?.[2] ?? 0),
    });
  }
  return out;
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
    const [totals, daily, topPages, sources, events, exceptions] =
      await Promise.all([
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
        `SELECT toDate(timestamp) AS day, uniq(person_id) AS visitors, count() AS views
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
      // Error tracking. The host scope stays on so shared-project products
      // (inrole / the personal site) don't count each other's exceptions —
      // the trade-off is that server-side exceptions without a $host are
      // invisible to allowlisted projects.
      hogql(
        cfg,
        `SELECT
           countIf(timestamp >= now() - INTERVAL 24 HOUR),
           count()
         FROM events
         WHERE event = '$exception'
           AND timestamp >= now() - INTERVAL 7 DAY${scope}`,
      ),
    ]);

    const t = totals[0] ?? [];
    const ex = exceptions[0] ?? [];
    return {
      configured: true,
      visitors30d: Number(t[0] ?? 0),
      pageviews30d: Number(t[1] ?? 0),
      visitors7d: Number(t[2] ?? 0),
      logins30d: loginEvent ? Number(t[3] ?? 0) : undefined,
      exceptions24h: Number(ex[0] ?? 0),
      exceptions7d: Number(ex[1] ?? 0),
      trend: fillTrend(daily),
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

// Drill-down analytics: the same 30d window as webAnalytics but wider
// (15-row breakdowns) and deeper (audience + exception facets). Loaded only
// on /[project] pages, never for the overview cards.
export interface WebAnalyticsDetail {
  configured: boolean;
  error?: string;
  topPages?: Breakdown[];
  sources?: Breakdown[];
  events?: Breakdown[];
  countries?: Breakdown[];
  devices?: Breakdown[];
  browsers?: Breakdown[];
  // $exception events grouped by exception type, 30d.
  exceptionGroups?: Breakdown[];
  exceptionsDaily?: DailyPoint[];
}

export async function webAnalyticsDetail(
  project: PosthogProject,
): Promise<WebAnalyticsDetail> {
  const cfg = config(project);
  if (!cfg) return { configured: false };

  const scope = hostClause(project);
  const noise = NOISE_EVENTS.map((e) => `'${e}'`).join(", ");

  const pageviewFacet = (expr: string, alias: string, limit: number) =>
    hogql(
      cfg,
      `SELECT ${expr} AS ${alias}, count() AS c, uniq(person_id) AS people
       FROM events
       WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY${scope}
       GROUP BY ${alias} ORDER BY c DESC LIMIT ${limit}`,
    );

  try {
    const [
      topPages,
      sources,
      events,
      countries,
      devices,
      browsers,
      exceptionGroups,
      exceptionsDaily,
    ] = await Promise.all([
      pageviewFacet("properties.$pathname", "path", 15),
      hogql(
        cfg,
        `SELECT
           coalesce(nullIf(nullIf(properties.$referring_domain, '$direct'), ''), 'direct') AS source,
           uniq(person_id) AS visitors
         FROM events
         WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY${scope}
         GROUP BY source ORDER BY visitors DESC LIMIT 15`,
      ),
      hogql(
        cfg,
        `SELECT event, count() AS c, uniq(person_id) AS people
         FROM events
         WHERE NOT startsWith(event, '$') AND event NOT IN (${noise})
           AND timestamp >= now() - INTERVAL 30 DAY${scope}
         GROUP BY event ORDER BY c DESC LIMIT 15`,
      ),
      pageviewFacet(
        "coalesce(nullIf(properties.$geoip_country_code, ''), 'unknown')",
        "country",
        10,
      ),
      pageviewFacet(
        "coalesce(nullIf(properties.$device_type, ''), 'unknown')",
        "device",
        6,
      ),
      pageviewFacet(
        "coalesce(nullIf(properties.$browser, ''), 'unknown')",
        "browser",
        8,
      ),
      hogql(
        cfg,
        `SELECT coalesce(nullIf(properties.$exception_type, ''), 'unknown') AS kind,
                count() AS c, uniq(person_id) AS people
         FROM events
         WHERE event = '$exception' AND timestamp >= now() - INTERVAL 30 DAY${scope}
         GROUP BY kind ORDER BY c DESC LIMIT 10`,
      ),
      hogql(
        cfg,
        `SELECT toDate(timestamp) AS day, count() AS c
         FROM events
         WHERE event = '$exception' AND timestamp >= now() - INTERVAL 30 DAY${scope}
         GROUP BY day ORDER BY day`,
      ),
    ]);

    const toBreakdown = (rows: unknown[][], withPeople = true): Breakdown[] =>
      rows.map((r) => ({
        label: String(r[0] ?? "unknown"),
        value: Number(r[1]),
        hint: withPeople && r[2] != null ? people(r[2]) : undefined,
      }));

    return {
      configured: true,
      topPages: toBreakdown(topPages),
      sources: toBreakdown(sources, false),
      events: toBreakdown(events),
      countries: toBreakdown(countries),
      devices: toBreakdown(devices),
      browsers: toBreakdown(browsers),
      exceptionGroups: toBreakdown(exceptionGroups),
      exceptionsDaily: fillDays(
        exceptionsDaily.map((r) => ({
          day: String(r[0]),
          value: Number(r[1]),
        })),
      ),
    };
  } catch (error) {
    return {
      configured: true,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
