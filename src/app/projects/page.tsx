import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import FadeUp from "@/components/motion/FadeUp";
import StackToggle from "@/components/motion/StackToggle";
import ProjectMedia, { type ProjectMediaConfig } from "@/components/ProjectMedia";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects — AI-powered platforms, developer tools, and infrastructure built across web, mobile, and desktop.",
  openGraph: {
    title: "Projects · Ben Gregory",
    description: "Selected projects across AI, developer tools, and infra",
    type: "website",
    url: "https://bengregory.com/projects",
  },
};

type Project = {
  name: string;
  year: string;
  pitch: string;
  body: string;
  site: string;
  link: string;
  primaryStack: string[];
  fullStack: Record<string, string[]>;
  media?: ProjectMediaConfig;
};

const PROJECTS: Project[] = [
  {
    name: "Kasava",
    year: "2025 — present",
    pitch: "AI workflow tool for engineering teams.",
    body: "Kasava connects engineering teams' GitHub repos to a multi-stage indexing pipeline (10–30 files/sec into Postgres + pgvector), a multi-agent system that orchestrates Anthropic Claude, Google Gemini, and Voyage embeddings for code analysis, two-way sync with 15+ task platforms, and a Chrome extension that captures bug context — video, console, network, DOM — and drafts a root-cause writeup before filing the GitHub issue.",
    site: "kasava.dev",
    link: "https://kasava.dev",
    primaryStack: [
      "Cloudflare Workers",
      "Hono",
      "Postgres + pgvector",
      "Mastra",
      "Anthropic",
      "Next.js",
    ],
    fullStack: {
      Frontend: ["Next.js", "React", "Tailwind", "shadcn", "Framer Motion"],
      Backend: [
        "Cloudflare Workers",
        "Hono",
        "Postgres + pgvector",
        "Multi-stage queue pipeline",
      ],
      "AI/ML": [
        "Anthropic Claude",
        "Google Gemini",
        "Vertex AI",
        "Voyage embeddings",
        "Mastra agents + workflows",
        "Vercel AI SDK",
      ],
      Extension: [
        "Chrome MV3",
        "Video / DOM / network / console capture",
        "Gemini 1.5 Pro writeup",
      ],
      Integrations: ["GitHub", "15+ task platforms"],
    },
    media: {
      slug: "kasava",
      altPrefix: "Kasava",
      alts: {
        hero: "Kasava workspace",
        "2": "Kasava commit and code analysis view",
        "3": "Kasava bug-capture Chrome extension",
      },
    },
  },
  {
    name: "Monroe",
    year: "2024 — 2025",
    pitch: "Goodreads for television.",
    body: "Monroe is a TV-show platform with intelligent recommendations and an AI companion that remembers your viewing history. Built across web (Next.js 16), mobile (React Native + Expo), and desktop (Electron), all on a shared Hono API on Cloudflare Workers. A scraping pipeline pulls from 20+ entertainment outlets and uses gpt-4o-mini to classify article types and extract show references.",
    site: "joinmonroe.com",
    link: "https://joinmonroe.com",
    primaryStack: [
      "Next.js 16",
      "React Native",
      "Electron",
      "Cloudflare Workers",
      "Hono",
      "Mastra",
    ],
    fullStack: {
      Web: ["Next.js 16", "React 19", "Tailwind"],
      Mobile: ["React Native", "Expo"],
      Desktop: ["Electron"],
      Backend: ["Hono", "Cloudflare Workers", "Postgres", "Drizzle"],
      "AI/ML": [
        "Anthropic Claude",
        "OpenAI",
        "gpt-4o-mini classification",
        "Mastra agents",
      ],
      Pipeline: [
        "20+ outlet scrapers",
        "Article-type classification",
        "Show extraction",
      ],
    },
    media: {
      slug: "monroe",
      altPrefix: "Monroe",
      alts: {
        hero: "Monroe library and recent activity",
        "2": "Monroe show detail with critic match",
        "3": "Monroe episode calendar",
      },
    },
  },
  {
    name: "Jobflow",
    year: "2026 — present",
    pitch: "AI job-search agent.",
    body: "Jobflow evaluates job descriptions against your profile, generates tailored CVs, drafts outreach for LinkedIn and email, and ranks warm intros from your network. A Mastra-orchestrated multi-agent system runs evaluation workflows with bounded concurrency and only commits to a polished PDF for the matches it scores highly.",
    site: "jobflow.dev",
    link: "https://jobflow.dev",
    primaryStack: [
      "Next.js 16",
      "Mastra",
      "Anthropic",
      "Supabase",
      "Drizzle",
      "Firecrawl",
    ],
    fullStack: {
      Frontend: ["Next.js 16", "React 19", "Tailwind", "shadcn", "Framer Motion"],
      Backend: [
        "Server Actions",
        "Supabase Postgres",
        "Drizzle ORM",
        "Playwright PDF",
      ],
      "AI/ML": [
        "Anthropic Claude Sonnet 4.6",
        "Anthropic Claude Haiku 4.5",
        "Mastra agents + workflows",
        "Vercel AI SDK",
      ],
      Infrastructure: ["Supabase Auth + RLS", "Firecrawl"],
    },
    media: {
      slug: "jobflow",
      altPrefix: "Jobflow",
      alts: {
        hero: "Jobflow match dashboard",
      },
    },
  },
  {
    name: "Demokit",
    year: "2025 — present",
    pitch: "Demo-mode SDK for SaaS apps.",
    body: "Demokit turns a real product UI into an interactive demo with about ten lines of code — a framework-agnostic fetch and XHR interceptor with pattern-based URL matching and AI-generated fixtures from OpenAPI specs or Drizzle schemas. Originally extracted from Kasava's demo mode; now a TypeScript monorepo of an open-source core, framework adapters, and a hosted cloud dashboard.",
    site: "demokit.ai",
    link: "https://demokit.ai",
    primaryStack: [
      "TypeScript",
      "Turbo",
      "Mastra",
      "Anthropic",
      "Drizzle",
      "Next.js 16",
    ],
    fullStack: {
      Core: [
        "@demokit-ai/core",
        "fetch + XHR interception",
        "<5KB gzipped",
        "SSR-safe",
      ],
      Adapters: [
        "React",
        "React Router",
        "Remix",
        "TanStack Query",
        "tRPC",
        "SWR",
      ],
      Cloud: ["Next.js 16", "Postgres", "Drizzle ORM", "Next Safe Action"],
      "AI/ML": [
        "Anthropic",
        "Mastra",
        "Vercel AI SDK",
        "OpenAPI / Drizzle fixture gen",
      ],
      Tooling: ["Turbo monorepo", "Changesets", "MDX docs"],
    },
    media: {
      slug: "demokit",
      altPrefix: "Demokit",
      alts: {
        hero: "Demokit cloud dashboard",
      },
    },
  },
  {
    name: "Airflow Plugins",
    year: "2017 — 2019",
    pitch: "Open-data community for Apache Airflow.",
    body: "Built and ran the open-source community of plugins around Apache Airflow during the early days of Astronomer. Garnered code contributions from engineers in the US, Germany, Ireland, Israel, South Korea, and Taiwan.",
    site: "github.com/airflow-plugins",
    link: "https://github.com/airflow-plugins/Example-Airflow-DAGs",
    primaryStack: ["Python", "Apache Airflow", "Docker"],
    fullStack: {
      Core: ["Python", "Apache Airflow", "Docker"],
    },
  },
];

export default function Projects() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      <FadeUp as="header" className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A short list of things I&rsquo;ve built. Most are still running; one
          is a community. Click through to the live site for any of them.
        </p>
      </FadeUp>

      <div className="space-y-12">
        {PROJECTS.map((project, i) => (
          <FadeUp key={project.name} delay={i * 0.06}>
            <article className="space-y-5">
              {/* Header row */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-baseline gap-3">
                  <h2 className="font-display text-2xl font-semibold">
                    {project.name}
                  </h2>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {project.year}
                  </span>
                </div>
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="anim-underline inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {project.site}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              <ProjectMedia config={project.media} priority={i === 0} />

              {/* Pitch + body */}
              <div className="space-y-3">
                <p className="text-base font-medium text-foreground">
                  {project.pitch}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.body}
                </p>
              </div>

              {/* Primary stack chips */}
              <div className="flex flex-wrap gap-1.5">
                {project.primaryStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-foreground/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Full stack toggle (animated) */}
              <StackToggle stack={project.fullStack} />
            </article>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}
