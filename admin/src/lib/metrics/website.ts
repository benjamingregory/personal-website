import { UNCONFIGURED, type ProjectReport } from "./types";

// The personal site has no database — its section is driven entirely by
// PostHog web analytics (see posthog.ts). Report shape kept for symmetry.
export async function websiteMetrics(): Promise<ProjectReport> {
  return { ...UNCONFIGURED, configured: true };
}
