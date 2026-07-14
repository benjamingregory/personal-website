import "server-only";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { externalPosts } from "@/lib/external-posts";

const KNOWN_URLS = new Set(externalPosts.map((p) => p.url));

/**
 * Minimal HTML → text extraction. The Kasava blog renders Markdown to HTML, so
 * we strip scripts/styles/tags and decode the handful of entities that show up
 * in prose. Good enough to hand the model readable article text — we don't need
 * a full DOM parser for a one-off fetch.
 */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|div|section|article|h[1-6]|li|tr|blockquote)>/gi, "\n")
    .replace(/<(br|hr)\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Lets the persona pull the full body of one of Ben's external (Kasava) posts
 * when the abstract isn't enough. Fetching is restricted to the URLs already in
 * `externalPosts` — the model can't make the tool fetch arbitrary pages.
 */
export const fetchExternalPost = createTool({
  id: "fetch_external_post",
  description:
    "Fetch the full text of one of Ben's external (Kasava) blog posts, for when a user wants more depth than the abstract in the <external-posts> list provides. Pass the exact post URL from that list. Only those listed Kasava URLs can be fetched; anything else is refused. The post may be long, so quote or summarize the relevant part rather than dumping the whole thing.",
  inputSchema: z.object({
    url: z
      .string()
      .describe(
        "The exact kasava.dev blog URL, copied from the <external-posts> list.",
      ),
  }),
  outputSchema: z.object({
    url: z.string(),
    title: z.string().optional(),
    content: z.string(),
  }),
  execute: async ({ url }) => {
    const meta =
      externalPosts.find((p) => p.url === url) ??
      externalPosts.find((p) => url.includes(p.url) || p.url.includes(url));

    if (!meta || !KNOWN_URLS.has(meta.url)) {
      return {
        url,
        content: `Refused: "${url}" is not one of Ben's listed external posts. Only fetch URLs that appear in the <external-posts> list.`,
      };
    }

    try {
      const res = await fetch(meta.url, {
        headers: { "user-agent": "benjaminrgregory.com chat persona" },
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        return {
          url: meta.url,
          title: meta.title,
          content: `Couldn't fetch the post (HTTP ${res.status}). Fall back to the abstract: ${meta.abstract}`,
        };
      }
      const text = htmlToText(await res.text()).slice(0, 14_000);
      return { url: meta.url, title: meta.title, content: text };
    } catch (err) {
      return {
        url: meta.url,
        title: meta.title,
        content: `Fetch failed (${
          err instanceof Error ? err.message : "unknown error"
        }). Fall back to the abstract: ${meta.abstract}`,
      };
    }
  },
});
