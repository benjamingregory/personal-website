import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ArrowRight, ArrowUpRight, Mic } from "lucide-react";
import FadeUp from "@/components/motion/FadeUp";
import HoverCard from "@/components/motion/HoverCard";
import { getAllPosts } from "@/lib/posts";
import { externalPosts } from "@/lib/external-posts";

const FEATURED_PROJECTS = [
  {
    name: "Kasava",
    year: "2025 — present",
    href: "/projects",
    pitch:
      "An AI workflow tool for engineering teams — repo indexing, semantic commit analysis, and a chat that actually knows your codebase.",
  },
  {
    name: "Monroe",
    year: "2024 — 2025",
    href: "/projects",
    pitch:
      "A TV-show platform with intelligent recommendations across web, mobile, and desktop. The Goodreads for television.",
  },
];

export default async function Home() {
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
    <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
      {/* Hero */}
      <FadeUp as="section" className="pt-16 sm:pt-24 pb-10">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Ben Gregory
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
          Engineer, founder, and writer.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          I&rsquo;m building <Link href={"kasava.dev"} className="text-foreground">Kasava</Link>, an
          AI workflow tool for engineering teams. Before that I built <Link className="text-foreground" href={"joinmonroe.com"}>Monroe</Link>,
          was a senior PM on the freight team at <Link className="text-foreground" href={"flexport.com"}>Flexport </Link>  (via Shopify, via
          Deliverr), and helped build the early platform at Astronomer. Stanford
          GSB &rsquo;21.
        </p>

        <div className="mt-8">
          <Link
            href="/chat"
            className="group inline-flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm transition-colors hover:border-foreground/40 hover:bg-muted"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-foreground/40 group-hover:text-foreground">
              <Mic className="h-3.5 w-3.5" />
            </span>
            <span className="flex flex-col">
              <span className="font-medium text-foreground">
                Chat with an AI clone of me
              </span>
              <span className="text-xs text-muted-foreground">
                Voice in, voice out — trained on my writing.
              </span>
            </span>
            <ArrowRight className="ml-2 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        </div>
      </FadeUp>

      {/* Now */}
      <FadeUp as="section" delay={0.05} className="py-8">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Now
          </span>
          <span className="text-xs text-muted-foreground/70">May 2026</span>
        </div>
        <p className="mt-3 max-w-2xl text-base">
          Shipping Kasava&rsquo;s repo indexing pipeline and writing about what
          I learn along the way. Open to interesting conversations —{" "}
          <a
            href="mailto:benjaminrgregory@gmail.com"
            className="anim-underline text-foreground"
          >
            say hi
          </a>
          .
        </p>
      </FadeUp>

      {/* Selected work */}
      <FadeUp as="section" delay={0.1} className="py-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold">Selected work</h2>
          <Link
            href="/projects"
            className="anim-underline text-sm text-muted-foreground hover:text-foreground"
          >
            All projects
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURED_PROJECTS.map((p) => (
            <HoverCard key={p.name} href={p.href}>
              <div className="space-y-2 pr-8">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-base font-semibold">
                    {p.name}
                  </h3>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {p.year}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{p.pitch}</p>
              </div>
            </HoverCard>
          ))}
        </div>
      </FadeUp>

      {/* Recent writing */}
      <FadeUp as="section" delay={0.15} className="py-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold">Recent writing</h2>
          <Link
            href="/blog"
            className="anim-underline text-sm text-muted-foreground hover:text-foreground"
          >
            All posts
          </Link>
        </div>
        <ul className="divide-y divide-border/60">
          {posts.map((post) => {
            const className =
              "group flex items-baseline justify-between gap-6 py-3 transition-colors";
            const inner = (
              <>
                <span className="flex items-baseline gap-1.5 truncate">
                  <span className="anim-underline truncate text-sm text-foreground">
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

      {/* Tail link */}
      <FadeUp as="div" delay={0.2} className="py-8">
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          See full work history
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </FadeUp>
    </div>
  );
}
