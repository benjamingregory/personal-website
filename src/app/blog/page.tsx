import type { Metadata } from "next";
import FadeUp from "@/components/motion/FadeUp";
import BlogIndex, { type IndexPost } from "@/components/motion/BlogIndex";
import { getAllPosts } from "@/lib/posts";
import { externalPosts } from "@/lib/external-posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on software engineering, product, and the things I'm building.",
  openGraph: {
    title: "Blog · Ben Gregory",
    description:
      "Notes on software engineering, product, and the things I'm building",
    type: "website",
    url: "https://bengregory.com/blog",
  },
};

const TOP_TAG_COUNT = 6;

export default async function Blog() {
  const internal = await getAllPosts();

  const internalIndex: IndexPost[] = internal.map((post) => ({
    url: post.url,
    title: post.title,
    description: post.description,
    date: post.date,
    series: post.series,
    tags: post.tags,
    readingMinutes: post.readingMinutes,
  }));

  const externalIndex: IndexPost[] = externalPosts.map((post) => ({
    url: post.url,
    title: post.title,
    description: post.description,
    date: new Date(post.date).toISOString(),
    source: post.source,
    tags: post.tags,
    readingMinutes: post.readingMinutes,
    external: true,
  }));

  const posts = [...internalIndex, ...externalIndex].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date),
  );

  const tagCounts = posts.reduce<Record<string, number>>((acc, post) => {
    for (const t of post.tags ?? []) acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_TAG_COUNT)
    .map(([t]) => t);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      <FadeUp as="header" className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Notes on software engineering, product, and the things I&rsquo;m
          building. {posts.length} posts.
        </p>
      </FadeUp>

      <FadeUp delay={0.05}>
        <BlogIndex posts={posts} topTags={topTags} />
      </FadeUp>
    </div>
  );
}
