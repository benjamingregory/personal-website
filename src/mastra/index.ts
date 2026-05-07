import "server-only";
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import {
  ModerationProcessor,
  PromptInjectionDetector,
} from "@mastra/core/processors";
import { buildSystemPrompt } from "./persona";

export const BEN_AGENT_ID = "ben";

const GUARDRAIL_MODEL = "anthropic/claude-haiku-4-5-20251001";

let mastraPromise: Promise<Mastra> | null = null;

export function getMastra(): Promise<Mastra> {
  if (!mastraPromise) {
    mastraPromise = (async () => {
      const instructions = await buildSystemPrompt();
      const ben = new Agent({
        id: BEN_AGENT_ID,
        name: "Ben Gregory",
        instructions,
        model: "anthropic/claude-sonnet-4-6",
        inputProcessors: [
          new PromptInjectionDetector({
            model: GUARDRAIL_MODEL,
            threshold: 0.8,
            strategy: "block",
            detectionTypes: ["injection", "jailbreak", "system-override"],
          }),
          new ModerationProcessor({
            model: GUARDRAIL_MODEL,
            threshold: 0.7,
            strategy: "block",
            categories: ["hate", "harassment", "violence", "sexual"],
          }),
        ],
      });
      return new Mastra({ agents: { [BEN_AGENT_ID]: ben } });
    })();
  }
  return mastraPromise;
}
