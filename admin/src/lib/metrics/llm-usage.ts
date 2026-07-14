import type { Sql } from "../db";
import { fillDays, type Stat } from "./types";

// Per-million-token USD rates. Cache reads bill at ~0.1x input, cache writes
// at 1.25x input (5-minute TTL). Longest-prefix match against the model id
// reported in span/usage rows, so dated snapshots (claude-sonnet-4-5-20250929)
// resolve to their family rate. Unknown models count tokens but add $0.
const PRICING: [prefix: string, inPerM: number, outPerM: number][] = [
  ["claude-opus-4", 5, 25],
  ["claude-sonnet-4", 3, 15],
  ["claude-sonnet-5", 3, 15],
  ["claude-haiku-4-5", 1, 5],
  ["gemini-2.5-flash", 0.3, 2.5],
  ["gpt-4o-mini", 0.15, 0.6],
  ["gpt-4o", 2.5, 10],
  ["text-embedding-3-small", 0.02, 0],
  ["text-embedding-3-large", 0.13, 0],
];

export interface ModelUsage {
  model: string;
  calls: number;
  // inputTokens is the total (uncached + cacheRead + cacheWrite), matching
  // Mastra span usage; cache splits refine the cost estimate when present.
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}

function rate(model: string): [number, number] | null {
  let best: [string, number, number] | null = null;
  for (const row of PRICING) {
    if (model.startsWith(row[0]) && (!best || row[0].length > best[0].length)) {
      best = row;
    }
  }
  return best ? [best[1], best[2]] : null;
}

export function estimateUsd(rows: ModelUsage[]): number {
  let usd = 0;
  for (const r of rows) {
    const rates = rate(r.model);
    if (!rates) continue;
    const [inPerM, outPerM] = rates;
    const uncached = Math.max(
      0,
      r.inputTokens - r.cacheReadTokens - r.cacheWriteTokens,
    );
    usd +=
      (uncached * inPerM +
        r.cacheReadTokens * inPerM * 0.1 +
        r.cacheWriteTokens * inPerM * 1.25 +
        r.outputTokens * outPerM) /
      1_000_000;
  }
  return usd;
}

// "1,482 · 12.4M tokens" style compact counts for tile display.
export function compact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString("en-US");
}

export function fmtUsd(usd: number): string {
  return usd >= 100
    ? `$${Math.round(usd).toLocaleString("en-US")}`
    : `$${usd.toFixed(2)}`;
}

interface UsageWindow {
  calls: number;
  tokens: number;
  inputTokens: number;
  outputTokens: number;
  usd: number;
}

function windowOf(rows: ModelUsage[]): UsageWindow {
  const inputTokens = rows.reduce((s, r) => s + r.inputTokens, 0);
  const outputTokens = rows.reduce((s, r) => s + r.outputTokens, 0);
  return {
    calls: rows.reduce((s, r) => s + r.calls, 0),
    tokens: inputTokens + outputTokens,
    inputTokens,
    outputTokens,
    usd: estimateUsd(rows),
  };
}

// Card-face tile: estimated 30d spend with the all-time figure as the hint.
export function spendTile(w: LlmUsageWindows): Stat {
  const usd30 = estimateUsd(w.last30d);
  return {
    label: "llm 30d",
    value: usd30,
    display: fmtUsd(usd30),
    hint: `${fmtUsd(estimateUsd(w.allTime))} all-time`,
  };
}

// Drill-down row: calls, tokens, estimated spend — each 30d with hints.
export function usageStats(
  last30d: ModelUsage[],
  allTime: ModelUsage[],
): Stat[] {
  const m30 = windowOf(last30d);
  const all = windowOf(allTime);
  return [
    {
      label: "llm calls 30d",
      value: m30.calls,
      hint: `${compact(all.calls)} all-time`,
    },
    {
      label: "tokens 30d",
      value: m30.tokens,
      display: compact(m30.tokens),
      hint: `${compact(m30.inputTokens)} in · ${compact(m30.outputTokens)} out`,
    },
    {
      label: "est. spend 30d",
      value: m30.usd,
      display: fmtUsd(m30.usd),
      hint: `${fmtUsd(all.usd)} all-time`,
    },
  ];
}

interface SpanUsageRow {
  model: string | null;
  calls: number;
  input: string | null;
  output: string | null;
  cache_read: string | null;
  cache_write: string | null;
  calls_30d: number;
  input_30d: string | null;
  output_30d: string | null;
  cache_read_30d: string | null;
  cache_write_30d: string | null;
  calls_7d: number;
  input_7d: string | null;
  output_7d: string | null;
  cache_read_7d: string | null;
  cache_write_7d: string | null;
  calls_p7d: number;
  input_p7d: string | null;
  output_p7d: string | null;
  cache_read_p7d: string | null;
  cache_write_p7d: string | null;
}

type Window = "all" | "30d" | "7d" | "p7d";

function toUsage(r: SpanUsageRow, w: Window): ModelUsage {
  const n = (v: string | null) => Number(v ?? 0);
  const model = r.model ?? "unknown";
  switch (w) {
    case "all":
      return {
        model,
        calls: r.calls,
        inputTokens: n(r.input),
        outputTokens: n(r.output),
        cacheReadTokens: n(r.cache_read),
        cacheWriteTokens: n(r.cache_write),
      };
    case "30d":
      return {
        model,
        calls: r.calls_30d,
        inputTokens: n(r.input_30d),
        outputTokens: n(r.output_30d),
        cacheReadTokens: n(r.cache_read_30d),
        cacheWriteTokens: n(r.cache_write_30d),
      };
    case "7d":
      return {
        model,
        calls: r.calls_7d,
        inputTokens: n(r.input_7d),
        outputTokens: n(r.output_7d),
        cacheReadTokens: n(r.cache_read_7d),
        cacheWriteTokens: n(r.cache_write_7d),
      };
    case "p7d":
      return {
        model,
        calls: r.calls_p7d,
        inputTokens: n(r.input_p7d),
        outputTokens: n(r.output_p7d),
        cacheReadTokens: n(r.cache_read_p7d),
        cacheWriteTokens: n(r.cache_write_p7d),
      };
  }
}

export interface LlmUsageWindows {
  last30d: ModelUsage[];
  allTime: ModelUsage[];
  // Trailing week and the week before it — the spend-guardrail inputs.
  last7d: ModelUsage[];
  prior7d: ModelUsage[];
}

export const EMPTY_USAGE: LlmUsageWindows = {
  last30d: [],
  allTime: [],
  last7d: [],
  prior7d: [],
};

// Per-model token usage from Mastra observability spans (mastra_ai_spans).
// Jobflow, kasava, and monroe all run Mastra with a Postgres store, so the
// table and the attributes.usage shape are identical. Returns empty windows
// when the table doesn't exist yet.
export function mastraSpanUsage(sql: Sql): Promise<LlmUsageWindows> {
  return orEmpty(sql<SpanUsageRow[]>`
    SELECT attributes->>'model' AS model,
           count(*)::int AS calls,
           sum((attributes->'usage'->>'inputTokens')::bigint) AS input,
           sum((attributes->'usage'->>'outputTokens')::bigint) AS output,
           sum(coalesce((attributes->'usage'->'inputDetails'->>'cacheRead')::bigint, 0)) AS cache_read,
           sum(coalesce((attributes->'usage'->'inputDetails'->>'cacheWrite')::bigint, 0)) AS cache_write,
           count(*) FILTER (WHERE "startedAt" >= now() - interval '30 days')::int AS calls_30d,
           sum((attributes->'usage'->>'inputTokens')::bigint)
             FILTER (WHERE "startedAt" >= now() - interval '30 days') AS input_30d,
           sum((attributes->'usage'->>'outputTokens')::bigint)
             FILTER (WHERE "startedAt" >= now() - interval '30 days') AS output_30d,
           sum(coalesce((attributes->'usage'->'inputDetails'->>'cacheRead')::bigint, 0))
             FILTER (WHERE "startedAt" >= now() - interval '30 days') AS cache_read_30d,
           sum(coalesce((attributes->'usage'->'inputDetails'->>'cacheWrite')::bigint, 0))
             FILTER (WHERE "startedAt" >= now() - interval '30 days') AS cache_write_30d,
           count(*) FILTER (WHERE "startedAt" >= now() - interval '7 days')::int AS calls_7d,
           sum((attributes->'usage'->>'inputTokens')::bigint)
             FILTER (WHERE "startedAt" >= now() - interval '7 days') AS input_7d,
           sum((attributes->'usage'->>'outputTokens')::bigint)
             FILTER (WHERE "startedAt" >= now() - interval '7 days') AS output_7d,
           sum(coalesce((attributes->'usage'->'inputDetails'->>'cacheRead')::bigint, 0))
             FILTER (WHERE "startedAt" >= now() - interval '7 days') AS cache_read_7d,
           sum(coalesce((attributes->'usage'->'inputDetails'->>'cacheWrite')::bigint, 0))
             FILTER (WHERE "startedAt" >= now() - interval '7 days') AS cache_write_7d,
           count(*) FILTER (WHERE "startedAt" >= now() - interval '14 days'
             AND "startedAt" < now() - interval '7 days')::int AS calls_p7d,
           sum((attributes->'usage'->>'inputTokens')::bigint)
             FILTER (WHERE "startedAt" >= now() - interval '14 days'
               AND "startedAt" < now() - interval '7 days') AS input_p7d,
           sum((attributes->'usage'->>'outputTokens')::bigint)
             FILTER (WHERE "startedAt" >= now() - interval '14 days'
               AND "startedAt" < now() - interval '7 days') AS output_p7d,
           sum(coalesce((attributes->'usage'->'inputDetails'->>'cacheRead')::bigint, 0))
             FILTER (WHERE "startedAt" >= now() - interval '14 days'
               AND "startedAt" < now() - interval '7 days') AS cache_read_p7d,
           sum(coalesce((attributes->'usage'->'inputDetails'->>'cacheWrite')::bigint, 0))
             FILTER (WHERE "startedAt" >= now() - interval '14 days'
               AND "startedAt" < now() - interval '7 days') AS cache_write_p7d
    FROM mastra_ai_spans
    WHERE "spanType" IN ('model_generation', 'model_inference')
      AND attributes->'usage'->>'inputTokens' IS NOT NULL
    GROUP BY 1`);
}

// Monroe's Cloudflare-Workers API records raw-SDK calls (Anthropic/OpenAI)
// into "LlmUsage" — see monroe/api src/_utils/llm-usage.ts. Returns empty
// windows until that table's migration lands.
export function monroeLlmUsageTable(sql: Sql): Promise<LlmUsageWindows> {
  return orEmpty(sql<SpanUsageRow[]>`
    SELECT model,
           count(*)::int AS calls,
           sum(input_tokens) AS input,
           sum(output_tokens) AS output,
           sum(cache_read_tokens) AS cache_read,
           sum(cache_write_tokens) AS cache_write,
           count(*) FILTER (WHERE "createdAt" >= now() - interval '30 days')::int AS calls_30d,
           sum(input_tokens) FILTER (WHERE "createdAt" >= now() - interval '30 days') AS input_30d,
           sum(output_tokens) FILTER (WHERE "createdAt" >= now() - interval '30 days') AS output_30d,
           sum(cache_read_tokens) FILTER (WHERE "createdAt" >= now() - interval '30 days') AS cache_read_30d,
           sum(cache_write_tokens) FILTER (WHERE "createdAt" >= now() - interval '30 days') AS cache_write_30d,
           count(*) FILTER (WHERE "createdAt" >= now() - interval '7 days')::int AS calls_7d,
           sum(input_tokens) FILTER (WHERE "createdAt" >= now() - interval '7 days') AS input_7d,
           sum(output_tokens) FILTER (WHERE "createdAt" >= now() - interval '7 days') AS output_7d,
           sum(cache_read_tokens) FILTER (WHERE "createdAt" >= now() - interval '7 days') AS cache_read_7d,
           sum(cache_write_tokens) FILTER (WHERE "createdAt" >= now() - interval '7 days') AS cache_write_7d,
           count(*) FILTER (WHERE "createdAt" >= now() - interval '14 days'
             AND "createdAt" < now() - interval '7 days')::int AS calls_p7d,
           sum(input_tokens) FILTER (WHERE "createdAt" >= now() - interval '14 days'
             AND "createdAt" < now() - interval '7 days') AS input_p7d,
           sum(output_tokens) FILTER (WHERE "createdAt" >= now() - interval '14 days'
             AND "createdAt" < now() - interval '7 days') AS output_p7d,
           sum(cache_read_tokens) FILTER (WHERE "createdAt" >= now() - interval '14 days'
             AND "createdAt" < now() - interval '7 days') AS cache_read_p7d,
           sum(cache_write_tokens) FILTER (WHERE "createdAt" >= now() - interval '14 days'
             AND "createdAt" < now() - interval '7 days') AS cache_write_p7d
    FROM "LlmUsage"
    GROUP BY 1`);
}

interface DailySpendRow {
  day: string;
  model: string | null;
  input: string | null;
  output: string | null;
  cache_read: string | null;
  cache_write: string | null;
}

function toDailyUsage(r: DailySpendRow): ModelUsage {
  const n = (v: string | null) => Number(v ?? 0);
  return {
    model: r.model ?? "unknown",
    calls: 0,
    inputTokens: n(r.input),
    outputTokens: n(r.output),
    cacheReadTokens: n(r.cache_read),
    cacheWriteTokens: n(r.cache_write),
  };
}

// Per-day per-model usage from Mastra spans, last 30 days. Cost is folded per
// day in JS via estimateUsd so the pricing map stays the single source.
export async function mastraDailySpend(sql: Sql): Promise<DailySpendRow[]> {
  return dailyOrEmpty(sql<DailySpendRow[]>`
    SELECT to_char(date_trunc('day', "startedAt"), 'YYYY-MM-DD') AS day,
           attributes->>'model' AS model,
           sum((attributes->'usage'->>'inputTokens')::bigint) AS input,
           sum((attributes->'usage'->>'outputTokens')::bigint) AS output,
           sum(coalesce((attributes->'usage'->'inputDetails'->>'cacheRead')::bigint, 0)) AS cache_read,
           sum(coalesce((attributes->'usage'->'inputDetails'->>'cacheWrite')::bigint, 0)) AS cache_write
    FROM mastra_ai_spans
    WHERE "spanType" IN ('model_generation', 'model_inference')
      AND attributes->'usage'->>'inputTokens' IS NOT NULL
      AND "startedAt" >= now() - interval '30 days'
    GROUP BY 1, 2`);
}

export async function monroeDailySpend(sql: Sql): Promise<DailySpendRow[]> {
  return dailyOrEmpty(sql<DailySpendRow[]>`
    SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day,
           model,
           sum(input_tokens) AS input,
           sum(output_tokens) AS output,
           sum(cache_read_tokens) AS cache_read,
           sum(cache_write_tokens) AS cache_write
    FROM "LlmUsage"
    WHERE "createdAt" >= now() - interval '30 days'
    GROUP BY 1, 2`);
}

async function dailyOrEmpty(
  query: Promise<DailySpendRow[]>,
): Promise<DailySpendRow[]> {
  try {
    return await query;
  } catch (error) {
    if ((error as { code?: string })?.code === "42P01") return [];
    throw error;
  }
}

// Fold per-day per-model rows into one estimated-USD value per day, rounded
// to cents for tooltip display. fillDays keeps the x-axis a stable, ordered
// 30-day run — the SQL groups without ORDER BY and Map iteration follows
// insertion, so raw entries come back shuffled.
export function foldDailySpend(
  ...rowSets: DailySpendRow[][]
): { day: string; value: number }[] {
  const byDay = new Map<string, number>();
  for (const rows of rowSets) {
    for (const r of rows) {
      const usd = estimateUsd([toDailyUsage(r)]);
      byDay.set(r.day, (byDay.get(r.day) ?? 0) + usd);
    }
  }
  return fillDays(
    [...byDay.entries()].map(([day, usd]) => ({
      day,
      value: Math.round(usd * 100) / 100,
    })),
  );
}

export function mergeWindows(...windows: LlmUsageWindows[]): LlmUsageWindows {
  return {
    last30d: windows.flatMap((w) => w.last30d),
    allTime: windows.flatMap((w) => w.allTime),
    last7d: windows.flatMap((w) => w.last7d),
    prior7d: windows.flatMap((w) => w.prior7d),
  };
}

// undefined_table (42P01) → the source table's migration hasn't run in that
// project yet; treat as no usage instead of failing the whole section.
async function orEmpty(
  query: Promise<SpanUsageRow[]>,
): Promise<LlmUsageWindows> {
  try {
    const rows = await query;
    return {
      last30d: rows.filter((r) => r.calls_30d > 0).map((r) => toUsage(r, "30d")),
      allTime: rows.map((r) => toUsage(r, "all")),
      last7d: rows.filter((r) => r.calls_7d > 0).map((r) => toUsage(r, "7d")),
      prior7d: rows.filter((r) => r.calls_p7d > 0).map((r) => toUsage(r, "p7d")),
    };
  } catch (error) {
    if ((error as { code?: string })?.code === "42P01") {
      return EMPTY_USAGE;
    }
    throw error;
  }
}
