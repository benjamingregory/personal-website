import "server-only";

/**
 * In-memory sliding-window rate limiter, keyed by client IP.
 *
 * Per-instance only: serverless instances each get their own window, so the
 * real ceiling is (limit x live instances). Good enough to stop casual abuse
 * of the anonymous chat/TTS routes; a WAF rule is the durable answer if the
 * site ever draws real fire.
 */

type Window = { timestamps: number[] };

const MAX_TRACKED_KEYS = 2000;

const buckets = new Map<string, Window>();

export type RateLimitRule = { limit: number; windowMs: number };

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

export function checkRateLimit(
  key: string,
  rules: RateLimitRule[],
): RateLimitResult {
  const now = Date.now();
  const maxWindow = Math.max(...rules.map((r) => r.windowMs));

  let bucket = buckets.get(key);
  if (!bucket) {
    // Cheap eviction: drop the oldest-inserted key once the map is full.
    if (buckets.size >= MAX_TRACKED_KEYS) {
      const oldest = buckets.keys().next().value;
      if (oldest !== undefined) buckets.delete(oldest);
    }
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }

  bucket.timestamps = bucket.timestamps.filter((t) => now - t < maxWindow);

  for (const rule of rules) {
    const inWindow = bucket.timestamps.filter(
      (t) => now - t < rule.windowMs,
    );
    if (inWindow.length >= rule.limit) {
      const oldestInWindow = inWindow[0];
      const retryAfterMs = rule.windowMs - (now - oldestInWindow);
      return {
        ok: false,
        retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      };
    }
  }

  bucket.timestamps.push(now);
  return { ok: true };
}

export function clientIpFrom(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
