import type { ActivitySeries, ProjectReport, Stat } from "@/lib/metrics/types";
import {
  compact,
  estimateUsd,
  fmtUsd,
  type LlmUsageWindows,
} from "@/lib/metrics/llm-usage";
import type { Breakdown, WebAnalytics } from "@/lib/posthog";
import type { DeployStatus } from "@/lib/vercel";
import { age, fmt } from "@/lib/format";

// Shared metric primitives — the overview cards and the /[project]
// drill-down pages render the same vocabulary.

export function StatTile({ stat }: { stat: Stat }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {stat.label}
      </div>
      <div className="mt-1 text-2xl tabular-nums text-ink">
        {stat.display ?? fmt(stat.value)}
      </div>
      {stat.hint && (
        <div className="mt-0.5 text-[11px] text-ink-dim">{stat.hint}</div>
      )}
    </div>
  );
}

// Micro-label that opens a metric block.
export function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
      {children}
    </div>
  );
}

// Ranked list — top pages, referrers, product events. Long labels (URL paths,
// snake_case event names) truncate rather than wrap, so rows stay one line and
// the numbers keep a straight right edge.
export function BreakdownList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: Breakdown[] | undefined;
  empty: string;
}) {
  // min-w-0 all the way down: a grid/flex item defaults to min-width:auto, so
  // without it a long path would push the whole block wider than the phone.
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

// Per-model cost table, 30d spend descending — the "which model is eating
// the budget" view.
export function ModelTable({ llm }: { llm: LlmUsageWindows }) {
  const by30 = new Map(llm.last30d.map((r) => [r.model, r]));
  const rows = llm.allTime
    .map((all) => {
      const m30 = by30.get(all.model);
      return {
        model: all.model,
        calls30: m30?.calls ?? 0,
        tokens30: m30 ? m30.inputTokens + m30.outputTokens : 0,
        usd30: m30 ? estimateUsd([m30]) : 0,
        usdAll: estimateUsd([all]),
      };
    })
    .sort((a, b) => b.usd30 - a.usd30 || b.usdAll - a.usdAll);
  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">
            <th className="pb-1.5 text-left font-normal">model</th>
            <th className="pb-1.5 text-right font-normal">calls 30d</th>
            <th className="pb-1.5 text-right font-normal">tokens 30d</th>
            <th className="pb-1.5 pl-3 text-right font-normal">$ 30d</th>
            <th className="pb-1.5 pl-3 text-right font-normal">$ all-time</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((r) => (
            <tr key={r.model} className="border-t border-rule-soft">
              <td
                className="max-w-44 truncate py-1.5 pr-3 text-ink-dim"
                title={r.model}
              >
                {r.model}
              </td>
              <td className="py-1.5 text-right text-ink">{fmt(r.calls30)}</td>
              <td className="py-1.5 text-right text-ink">
                {compact(r.tokens30)}
              </td>
              <td className="py-1.5 pl-3 text-right text-ink">
                {fmtUsd(r.usd30)}
              </td>
              <td className="py-1.5 pl-3 text-right text-ink-dim">
                {fmtUsd(r.usdAll)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Shared derivations ──────────────────────────────────────────────────────

export function analyticsStats(a: WebAnalytics): Stat[] {
  return [
    { label: "visitors 30d", value: a.visitors30d ?? null },
    { label: "visitors 7d", value: a.visitors7d ?? null },
    { label: "pageviews 30d", value: a.pageviews30d ?? null },
    ...(a.logins30d != null
      ? [{ label: "logins 30d", value: a.logins30d }]
      : []),
  ];
}

// The DB-less website has no activity series of its own — its sparkline
// draws daily unique visitors instead.
export function visitorSeries(a: WebAnalytics): ActivitySeries | null {
  if (!a.trend || a.trend.length === 0) return null;
  return {
    label: "visitors / day",
    points: a.trend.map((p) => ({ day: p.day, value: p.visitors })),
  };
}

export function latency(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

// Compact header meta: source latency + deploy state at a glance.
export function headerMeta(report: ProjectReport, deploy: DeployStatus): string {
  const parts: string[] = [];
  if (report.configured && !report.error && report.latencyMs != null) {
    parts.push(`db ${latency(report.latencyMs)}`);
  }
  if (deploy.configured && !deploy.error && deploy.state) {
    if (deploy.state === "READY") {
      parts.push(
        deploy.createdAt ? `deploy ok · ${age(deploy.createdAt)}` : "deploy ok",
      );
    } else if (deploy.state === "ERROR") {
      parts.push("deploy failed");
    } else if (deploy.state === "CANCELED") {
      parts.push("deploy canceled");
    } else {
      parts.push("deploying…");
    }
  }
  return parts.join(" · ");
}
