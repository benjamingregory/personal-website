import { cache } from "react";
import { findProject } from "./projects";
import { webAnalyticsDetail, type WebAnalyticsDetail } from "./posthog";
import { recentDeploys, type DeployHistory } from "./vercel";
import type {
  ActivitySeries,
  DailyPoint,
  ProductBreakdown,
} from "./metrics/types";

// Per-section loaders for /[project] pages, each cache()-wrapped so a
// section body and anything else that needs the same data share one fetch
// per request. Sections stream independently — one slow source never blocks
// the rest of the page.

export const loadSeries90 = cache(
  async (key: string): Promise<ActivitySeries | null> =>
    (await findProject(key)?.detail?.series90?.()) ?? null,
);

export const loadProduct = cache(
  async (key: string): Promise<ProductBreakdown[]> =>
    (await findProject(key)?.detail?.product?.()) ?? [],
);

export const loadLlmDaily = cache(
  async (key: string): Promise<DailyPoint[] | null> =>
    (await findProject(key)?.detail?.llmDaily?.()) ?? null,
);

export const loadTrafficDetail = cache(
  async (key: string): Promise<WebAnalyticsDetail> => {
    const project = findProject(key);
    if (!project) return { configured: false };
    return webAnalyticsDetail(project.posthog);
  },
);

export const loadDeployHistory = cache(
  async (key: string): Promise<DeployHistory> => {
    const project = findProject(key);
    if (!project) return { configured: false, deploys: [] };
    return recentDeploys(project.posthog, 8);
  },
);
