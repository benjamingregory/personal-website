import { Suspense } from "react";
import { notFound } from "next/navigation";
import { findProject, type ProjectDef } from "@/lib/projects";
import { loadSnapshot } from "@/lib/snapshot";
import {
  loadDeployHistory,
  loadLlmDaily,
  loadProduct,
  loadSeries90,
  loadTrafficDetail,
} from "@/lib/detail";
import { spendTile, usageStats } from "@/lib/metrics/llm-usage";
import type { Stat } from "@/lib/metrics/types";
import { fmt, relative } from "@/lib/format";
import { PrevNext } from "@/components/prev-next";
import { Section } from "@/components/section";
import { Sparkline } from "@/components/sparkline";
import { TrendChart } from "@/components/trend-chart";
import { StatusDot, STATUS_TEXT } from "@/components/status-dot";
import {
  analyticsStats,
  BreakdownList,
  headerMeta,
  ModelTable,
  RowLabel,
  StatTile,
} from "@/components/metric-bits";

// Always render live — every load reads the databases directly.
export const dynamic = "force-dynamic";

type Params = Promise<{ project: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { project } = await params;
  const def = findProject(project);
  return { title: def ? `Operations — ${def.name}` : "Operations" };
}

// Fixed section order shared by all four projects; a project without a
// source skips the section without reordering the rest.
function sectionsFor(project: ProjectDef): { id: string; title: string }[] {
  return [
    project.detail?.series90 && { id: "activity", title: "activity · 90d" },
    { id: "traffic", title: "traffic · 30d" },
    { id: "errors", title: "errors · 30d" },
    project.db && { id: "llm", title: "llm usage" },
    { id: "deploys", title: "deploys" },
    project.detail?.product && { id: "product", title: "product" },
  ].filter(Boolean) as { id: string; title: string }[];
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { project: key } = await params;
  const project = findProject(key);
  if (!project) notFound();

  const sections = sectionsFor(project);

  return (
    <main className="mx-auto max-w-6xl px-6 pt-6">
      <Suspense fallback={<HeaderSkeleton project={project} />}>
        <ProjectHeader project={project} />
      </Suspense>

      {/* Section anchor row — the shells below render synchronously, so
          these targets exist even while section bodies are still streaming. */}
      <nav
        aria-label="sections"
        className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[10px] uppercase tracking-[0.2em]"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-ink-faint hover:text-ink-dim"
          >
            {s.id}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-12">
        {sections.map((s) => (
          <Section key={s.id} id={s.id} title={s.title}>
            {s.id === "activity" && <ActivityBody project={project} />}
            {s.id === "traffic" && <TrafficBody project={project} />}
            {s.id === "errors" && <ErrorsBody project={project} />}
            {s.id === "llm" && <LlmBody project={project} />}
            {s.id === "deploys" && <DeploysBody project={project} />}
            {s.id === "product" && <ProductBody project={project} />}
          </Section>
        ))}
      </div>

      <div className="mt-12">
        <PrevNext current={project.key} />
      </div>
    </main>
  );
}

// ── Header ──────────────────────────────────────────────────────────────────

async function ProjectHeader({ project }: { project: ProjectDef }) {
  const { report, analytics, deploy, checks, status } = await loadSnapshot(
    project.key,
  );
  const analyticsOk = analytics.configured && !analytics.error;
  const stats: Stat[] =
    report.stats.length > 0
      ? [
          ...report.stats,
          ...(report.llm ? [spendTile(report.llm)] : []),
          ...(report.more ?? []),
        ]
      : analyticsOk
        ? analyticsStats(analytics)
        : [];
  const meta = headerMeta(report, deploy);
  const lastSeen = relative(report.lastActivityAt);

  return (
    <header
      className="border-t-2 pt-4"
      style={{ borderTopColor: project.accent }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-2.5">
          <span className="self-center">
            <StatusDot status={status} />
          </span>
          <h2 className="text-lg font-semibold tracking-wide text-ink">
            {project.name}
          </h2>
          <span className="text-xs text-ink-dim">{project.descriptor}</span>
        </div>
        <p className="text-[10px] tabular-nums text-ink-faint">
          {[meta, lastSeen && `last activity ${lastSeen}`]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      {checks.length > 0 && (
        <ul id="checks" className="mt-3 space-y-1">
          {checks.map((c) => (
            <li
              key={`${c.name}-${c.detail}`}
              className={`text-xs ${STATUS_TEXT[c.status]}`}
            >
              {c.detail}
            </li>
          ))}
        </ul>
      )}

      {report.error ? null : stats.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {stats.map((s) => (
            <StatTile key={s.label} stat={s} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-xs text-ink-faint">
          no sources wired for this project yet
        </p>
      )}
    </header>
  );
}

function HeaderSkeleton({ project }: { project: ProjectDef }) {
  return (
    <header
      className="animate-pulse border-t-2 pt-4"
      style={{ borderTopColor: project.accent }}
    >
      <div className="flex items-baseline gap-2.5">
        <span className="inline-block size-2 self-center rounded-full bg-rule" />
        <h2 className="text-lg font-semibold tracking-wide text-ink-dim">
          {project.name}
        </h2>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-2 w-14 rounded bg-panel" />
            <div className="mt-2 h-7 w-16 rounded bg-panel" />
          </div>
        ))}
      </div>
    </header>
  );
}

// ── Section bodies (each awaits only its own loader) ────────────────────────

async function ActivityBody({ project }: { project: ProjectDef }) {
  const series = await loadSeries90(project.key);
  if (!series) {
    return <p className="text-xs text-ink-faint">no activity source wired</p>;
  }
  return (
    <Sparkline
      points={series.points}
      label={series.label}
      accent={project.accent}
    />
  );
}

async function TrafficBody({ project }: { project: ProjectDef }) {
  const [{ analytics }, detail] = await Promise.all([
    loadSnapshot(project.key),
    loadTrafficDetail(project.key),
  ]);
  if (!analytics.configured || !detail.configured) {
    return (
      <p className="text-xs text-ink-faint">
        posthog not wired · set POSTHOG_PROJECT_ID_{project.posthog} +
        POSTHOG_API_KEY
      </p>
    );
  }
  if (analytics.error || detail.error) {
    return (
      <p className="text-xs text-err">
        posthog — {analytics.error ?? detail.error}
      </p>
    );
  }
  return (
    <div className="space-y-8">
      {analytics.trend && analytics.trend.length > 0 && (
        <TrendChart points={analytics.trend} accent={project.accent} title="" />
      )}
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        <BreakdownList
          title="top pages · 30d"
          rows={detail.topPages}
          empty="no pageviews yet"
        />
        <BreakdownList
          title="sources · 30d"
          rows={detail.sources}
          empty="no referrers yet"
        />
        <BreakdownList
          title="product events · 30d"
          rows={detail.events}
          empty="none instrumented yet"
        />
        <BreakdownList
          title="countries · 30d"
          rows={detail.countries}
          empty="no pageviews yet"
        />
        <BreakdownList
          title="devices · 30d"
          rows={detail.devices}
          empty="no pageviews yet"
        />
        <BreakdownList
          title="browsers · 30d"
          rows={detail.browsers}
          empty="no pageviews yet"
        />
      </div>
      {/* Numbers here are lower than PostHog's own UI shows, on purpose. */}
      <p className="text-[10px] text-ink-faint">
        production hosts only · localhost and previews excluded
      </p>
    </div>
  );
}

async function ErrorsBody({ project }: { project: ProjectDef }) {
  const [{ analytics }, detail] = await Promise.all([
    loadSnapshot(project.key),
    loadTrafficDetail(project.key),
  ]);
  if (!analytics.configured || !detail.configured) {
    return <p className="text-xs text-ink-faint">posthog not wired</p>;
  }
  if (analytics.error || detail.error) {
    return (
      <p className="text-xs text-err">
        posthog — {analytics.error ?? detail.error}
      </p>
    );
  }
  const total30d = (detail.exceptionsDaily ?? []).reduce(
    (sum, p) => sum + p.value,
    0,
  );
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <StatTile
          stat={{ label: "exceptions 24h", value: analytics.exceptions24h ?? 0 }}
        />
        <StatTile
          stat={{ label: "exceptions 7d", value: analytics.exceptions7d ?? 0 }}
        />
        <StatTile stat={{ label: "exceptions 30d", value: total30d }} />
      </div>
      {detail.exceptionsDaily && total30d > 0 && (
        <Sparkline
          points={detail.exceptionsDaily}
          label="exceptions / day"
          accent="var(--color-err)"
        />
      )}
      <BreakdownList
        title="by exception type · 30d"
        rows={detail.exceptionGroups}
        empty="none — quiet on the error front"
      />
    </div>
  );
}

async function LlmBody({ project }: { project: ProjectDef }) {
  const [{ report }, daily] = await Promise.all([
    loadSnapshot(project.key),
    loadLlmDaily(project.key),
  ]);
  const llm = report.llm;
  if (!llm || llm.allTime.length === 0) {
    return <p className="text-xs text-ink-faint">no llm usage recorded</p>;
  }
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        {usageStats(llm.last30d, llm.allTime).map((s) => (
          <StatTile key={s.label} stat={s} />
        ))}
      </div>
      {daily && daily.some((p) => p.value > 0) && (
        <Sparkline
          points={daily}
          label="est. spend / day"
          accent={project.accent}
          prefix="$"
        />
      )}
      <ModelTable llm={llm} />
    </div>
  );
}

async function DeploysBody({ project }: { project: ProjectDef }) {
  const history = await loadDeployHistory(project.key);
  if (!history.configured) {
    return (
      <p className="text-xs text-ink-faint">
        vercel not wired · set VERCEL_TOKEN + VERCEL_PROJECT_ID_
        {project.posthog}
      </p>
    );
  }
  if (history.error) {
    return <p className="text-xs text-err">vercel — {history.error}</p>;
  }
  if (history.deploys.length === 0) {
    return <p className="text-xs text-ink-faint">no production deploys yet</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">
            <th className="pb-1.5 text-left font-normal">state</th>
            <th className="pb-1.5 text-left font-normal">when</th>
            <th className="pb-1.5 text-right font-normal">build</th>
            <th className="pb-1.5 pl-4 text-left font-normal">commit</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {history.deploys.map((d, i) => (
            <tr key={`${d.url}-${i}`} className="border-t border-rule-soft">
              <td className="py-1.5 pr-3">
                <span
                  className={
                    d.state === "READY"
                      ? "text-ok"
                      : d.state === "ERROR"
                        ? "text-err"
                        : d.state === "CANCELED"
                          ? "text-warn"
                          : "text-ink-dim"
                  }
                >
                  {(d.state ?? "unknown").toLowerCase()}
                </span>
              </td>
              <td className="py-1.5 pr-3 whitespace-nowrap text-ink-dim">
                {d.createdAt ? relative(d.createdAt) : "—"}
              </td>
              <td className="py-1.5 text-right text-ink-dim">
                {d.buildSeconds != null ? `${d.buildSeconds}s` : "—"}
              </td>
              <td
                className="max-w-72 truncate py-1.5 pl-4 text-ink"
                title={d.commit}
              >
                {d.commit ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function ProductBody({ project }: { project: ProjectDef }) {
  const breakdowns = await loadProduct(project.key);
  if (breakdowns.length === 0) {
    return <p className="text-xs text-ink-faint">no product source wired</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
      {breakdowns.map((b) => (
        <BreakdownList key={b.title} title={b.title} rows={b.rows} empty="—" />
      ))}
    </div>
  );
}
