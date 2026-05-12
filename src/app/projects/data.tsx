import { type ProjectMediaConfig } from "@/components/ProjectMedia";


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

export const PROJECTS: Project[] = [
  {
    name: "Kasava",
    year: "2025 — present",
    pitch: "Cursor for Product Managers",
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
    pitch: "Job search and evaluation agent.",
    body: "Jobflow evaluates job descriptions against your profile, generates tailored CVs, drafts outreach for LinkedIn and email, and ranks warm intros from your network. A Mastra-orchestrated multi-agent system runs evaluation workflows with bounded concurrency and only commits to a polished PDF for the matches it scores highly.",
    site: "jobflow.dev",
    link: "https://jobflow.benjaminrgregory.com",
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
        hero: "Jobflow pipeline board grouping roles by stage from evaluated through offer",
        "2": "Jobflow pipeline list view sorted by match score",
        "3": "Jobflow warm intros grouped by company with connection counts",
        "4": "Jobflow role detail with CV match breakdown against the job description",
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
        hero: "Demokit new-project wizard reviewing detected templates, features, and journeys",
        "2": "Demokit project view with datasets and per-entity field generation rules",
        "3": "Demokit schema analysis step building intelligence from a parsed schema",
        "4": "Demokit project-created screen with project ID, intelligence summary, and quick-start snippet",
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