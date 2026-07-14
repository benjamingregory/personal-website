import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/mdx-components";
import { BlogPostJsonLd } from "@/components/JsonLd";
import SectionScrollSpy from "@/components/motion/SectionScrollSpy";
import { getAllPosts, getAllSlugs, getPost } from "@/lib/posts";
import { extractHeadings } from "@/lib/toc";

interface BlogPostProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug.join("/"));
  if (!post) return { title: "Post Not Found" };

  const canonicalUrl = `https://bengregory.com${post.url}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["Ben Gregory"],
      tags: post.tags,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPost(slug.join("/"));
  if (!post) notFound();

  const seriesPosts = post.series
    ? (await getAllPosts())
        .filter((p) => p.series === post.series)
        .sort((a, b) => a.url.localeCompare(b.url))
    : [];

  const headings = extractHeadings(post.content);

  return (
    <>
      <BlogPostJsonLd
        title={post.title}
        description={post.description}
        date={post.date}
        url={`https://bengregory.com${post.url}`}
      />
      <div className="relative mx-auto max-w-7xl">
      <article className="mx-auto w-full max-w-2xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground xl:hidden"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="anim-underline">Back to blog</span>
        </Link>

        <header className="mt-8 space-y-4 xl:mt-0">
          {post.series && (
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {post.series}
            </div>
          )}
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-base text-muted-foreground">
              {post.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <time dateTime={post.date}>
              {format(parseISO(post.date), "MMM d, yyyy")}
            </time>
            <span>{post.readingMinutes} min read</span>
            {post.tags?.map((t) => <span key={t}>{t}</span>)}
          </div>
        </header>

        <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-foreground prose-a:underline-offset-4 hover:prose-a:text-foreground/80">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {seriesPosts.length > 1 && (
          <aside className="mt-16 border-t border-border/60 pt-8">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              More in this series
            </h3>
            <ul className="mt-4 space-y-2">
              {seriesPosts.map((p) => {
                const isCurrent = p.url === post.url;
                return (
                  <li key={p.url}>
                    <Link
                      href={p.url}
                      aria-current={isCurrent ? "page" : undefined}
                      className={
                        "group flex items-baseline justify-between gap-4 py-1 text-sm " +
                        (isCurrent
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground")
                      }
                    >
                      <span className="anim-underline">{p.title}</span>
                      {isCurrent && (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          You are here
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </article>
      <aside className="absolute left-4 top-0 hidden h-full w-56 xl:block">
        <div className="sticky top-24 pt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="anim-underline">Back to blog</span>
          </Link>
          {headings.length > 1 && (
            <>
              <div className="mb-3 mt-10 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                On this page
              </div>
              <SectionScrollSpy items={headings} />
            </>
          )}
        </div>
      </aside>
      </div>
    </>
  );
}
