// Build-time parity check: every Kasava blog post Ben authored should have a
// matching entry in src/lib/external-posts.ts (relisted on bengregory.com).
//
// Source of truth is the sibling kasava repo's published markdown. The canonical
// slug is the frontmatter `slug` field, NOT the filename (they differ — e.g.
// 2025-12-04-mcp-for-docs-most-valuable-use-case.md has slug "mcp-for-docs").
//
// The kasava repo isn't present in CI (Vercel), so this skips cleanly there and
// only enforces parity locally where the repo exists. Point it elsewhere with
// KASAVA_BLOG_DIR if your checkout isn't a sibling of this one.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const publishedDir =
  process.env.KASAVA_BLOG_DIR ??
  path.resolve(repoRoot, "../kasava/marketing/blogs/published");

const externalPostsFile = path.join(repoRoot, "src/lib/external-posts.ts");

if (!fs.existsSync(publishedDir)) {
  console.log(
    `[check-external-posts] Kasava blog dir not found (${publishedDir}); skipping parity check.`,
  );
  process.exit(0);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".md") || entry.name.endsWith(".mdx")
      ? [full]
      : [];
  });
}

// Ben-authored published posts, keyed by canonical slug.
const benPosts = new Map();
for (const file of walk(publishedDir)) {
  const { data } = matter(fs.readFileSync(file, "utf-8"));
  const author = String(data.author ?? "");
  const slug = data.slug ? String(data.slug) : null;
  if (!author.includes("Ben Gregory")) continue;
  if (!slug) {
    console.warn(
      `[check-external-posts] WARNING: ${path.basename(file)} has no \`slug\` frontmatter; skipping.`,
    );
    continue;
  }
  benPosts.set(slug, path.basename(file));
}

// Slugs already listed in external-posts.ts (from the kasava.dev/blog/<slug> URLs).
const externalSrc = fs.readFileSync(externalPostsFile, "utf-8");
const listedSlugs = new Set(
  [...externalSrc.matchAll(/kasava\.dev\/blog\/([^"'\s]+)/g)].map((m) => m[1]),
);

const missing = [...benPosts.keys()].filter((slug) => !listedSlugs.has(slug));
const orphaned = [...listedSlugs].filter((slug) => !benPosts.has(slug));

if (orphaned.length) {
  console.warn(
    `[check-external-posts] WARNING: ${orphaned.length} external-posts entr${
      orphaned.length === 1 ? "y has" : "ies have"
    } no matching published Kasava post:\n` +
      orphaned.map((s) => `  - ${s}`).join("\n"),
  );
}

if (missing.length) {
  console.error(
    `[check-external-posts] FAIL: ${missing.length} Ben-authored Kasava post${
      missing.length === 1 ? "" : "s"
    } missing from src/lib/external-posts.ts:\n` +
      missing
        .map((s) => `  - ${s} (${benPosts.get(s)}) → https://www.kasava.dev/blog/${s}`)
        .join("\n"),
  );
  process.exit(1);
}

console.log(
  `[check-external-posts] OK: all ${benPosts.size} Ben-authored Kasava posts are listed in external-posts.ts.`,
);
