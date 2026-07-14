import type { ProjectDef } from "@/lib/projects";
import type { Stat } from "@/lib/metrics/types";
import { webAnalytics, type Breakdown, type WebAnalytics } from "@/lib/posthog";
import { Sparkline } from "./sparkline";

function fmt(n: number | null | undefined): string {
  return n == null ? "—" : n.toLocaleString("en-US");
}

function relative(date: Date | null): string | null {
  if (!date) return null;
  const mins = Math.round((Date.now() - date.getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function StatTile({ stat }: { stat: Stat }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {stat.label}
      </div>
      <div className="mt-1 text-3xl tabular-nums text-ink">
        {stat.display ?? fmt(stat.value)}
      </div>
      {stat.hint && (
        <div className="mt-0.5 text-xs text-ink-dim">{stat.hint}</div>
      )}
    </div>
  );
}

// Micro-label that opens each sub-row under the headline stats.
function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
      {children}
    </div>
  );
}

// Ranked list — top pages, referrers, product events. Long labels (URL paths,
// snake_case event names) truncate rather than wrap, so rows stay one line and
// the numbers keep a straight right edge.
function BreakdownList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: Breakdown[] | undefined;
  empty: string;
}) {
  // min-w-0 all the way down: a grid/flex item defaults to min-width:auto, so
  // without it a long path would push the whole section wider than the phone.
  return (
    <div className="min-w-0">
      <RowLabel>{title}</RowLabel>
      {!rows || rows.length === 0 ? (
        <p className="mt-3 text-xs text-ink-faint">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {rows.map((row, i) => (
            <li
              key={`${row.label}-${i}`}
              className="flex items-baseline gap-2 text-xs leading-relaxed"
            >
              <span className="min-w-0 truncate text-ink-dim" title={row.label}>
                {row.label}
              </span>
              <span className="ml-auto shrink-0 tabular-nums text-ink">
                {fmt(row.value)}
              </span>
              {row.hint && (
                <span className="shrink-0 text-[10px] text-ink-faint">
                  {row.hint}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function analyticsStats(a: WebAnalytics): Stat[] {
  return [
    { label: "visitors 30d", value: a.visitors30d ?? null },
    { label: "visitors 7d", value: a.visitors7d ?? null },
    { label: "pageviews 30d", value: a.pageviews30d ?? null },
    ...(a.logins30d != null
      ? [{ label: "logins 30d", value: a.logins30d }]
      : []),
  ];
}

function AnalyticsLine({
  analytics,
  project,
}: {
  analytics: WebAnalytics;
  project: ProjectDef;
}) {
  if (!analytics.configured) {
    return (
      <p className="text-xs text-ink-faint">
        posthog not wired · set POSTHOG_PROJECT_ID_{project.posthog} +
        POSTHOG_API_KEY
      </p>
    );
  }
  if (analytics.error) {
    return (
      <p className="text-xs text-err">posthog — {analytics.error}</p>
    );
  }
  return (
    <div className="space-y-1">
      <p className="text-xs text-ink-dim">
        <span className="text-ink-faint">visits</span>{" "}
        {fmt(analytics.visitors30d)} / 30d · {fmt(analytics.visitors7d)} / 7d ·{" "}
        {fmt(analytics.pageviews30d)} views
        {analytics.logins30d != null && ` · ${fmt(analytics.logins30d)} logins`}
      </p>
      {/* Numbers here are lower than PostHog's own UI shows, on purpose. */}
      <p className="text-[10px] text-ink-faint">
        production hosts only · localhost and previews excluded
      </p>
    </div>
  );
}

export async function ProjectSection({
  project,
  index,
}: {
  project: ProjectDef;
  index: number;
}) {
  const [report, analytics] = await Promise.all([
    project.load(),
    webAnalytics(project.posthog),
  ]);

  // DB-less projects (the website) promote analytics numbers to the
  // headline stat row; sparkline falls back to daily unique visitors.
  const stats =
    report.stats.length > 0
      ? report.stats
      : analytics.configured && !analytics.error
        ? analyticsStats(analytics)
        : [];

  const series =
    report.series ??
    (analytics.daily && analytics.daily.length > 0
      ? { label: "visitors / day", points: analytics.daily }
      : null);

  const dbState = !report.configured
    ? { color: "var(--color-warn)", text: "db not wired" }
    : report.error
      ? { color: "var(--color-err)", text: "db unreachable" }
      : { color: "var(--color-ok)", text: "db live" };
  const lastSeen = relative(report.lastActivityAt);

  return (
    <section
      className="section-enter grid gap-x-10 gap-y-8 border-b border-rule-soft py-10 lg:grid-cols-12"
      style={{ "--stagger": index } as React.CSSProperties}
    >
      <header className="lg:col-span-3">
        <div
          className="h-[3px] w-8"
          style={{ backgroundColor: project.accent }}
        />
        <h2 className="mt-3 font-display text-3xl tracking-tight text-ink">
          {project.name}
        </h2>
        <p className="mt-1 text-xs text-ink-dim">{project.descriptor}</p>
        <p className="mt-4 flex items-center gap-2 text-[11px] text-ink-faint">
          {project.key !== "website" && (
            <>
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full"
                style={{ backgroundColor: dbState.color }}
              />
              {dbState.text}
              {lastSeen && ` · last activity ${lastSeen}`}
            </>
          )}
        </p>
      </header>

      <div className="min-w-0 content-start lg:col-span-6">
        {report.error ? (
          <p className="text-sm text-err">{report.error}</p>
        ) : stats.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <StatTile key={s.label} stat={s} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-faint">
            No sources wired for this project yet.
          </p>
        )}
        {report.usage && report.usage.length > 0 && (
          <div className="mt-8 border-t border-rule-soft pt-6">
            <RowLabel>llm usage</RowLabel>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {report.usage.map((s) => (
                <StatTile key={s.label} stat={s} />
              ))}
            </div>
          </div>
        )}
        {analytics.configured && !analytics.error && (
          <div className="mt-8 grid gap-x-8 gap-y-6 border-t border-rule-soft pt-6 sm:grid-cols-2">
            <BreakdownList
              title="top pages · 30d"
              rows={analytics.topPages}
              empty="no pageviews yet"
            />
            <BreakdownList
              title="sources · 30d"
              rows={analytics.sources}
              empty="no referrers yet"
            />
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-4 lg:col-span-3">
        {series && (
          <Sparkline
            points={series.points}
            label={series.label}
            accent={project.accent}
          />
        )}
        <AnalyticsLine analytics={analytics} project={project} />
        {analytics.configured && !analytics.error && (
          <div className="border-t border-rule-soft pt-4">
            <BreakdownList
              title="product events · 30d"
              rows={analytics.events}
              empty="none instrumented yet"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionSkeleton({
  project,
  index,
}: {
  project: ProjectDef;
  index: number;
}) {
  return (
    <section
      className="section-enter grid animate-pulse gap-x-10 gap-y-8 border-b border-rule-soft py-10 lg:grid-cols-12"
      style={{ "--stagger": index } as React.CSSProperties}
    >
      <header className="lg:col-span-3">
        <div
          className="h-[3px] w-8"
          style={{ backgroundColor: project.accent }}
        />
        <h2 className="mt-3 font-display text-3xl tracking-tight text-ink-dim">
          {project.name}
        </h2>
        <p className="mt-1 text-xs text-ink-faint">{project.descriptor}</p>
      </header>
      <div className="lg:col-span-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-2 w-16 rounded bg-panel" />
              <div className="mt-2 h-8 w-20 rounded bg-panel" />
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="h-2 w-24 rounded bg-panel" />
        <div className="mt-3 h-14 rounded bg-panel" />
      </div>
    </section>
  );
}
