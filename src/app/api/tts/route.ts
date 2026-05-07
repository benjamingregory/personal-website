import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1/text-to-speech";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    return new Response(
      "ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID must be set",
      { status: 500 },
    );
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
    `${ELEVENLABS_BASE}/${encodeURIComponent(voiceId)}/stream?optimize_streaming_latency=2&output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
      }),
    },
  );

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return new Response(
      `ElevenLabs error (${upstream.status}): ${detail.slice(0, 500)}`,
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
