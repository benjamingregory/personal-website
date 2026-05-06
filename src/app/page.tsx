import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ArrowRight } from "lucide-react";
import FadeUp from "@/components/motion/FadeUp";
import HoverCard from "@/components/motion/HoverCard";
import { getAllPosts } from "@/lib/posts";

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
  const posts = (await getAllPosts()).slice(0, 3);

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
          {posts.map((post) => (
            <li key={post.url}>
              <Link
                href={post.url}
                className="group flex items-baseline justify-between gap-6 py-3 transition-colors"
              >
                <span className="flex items-baseline gap-3 truncate">
                  <span className="anim-underline truncate text-sm text-foreground">
                    {post.title}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {format(parseISO(post.date), "MMM yyyy")}
                </span>
              </Link>
            </li>
          ))}
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
