import { handleChatStream } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse } from "ai";
import { BEN_AGENT_ID, getMastra } from "@/mastra";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("ANTHROPIC_API_KEY not configured", { status: 500 });
  }

  const params = await req.json();
  const mastra = await getMastra();

  const stream = await handleChatStream({
    mastra,
    agentId: BEN_AGENT_ID,
    params,
    version: "v6",
  });

  return createUIMessageStreamResponse({ stream });
}
