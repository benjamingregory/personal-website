import { getAllPosts } from "@/lib/posts";
import { externalPosts } from "@/lib/external-posts";

const BASE_URL = "https://www.benjaminrgregory.com";

// Posts are read from the filesystem at build time; render once per deploy
// like sitemap.xml rather than on every request.
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type FeedItem = {
  title: string;
  url: string;
  description: string;
  date: Date;
};

export async function GET() {
  const internal: FeedItem[] = (await getAllPosts()).map((post) => ({
    title: post.title,
    url: `${BASE_URL}${post.url}`,
    description: post.description,
    date: new Date(post.date),
  }));

  const external: FeedItem[] = externalPosts.map((post) => ({
    title: `${post.title} (${post.source})`,
    url: post.url,
    description: post.description,
    date: new Date(post.date),
  }));

  const items = [...internal, ...external].sort(
    (a, b) => +b.date - +a.date,
  );

  const lastBuildDate = (items[0]?.date ?? new Date(0)).toUTCString();

  const itemsXml = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.date.toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ben Gregory</title>
    <link>${BASE_URL}</link>
    <description>Notes on software engineering, product, and the things I'm building.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
