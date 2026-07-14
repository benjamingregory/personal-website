import Link from "next/link";
import type { Metadata } from "next";
import { format, parseISO } from "date-fns";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import FadeUp from "@/components/motion/FadeUp";
import { getAllPosts } from "@/lib/posts";
import { externalPosts } from "@/lib/external-posts";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const internal = (await getAllPosts()).map((p) => ({
    url: p.url,
    title: p.title,
    date: p.date,
    external: false,
  }));
  const external = externalPosts.map((p) => ({
    url: p.url,
    title: p.title,
    date: new Date(p.date).toISOString(),
    external: true,
  }));
  const posts = [...internal, ...external]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      <FadeUp as="header" className="mb-10">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
          No page here.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The address doesn&rsquo;t match anything on the site — it may have
          moved, or the link had a typo.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="anim-underline">Back to home</span>
        </Link>
      </FadeUp>

      <FadeUp as="section" delay={0.05}>
        <h2 className="font-display text-lg font-semibold">Recent writing</h2>
        <ul className="mt-4 divide-y divide-border/60">
          {posts.map((post) => {
            const className =
              "group flex items-baseline justify-between gap-6 py-3 transition-colors";
            const inner = (
              <>
                <span className="flex min-w-0 items-baseline gap-1.5">
                  <span className="anim-underline text-sm text-foreground">
                    {post.title}
                  </span>
                  {post.external && (
                    <ArrowUpRight
                      aria-hidden
                      className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  )}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {format(parseISO(post.date), "MMM yyyy")}
                </span>
              </>
            );
            return (
              <li key={post.url}>
                {post.external ? (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={post.url} className={className}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </FadeUp>
    </div>
  );
}
