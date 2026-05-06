import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type Post = {
  slug: string;
  url: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  series?: string;
  published: boolean;
  readingMinutes: number;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      if (entry.name.endsWith(".mdx")) return [full];
      return [];
    }),
  );
  return files.flat();
}

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return new Date(value).toISOString();
  return new Date().toISOString();
}

let cache: Post[] | null = null;

export async function getAllPosts(): Promise<Post[]> {
  if (cache) return cache;
  const files = await walk(CONTENT_DIR);
  const posts = await Promise.all(
    files.map(async (file): Promise<Post> => {
      const raw = await fs.readFile(file, "utf-8");
      const { data, content } = matter(raw);
      const rel = path
        .relative(CONTENT_DIR, file)
        .replace(/\\/g, "/")
        .replace(/\.mdx$/, "");
      const stats = readingTime(content);
      return {
        slug: rel,
        url: `/blog/${rel}`,
        title: String(data.title ?? rel),
        date: toIso(data.date),
        description: String(data.description ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
        series: data.series ? String(data.series) : undefined,
        published: data.published !== false,
        readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
        content,
      };
    }),
  );
  cache = posts
    .filter((p) => p.published)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return cache;
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<string[][]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug.split("/"));
}
