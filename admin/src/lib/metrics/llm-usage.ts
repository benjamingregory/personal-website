import type { Sql } from "../db";
import type { Stat } from "./types";

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

// Three tiles: calls, tokens, estimated spend — each 30d with all-time hint.
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
}

function toUsage(
  r: SpanUsageRow,
  w: "all" | "30d",
): ModelUsage {
  const n = (v: string | null) => Number(v ?? 0);
  return w === "all"
    ? {
        model: r.model ?? "unknown",
        calls: r.calls,
        inputTokens: n(r.input),
        outputTokens: n(r.output),
        cacheReadTokens: n(r.cache_read),
        cacheWriteTokens: n(r.cache_write),
      }
    : {
        model: r.model ?? "unknown",
        calls: r.calls_30d,
        inputTokens: n(r.input_30d),
        outputTokens: n(r.output_30d),
        cacheReadTokens: n(r.cache_read_30d),
        cacheWriteTokens: n(r.cache_write_30d),
      };
}

export interface LlmUsageWindows {
  last30d: ModelUsage[];
  allTime: ModelUsage[];
}

// Per-model token usage from Mastra observability spans (mastra_ai_spans).
// Both kasava and monroe run Mastra with a Postgres store, so the table and
// the attributes.usage shape are identical. Returns empty windows when the
// table doesn't exist yet.
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
             FILTER (WHERE "startedAt" >= now() - interval '30 days') AS cache_write_30d
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
           sum(cache_write_tokens) FILTER (WHERE "createdAt" >= now() - interval '30 days') AS cache_write_30d
    FROM "LlmUsage"
    GROUP BY 1`);
}

export function mergeWindows(...windows: LlmUsageWindows[]): LlmUsageWindows {
  return {
    last30d: windows.flatMap((w) => w.last30d),
    allTime: windows.flatMap((w) => w.allTime),
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
      last30d: rows
        .filter((r) => r.calls_30d > 0)
        .map((r) => toUsage(r, "30d")),
      allTime: rows.map((r) => toUsage(r, "all")),
    };
  } catch (error) {
    if ((error as { code?: string })?.code === "42P01") {
      return { last30d: [], allTime: [] };
    }
    throw error;
  }
}
