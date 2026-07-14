import { cache } from "react";
import { PROJECTS, type ProjectDef } from "./projects";
import { webAnalytics, type WebAnalytics } from "./posthog";
import { latestDeploy, type DeployStatus } from "./vercel";
import { computeChecks } from "./health";
import {
  worstStatus,
  type Check,
  type CheckStatus,
  type ProjectReport,
} from "./metrics/types";

export interface ProjectSnapshot {
  project: ProjectDef;
  report: ProjectReport;
  analytics: WebAnalytics;
  deploy: DeployStatus;
  checks: Check[];
  status: CheckStatus;
}

// One load per project per request. The status strip awaits all four; each
// card awaits its own — React's cache() shares the promise between them, so
// nothing is fetched twice and cards still stream independently.
export const loadSnapshot = cache(
  async (key: string): Promise<ProjectSnapshot> => {
    const project = PROJECTS.find((p) => p.key === key);
    if (!project) throw new Error(`Unknown project: ${key}`);

    const t0 = Date.now();
    const [report, analytics, deploy] = await Promise.all([
      project
        .load()
        // Only DB projects get a latency stamp — the website's loader is a
        // no-op and a "db 105ms" readout there would be fiction.
        .then((r) =>
          project.db ? { ...r, latencyMs: Date.now() - t0 } : r,
        ),
      webAnalytics(project.posthog),
      latestDeploy(project.posthog),
    ]);

    const checks = computeChecks(project, report, analytics, deploy);
    return { project, report, analytics, deploy, checks, status: worstStatus(checks) };
  },
);
