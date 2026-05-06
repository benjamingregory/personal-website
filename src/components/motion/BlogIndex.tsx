"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export type IndexPost = {
  url: string;
  title: string;
  description: string;
  date: string;
  series?: string;
  tags?: string[];
  readingMinutes: number;
};

const ALL = "All";

export default function BlogIndex({
  posts,
  topTags,
}: {
  posts: IndexPost[];
  topTags: string[];
}) {
  const [active, setActive] = useState<string>(ALL);
  const reduced = useReducedMotion();

  const filtered = useMemo(() => {
    if (active === ALL) return posts;
    return posts.filter((p) => p.tags?.includes(active));
  }, [active, posts]);

  return (
    <div className="space-y-8">
      {/* Tag filter */}
      <div className="flex flex-wrap gap-1.5">
        {[ALL, ...topTags].map((tag) => {
          const isActive = tag === active;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag)}
              aria-pressed={isActive}
              className={cn(
                "relative inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-[color,border-color,transform] duration-150 ease-out active:scale-[0.97]",
                isActive
                  ? "border-foreground/80 text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {isActive && !reduced && (
                <motion.span
                  layoutId="tag-active"
                  className="absolute inset-0 -z-10 rounded-full bg-muted/60"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {tag}
            </button>
          );
        })}
      </div>

      {/* Post list with FLIP layout animation */}
      <ul className="divide-y divide-border/60">
        <AnimatePresence initial={false}>
          {filtered.map((post) => (
            <motion.li
              key={post.url}
              layout={reduced ? false : "position"}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={post.url}
                className="group block py-5 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <div className="min-w-0 space-y-1">
                    {post.series && (
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {post.series}
                      </div>
                    )}
                    <h2 className="font-display text-base font-semibold">
                      <span className="anim-underline">{post.title}</span>
                    </h2>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {post.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-[11px] text-muted-foreground">
                      {format(parseISO(post.date), "MMM d, yyyy")}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground/70">
                      {post.readingMinutes} min
                    </div>
                  </div>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No posts in &ldquo;{active}&rdquo; yet.{" "}
          <button
            onClick={() => setActive(ALL)}
            className="anim-underline text-foreground"
          >
            See all posts
          </button>
          .
        </div>
      )}
    </div>
  );
}
