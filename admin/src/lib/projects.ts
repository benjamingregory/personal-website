import type { PosthogProject } from "./posthog";
import { jobflowMetrics } from "./metrics/jobflow";
import { kasavaMetrics } from "./metrics/kasava";
import { monroeMetrics } from "./metrics/monroe";
import { websiteMetrics } from "./metrics/website";
import type { ProjectReport } from "./metrics/types";

export interface ProjectDef {
  key: string;
  name: string;
  descriptor: string;
  // Accent hexes are the dark-mode categorical steps from the dataviz
  // reference palette — validated ≥3:1 against the page ground.
  accent: string;
  posthog: PosthogProject;
  load: () => Promise<ProjectReport>;
}

export const PROJECTS: ProjectDef[] = [
  {
    key: "jobflow",
    name: "Jobflow",
    descriptor: "AI job-search assistant",
    accent: "#c98500",
    posthog: "JOBFLOW",
    load: jobflowMetrics,
  },
  {
    key: "kasava",
    name: "Kasava",
    descriptor: "product engineering intelligence",
    accent: "#3987e5",
    posthog: "KASAVA",
    load: kasavaMetrics,
  },
  {
    key: "monroe",
    name: "Monroe",
    descriptor: "social TV tracking",
    accent: "#e66767",
    posthog: "MONROE",
    load: monroeMetrics,
  },
  {
    key: "website",
    name: "benjaminrgregory.com",
    descriptor: "personal site + blog",
    accent: "#199e70",
    posthog: "WEBSITE",
    load: websiteMetrics,
  },
];
