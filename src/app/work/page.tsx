import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import FadeUp from "@/components/motion/FadeUp";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Professional experience as a software engineer and product manager — from founding startups to leading teams at scale-ups.",
  openGraph: {
    title: "Work · Ben Gregory",
    description:
      "Professional experience as a software engineer and product manager",
    type: "website",
    url: "https://bengregory.com/work",
  },
};

const ROLES: Array<{
  role: string;
  company: string;
  year: string;
  link: string;
  summary: string;
  highlights?: string[];
}> = [
  {
    role: "Founder",
    company: "Kasava",
    year: "2025 — present",
    link: "https://kasava.dev",
    summary:
      "Building an AI workflow tool for engineering teams: GitHub-to-task sync across 15+ platforms, repo indexing with semantic search, AI-powered code analysis, and a Chrome extension that captures bugs straight into GitHub.",
    highlights: [
      "Cloudflare Workers backend with a multi-stage queue pipeline that indexes 10–30 files/sec into Postgres + pgvector.",
      "Mastra and the Vercel AI SDK orchestrate Anthropic Claude, Gemini, Vertex AI, and Voyage embeddings across the workflow.",
      "Chrome extension captures video, console, network and DOM state; Gemini 1.5 Pro generates the root-cause writeup before filing the GitHub issue.",
    ],
  },
  {
    role: "Founder",
    company: "Monroe",
    year: "2024 — 2025",
    link: "https://joinmonroe.com",
    summary:
      "TV-show platform with intelligent recommendations and an AI companion across web, mobile, and desktop — the Goodreads for television.",
    highlights: [
      "Web (Next.js 16), mobile (React Native + Expo), and desktop (Electron), all sharing a Hono API on Cloudflare Workers.",
      "AI companion with persistent memory of viewing history, built on Mastra with Anthropic Claude and OpenAI.",
      "Automated scraping of 20+ entertainment outlets with article-type classification and show extraction via gpt-4o-mini.",
    ],
  },
  {
    role: "Senior PM, Freight",
    company: "Deliverr → Shopify → Flexport",
    year: "2022 — 2023",
    link: "https://flexport.com",
    summary:
      "Joined Deliverr at Series E to launch and grow domestic Freight to $15MM ARR. Acquired by Shopify in 2022; the division was acquired by Flexport in 2023.",
    highlights: [
      "Shipped a quoting tool that cut customer quote turnaround from 24 hours to 10 seconds.",
      "Launched the Freight app inside Deliverr&rsquo;s seller portal — moved 65% of customers to self-serve, grew automated bookings 40% in three months.",
    ],
  },
  {
    role: "Senior PM, Founding Team",
    company: "Astronomer",
    year: "2015 — 2019",
    link: "https://www.astronomer.io",
    summary:
      "Founding-team PM at the company that productized Apache Airflow. Customer-facing for the first year — 100% retention through the Angelpad cohort.",
    highlights: [
      "Led an eight-person customer team across the US, Poland, and India to deliver the platform for a Fortune 50 consumer-goods customer.",
      "Built and grew an open Airflow plugins community with contributions from the US, Germany, Ireland, Israel, South Korea, and Taiwan.",
    ],
  },
  {
    role: "PM Intern",
    company: "Gusto",
    year: "2021",
    link: "https://gusto.com",
    summary:
      "Launched in-app control of Tax-Advantaged Accounts and evaluated expansion into Property & Casualty Insurance.",
  },
  {
    role: "MBA Associate",
    company: "Activision Blizzard",
    year: "2020",
    link: "https://www.activisionblizzard.com",
    summary:
      "Ran a technical PM pilot for an internal platform supporting 125MM MAU; forecasted GCP migration costs and presented to the COO.",
  },
];

export default function Work() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      <FadeUp as="header" className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Work
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A decade of building products — from open-source platforms to
          AI-native tools. The roles below are listed most-recent first.
        </p>
      </FadeUp>

      <div className="space-y-12">
        {ROLES.map((role, i) => (
          <FadeUp key={role.company + role.year} delay={i * 0.04}>
            <article className="grid gap-3 sm:grid-cols-[160px_1fr] sm:gap-8">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground sm:pt-1">
                {role.year}
              </div>
              <div className="space-y-3">
                <header className="space-y-0.5">
                  <h2 className="font-display text-lg font-semibold">
                    {role.role}
                  </h2>
                  <Link
                    href={role.link}
                    target="_blank"
                    rel="noreferrer"
                    className="anim-underline inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {role.company}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </header>
                <p className="text-sm leading-relaxed text-foreground/85">
                  {role.summary}
                </p>
                {role.highlights && (
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {role.highlights.map((h, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-muted-foreground/50">·</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}
