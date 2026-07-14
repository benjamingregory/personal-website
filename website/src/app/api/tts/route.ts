import { NextRequest } from "next/server";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1/text-to-speech";

// Generous relative to chat (10 msg/min): each reply fans out into a handful
// of per-sentence TTS calls.
const RATE_RULES = [
  { limit: 30, windowMs: 60_000 },
  { limit: 300, windowMs: 60 * 60_000 },
];

/**
 * Same-origin gate: the browser sends Origin on POST (Referer as fallback),
 * and for a fetch from our own pages its host equals the request's Host
 * header — on prod, previews, and localhost alike. curl and third-party
 * pages either omit it or carry a foreign host.
 */
function isSameOrigin(req: NextRequest): boolean {
  const host = req.headers.get("host");
  if (!host) return false;
  const source = req.headers.get("origin") ?? req.headers.get("referer");
  if (!source) return false;
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    return new Response(
      "ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID must be set",
      { status: 500 },
    );
  }

  if (!isSameOrigin(req)) {
    return new Response("Forbidden", { status: 403 });
  }

  const rate = checkRateLimit(`tts:${clientIpFrom(req)}`, RATE_RULES);
  if (!rate.ok) {
    return new Response("Rate limit reached — try again shortly.", {
      status: 429,
      headers: { "Retry-After": String(rate.retryAfterSeconds) },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const text = (body as { text?: unknown })?.text;
  if (typeof text !== "string" || text.trim().length === 0) {
    return new Response("Expected { text: string }", { status: 400 });
  }
  if (text.length > 2000) {
    return new Response("Text too long (max 2000 chars)", { status: 400 });
  }

  const upstream = await fetch(
    `${ELEVENLABS_BASE}/${encodeURIComponent(voiceId)}/stream?optimize_streaming_latency=4&output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_flash_v2_5",
      }),
    },
  );

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error(
      `ElevenLabs error (${upstream.status}): ${detail.slice(0, 500)}`,
    );
    return new Response("Voice synthesis unavailable", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
