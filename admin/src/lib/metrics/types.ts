import type { LlmUsageWindows } from "./llm-usage";
import type { Breakdown } from "../posthog";

// One titled ranked list in a project's drill-down "product" section —
// per-project shape (jobflow: applications by status; monroe: top shows…).
export interface ProductBreakdown {
  title: string;
  rows: Breakdown[];
}

export type CheckStatus = "ok" | "warn" | "err";

// Sections of a project's drill-down page, in render order. Checks carry one
// so the alert row can deep-link from symptom to evidence.
export type DetailSection =
  | "checks"
  | "activity"
  | "traffic"
  | "errors"
  | "llm"
  | "deploys"
  | "product";

// One named health probe on a project — the unit the status strip, the alert
// row, and each card header aggregate from. Green checks stay silent in the
// UI; only warn/err surface.
export interface Check {
  name: "db" | "pulse" | "deploy" | "errors" | "spend" | "posthog";
  status: CheckStatus;
  detail: string;
  // Where the evidence lives on the project's drill-down page.
  section: DetailSection;
}

export function worstStatus(checks: Check[]): CheckStatus {
  if (checks.some((c) => c.status === "err")) return "err";
  if (checks.some((c) => c.status === "warn")) return "warn";
  return "ok";
}

export interface Stat {
  label: string;
  value: number | null;
  // Pre-formatted display value ("$4.12", "12.4M") — overrides the default
  // toLocaleString rendering of `value`.
  display?: string;
  // Small line under the number, e.g. "+4 past 7d".
  hint?: string;
}

export interface DailyPoint {
  // ISO date, e.g. "2026-07-13"
  day: string;
  value: number;
}

export interface ActivitySeries {
  label: string;
  points: DailyPoint[];
}

export interface ProjectReport {
  // null → the project's DATABASE_URL env var isn't set.
  configured: boolean;
  // Card-face headline numbers. Keep to three — the card appends the LLM
  // spend tile as the fourth when `llm` is present.
  stats: Stat[];
  // Detail-only counts rendered inside the drill-down, not on the card face.
  more?: Stat[];
  // Raw per-model usage windows. The card derives the spend tile, the
  // weekly spend-guardrail check, and the per-model table from these.
  llm?: LlmUsageWindows;
  series: ActivitySeries | null;
  lastActivityAt: Date | null;
  // Wall-clock ms the project's DB round-trips took — set by the snapshot
  // loader, consumed by the slow-db check and the card's header meta.
  latencyMs?: number;
  error?: string;
}

export const UNCONFIGURED: ProjectReport = {
  configured: false,
  stats: [],
  series: null,
  lastActivityAt: null,
};

export function failed(error: unknown): ProjectReport {
  return {
    configured: true,
    stats: [],
    series: null,
    lastActivityAt: null,
    error: error instanceof Error ? error.message : String(error),
  };
}

// Fill missing days with zeros so sparklines keep a stable 30-point x-axis.
export function fillDays(
  rows: { day: string; value: number }[],
  days = 30,
): DailyPoint[] {
  const byDay = new Map(rows.map((r) => [r.day, r.value]));
  const out: DailyPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: key, value: byDay.get(key) ?? 0 });
  }
  return out;
}
