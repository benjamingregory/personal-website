import type { PosthogProject } from "./posthog";

// Latest production deployment for a project, straight from the Vercel API.
// Unconfigured (no token or no project id) degrades to a silent "not wired"
// line in the drill-down instead of a check.
export interface DeployStatus {
  configured: boolean;
  error?: string;
  // Vercel readyState: READY | ERROR | BUILDING | QUEUED | INITIALIZING |
  // CANCELED. Absent when the project has no production deploys yet.
  state?: string;
  createdAt?: Date;
  url?: string;
}

// One row in the drill-down deploy-history table.
export interface DeployRecord {
  state?: string;
  createdAt?: Date;
  // Seconds from creation to READY — absent for failed/in-flight deploys.
  buildSeconds?: number;
  url?: string;
  commit?: string;
}

export interface DeployHistory {
  configured: boolean;
  error?: string;
  deploys: DeployRecord[];
}

interface RawDeployment {
  readyState?: string;
  state?: string;
  createdAt?: number;
  ready?: number;
  url?: string;
  meta?: { githubCommitMessage?: string };
}

async function fetchDeployments(
  project: PosthogProject,
  limit: number,
): Promise<RawDeployment[] | null> {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env[`VERCEL_PROJECT_ID_${project}`];
  if (!token || !projectId) return null;

  const params = new URLSearchParams({
    projectId,
    target: "production",
    limit: String(limit),
  });
  const teamId = process.env.VERCEL_TEAM_ID;
  if (teamId) params.set("teamId", teamId);

  const res = await fetch(`https://api.vercel.com/v6/deployments?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Vercel ${res.status}: ${body.slice(0, 120)}`);
  }
  const data = (await res.json()) as { deployments?: RawDeployment[] };
  return data.deployments ?? [];
}

export async function latestDeploy(
  project: PosthogProject,
): Promise<DeployStatus> {
  try {
    const deployments = await fetchDeployments(project, 1);
    if (deployments === null) return { configured: false };
    const d = deployments[0];
    if (!d) return { configured: true };
    return {
      configured: true,
      state: d.readyState ?? d.state,
      createdAt: d.createdAt ? new Date(d.createdAt) : undefined,
      url: d.url,
    };
  } catch (error) {
    return {
      configured: true,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function recentDeploys(
  project: PosthogProject,
  limit = 8,
): Promise<DeployHistory> {
  try {
    const deployments = await fetchDeployments(project, limit);
    if (deployments === null) return { configured: false, deploys: [] };
    return {
      configured: true,
      deploys: deployments.map((d) => ({
        state: d.readyState ?? d.state,
        createdAt: d.createdAt ? new Date(d.createdAt) : undefined,
        buildSeconds:
          d.ready && d.createdAt
            ? Math.round((d.ready - d.createdAt) / 1000)
            : undefined,
        url: d.url,
        commit: d.meta?.githubCommitMessage,
      })),
    };
  } catch (error) {
    return {
      configured: true,
      error: error instanceof Error ? error.message : String(error),
      deploys: [],
    };
  }
}
