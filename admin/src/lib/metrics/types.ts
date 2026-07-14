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
  stats: Stat[];
  // LLM token/cost tiles, rendered as their own row under the product stats.
  usage?: Stat[];
  series: ActivitySeries | null;
  lastActivityAt: Date | null;
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
