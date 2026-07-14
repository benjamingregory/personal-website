import type { PosthogProject } from "./posthog";
import {
  jobflowLlmDaily,
  jobflowMetrics,
  jobflowProduct,
  jobflowSeries90,
} from "./metrics/jobflow";
import {
  kasavaLlmDaily,
  kasavaMetrics,
  kasavaProduct,
  kasavaSeries90,
} from "./metrics/kasava";
import {
  monroeLlmDaily,
  monroeMetrics,
  monroeProduct,
  monroeSeries90,
} from "./metrics/monroe";
import { websiteMetrics } from "./metrics/website";
import type {
  ActivitySeries,
  DailyPoint,
  ProductBreakdown,
  ProjectReport,
} from "./metrics/types";

// Drill-down data sources — each optional; a missing loader simply skips
// that section on the project's page.
export interface ProjectDetailSources {
  series90?: () => Promise<ActivitySeries | null>;
  product?: () => Promise<ProductBreakdown[]>;
  llmDaily?: () => Promise<DailyPoint[] | null>;
}

export interface ProjectDef {
  key: string;
  name: string;
  // Nav-length label ("site" for benjaminrgregory.com).
  shortName: string;
  descriptor: string;
  // Accent hexes are the dark-mode categorical steps from the dataviz
  // reference palette — validated ≥3:1 against the page ground.
  accent: string;
  // Shared env-var suffix for PostHog (POSTHOG_PROJECT_ID_*) and Vercel
  // (VERCEL_PROJECT_ID_*) config.
  posthog: PosthogProject;
  // false → the project has no database of its own (analytics-only card);
  // db checks and the activity pulse are skipped.
  db: boolean;
  // Expected activity cadence: warn when `lastActivityAt` is older than
  // this. The noun names what went quiet ("no evaluations in 3d").
  pulse?: { noun: string; staleAfterHours: number };
  load: () => Promise<ProjectReport>;
  detail?: ProjectDetailSources;
}

export const PROJECTS: ProjectDef[] = [
  {
    key: "jobflow",
    name: "Jobflow",
    shortName: "jobflow",
    descriptor: "AI job-search assistant",
    accent: "#c98500",
    posthog: "JOBFLOW",
    db: true,
    pulse: { noun: "evaluations", staleAfterHours: 48 },
    load: jobflowMetrics,
    detail: {
      series90: jobflowSeries90,
      product: jobflowProduct,
      llmDaily: jobflowLlmDaily,
    },
  },
  {
    key: "kasava",
    name: "Kasava",
    shortName: "kasava",
    descriptor: "product engineering intelligence",
    accent: "#3987e5",
    posthog: "KASAVA",
    db: true,
    pulse: { noun: "intel events", staleAfterHours: 48 },
    load: kasavaMetrics,
    detail: {
      series90: kasavaSeries90,
      product: kasavaProduct,
      llmDaily: kasavaLlmDaily,
    },
  },
  {
    key: "monroe",
    name: "Monroe",
    shortName: "monroe",
    descriptor: "social TV tracking",
    accent: "#e66767",
    posthog: "MONROE",
    db: true,
    pulse: { noun: "episodes logged", staleAfterHours: 72 },
    load: monroeMetrics,
    detail: {
      series90: monroeSeries90,
      product: monroeProduct,
      llmDaily: monroeLlmDaily,
    },
  },
  {
    key: "website",
    name: "benjaminrgregory.com",
    shortName: "site",
    descriptor: "personal site + blog",
    accent: "#199e70",
    posthog: "WEBSITE",
    db: false,
    load: websiteMetrics,
  },
];

export function findProject(key: string): ProjectDef | undefined {
  return PROJECTS.find((p) => p.key === key);
}
