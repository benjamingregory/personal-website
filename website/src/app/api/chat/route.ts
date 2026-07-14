import { handleChatStream } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse } from "ai";
import { z } from "zod";
import { BEN_AGENT_ID, getMastra } from "@/mastra";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

// Anonymous public endpoint backed by paid model calls — keep the window tight.
const RATE_RULES = [
  { limit: 10, windowMs: 60_000 },
  { limit: 60, windowMs: 60 * 60_000 },
];

const HISTORY_LIMIT = 12; // messages actually forwarded to the agent
const USER_MESSAGE_MAX_CHARS = 4_000;
const TOTAL_TEXT_MAX_CHARS = 32_000;

const messageSchema = z.looseObject({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  parts: z.array(z.looseObject({ type: z.string() })),
});

const bodySchema = z.looseObject({
  messages: z.array(messageSchema).min(1).max(40),
});

type ChatMessage = z.infer<typeof messageSchema>;

function textLength(message: ChatMessage): number {
  return message.parts.reduce((sum, part) => {
    const text = (part as { text?: unknown }).text;
    return sum + (typeof text === "string" ? text.length : 0);
  }, 0);
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("ANTHROPIC_API_KEY not configured", { status: 500 });
  }

  const rate = checkRateLimit(`chat:${clientIpFrom(req)}`, RATE_RULES);
  if (!rate.ok) {
    return new Response("Rate limit reached — try again shortly.", {
      status: 429,
      headers: { "Retry-After": String(rate.retryAfterSeconds) },
    });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return new Response("Invalid chat payload", { status: 400 });
  }

  const messages = parsed.data.messages.slice(-HISTORY_LIMIT);

  const last = messages.at(-1);
  if (!last || last.role !== "user") {
    return new Response("Last message must be from the user", { status: 400 });
  }
  if (textLength(last) > USER_MESSAGE_MAX_CHARS) {
    return new Response("Message too long", { status: 400 });
  }
  const totalChars = messages.reduce((sum, m) => sum + textLength(m), 0);
  if (totalChars > TOTAL_TEXT_MAX_CHARS) {
    return new Response("Conversation too long — start a new chat.", {
      status: 400,
    });
  }

  const mastra = await getMastra();

  // Validated at runtime above. The cast bridges @mastra/ai-sdk's bundled
  // AI SDK v6 declarations and this app's ai v7 types — the wire format is
  // the same; only the .d.ts trees disagree.
  const stream = await handleChatStream({
    mastra,
    agentId: BEN_AGENT_ID,
    params: { ...parsed.data, messages } as unknown as Parameters<
      typeof handleChatStream
    >[0]["params"],
    version: "v6",
  });

  return createUIMessageStreamResponse({ stream });
}
