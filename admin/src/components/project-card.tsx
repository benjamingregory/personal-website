import Link from "next/link";
import type { ProjectDef } from "@/lib/projects";
import type { Stat } from "@/lib/metrics/types";
import { spendTile } from "@/lib/metrics/llm-usage";
import { loadSnapshot } from "@/lib/snapshot";
import { fmt, relative } from "@/lib/format";
import { Sparkline } from "./sparkline";
import { StatusDot, STATUS_TEXT } from "./status-dot";
import {
  analyticsStats,
  headerMeta,
  StatTile,
  visitorSeries,
} from "./metric-bits";

export async function ProjectCard({ project }: { project: ProjectDef }) {
  const { report, analytics, deploy, checks, status } = await loadSnapshot(
    project.key,
  );

  const analyticsOk = analytics.configured && !analytics.error;

  // DB projects lead with product counts plus the LLM spend tile; the
  // DB-less website promotes analytics numbers to the card face instead.
  const stats: Stat[] =
    report.stats.length > 0
      ? [...report.stats, ...(report.llm ? [spendTile(report.llm)] : [])]
      : analyticsOk
        ? analyticsStats(analytics)
        : [];

  const series = report.series ?? (analyticsOk ? visitorSeries(analytics) : null);
  const lastSeen = relative(report.lastActivityAt);
  const meta = headerMeta(report, deploy);

  const footer = [
    analyticsOk && `visits ${fmt(analytics.visitors7d)} / 7d`,
    analyticsOk && `err ${fmt(analytics.exceptions24h)} / 24h`,
    project.db && lastSeen && `last activity ${lastSeen}`,
  ].filter(Boolean) as string[];

  return (
    <section
      id={project.key}
      className="flex scroll-mt-6 flex-col border border-t-2 border-rule-soft bg-panel p-5"
      style={{ borderTopColor: project.accent }}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-2.5">
          <span className="self-center">
            <StatusDot status={status} />
          </span>
          <h2 className="text-sm font-semibold tracking-wide">
            <Link
              href={`/${project.key}`}
              prefetch={false}
              className="text-ink hover:text-ink-dim"
            >
              {project.name}
            </Link>
          </h2>
        </div>
        {meta && (
          <p className="text-[10px] tabular-nums text-ink-faint">{meta}</p>
        )}
      </header>

      {checks.length > 0 && (
        <ul className="mt-3 space-y-1">
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

      {!report.error &&
        (stats.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {stats.map((s) => (
              <StatTile key={s.label} stat={s} />
            ))}
          </div>
        ) : (
          <p className="mt-5 text-xs text-ink-faint">
            no sources wired for this project yet
          </p>
        ))}

      {series && (
        <div className="mt-5">
          <Sparkline
            points={series.points}
            label={series.label}
            accent={project.accent}
          />
        </div>
      )}

      {footer.length > 0 && (
        <p className="mt-4 text-[11px] text-ink-dim">{footer.join(" · ")}</p>
      )}

      <div className="mt-auto border-t border-rule-soft pt-3 [&>a]:mt-1">
        <Link
          href={`/${project.key}`}
          prefetch={false}
          className="inline-block text-[10px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink-dim"
        >
          diagnostics →
        </Link>
      </div>
    </section>
  );
}

export function CardSkeleton({ project }: { project: ProjectDef }) {
  return (
    <section
      className="animate-pulse border border-t-2 border-rule-soft bg-panel p-5"
      style={{ borderTopColor: project.accent }}
    >
      <header className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2.5">
          <span className="inline-block size-2 self-center rounded-full bg-rule" />
          <h2 className="text-sm font-semibold tracking-wide text-ink-dim">
            {project.name}
          </h2>
        </div>
        <div className="h-2.5 w-24 rounded bg-ground" />
      </header>
      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-2 w-14 rounded bg-ground" />
            <div className="mt-2 h-7 w-16 rounded bg-ground" />
          </div>
        ))}
      </div>
      <div className="mt-5 h-16 rounded bg-ground" />
      <div className="mt-4 h-2.5 w-56 rounded bg-ground" />
    </section>
  );
}
