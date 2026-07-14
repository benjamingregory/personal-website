import { estimateUsd, fmtUsd } from "./metrics/llm-usage";
import type { ProjectReport, Check } from "./metrics/types";
import type { WebAnalytics } from "./posthog";
import type { DeployStatus } from "./vercel";
import type { ProjectDef } from "./projects";
import { age, hoursSince } from "./format";

// A DB round-trip this slow usually means the Supabase pooler is wedged or
// the pool is saturated — worth surfacing before queries start hanging.
const SLOW_DB_MS = 4_000;
// Exceptions in the last 24h: any → warn, a flood → err.
const EXCEPTION_ERR_COUNT = 50;
// Weekly LLM spend warns when it clears both an absolute floor and a
// multiple of the prior week — small-dollar noise stays quiet.
const SPEND_WARN_MIN_USD = 5;
const SPEND_WARN_MULTIPLIER = 2;

// Every deviation a project can currently report, worst-first within each
// source. Healthy checks are never emitted — the absence of a check IS the
// ok state, so callers can render `checks` directly as the alert list.
export function computeChecks(
  project: ProjectDef,
  report: ProjectReport,
  analytics: WebAnalytics,
  deploy: DeployStatus,
): Check[] {
  const checks: Check[] = [];

  if (project.db) {
    if (!report.configured) {
      checks.push({
        name: "db",
        status: "warn",
        detail: "db not wired",
        section: "checks",
      });
    } else if (report.error) {
      checks.push({
        name: "db",
        status: "err",
        detail: `db unreachable — ${report.error.slice(0, 120)}`,
        section: "checks",
      });
    } else {
      if (report.latencyMs != null && report.latencyMs > SLOW_DB_MS) {
        checks.push({
          name: "db",
          status: "warn",
          detail: `db slow — ${(report.latencyMs / 1000).toFixed(1)}s round-trip`,
          section: "checks",
        });
      }
      if (project.pulse) {
        if (!report.lastActivityAt) {
          checks.push({
            name: "pulse",
            status: "warn",
            detail: `no ${project.pulse.noun} yet`,
            section: "activity",
          });
        } else if (
          hoursSince(report.lastActivityAt) > project.pulse.staleAfterHours
        ) {
          checks.push({
            name: "pulse",
            status: "warn",
            detail: `no ${project.pulse.noun} in ${age(report.lastActivityAt)}`,
            section: "activity",
          });
        }
      }
    }
  }

  if (!analytics.configured) {
    checks.push({
      name: "posthog",
      status: "warn",
      detail: "posthog not wired",
      section: "checks",
    });
  } else if (analytics.error) {
    checks.push({
      name: "posthog",
      status: "warn",
      detail: `posthog — ${analytics.error.slice(0, 120)}`,
      section: "checks",
    });
  } else if (analytics.exceptions24h != null && analytics.exceptions24h > 0) {
    checks.push({
      name: "errors",
      status:
        analytics.exceptions24h >= EXCEPTION_ERR_COUNT ? "err" : "warn",
      detail: `${analytics.exceptions24h} exceptions past 24h`,
      section: "errors",
    });
  }

  if (deploy.configured) {
    if (deploy.error) {
      checks.push({
        name: "deploy",
        status: "warn",
        detail: `vercel — ${deploy.error.slice(0, 120)}`,
        section: "deploys",
      });
    } else if (deploy.state === "ERROR") {
      checks.push({
        name: "deploy",
        status: "err",
        detail: deploy.createdAt
          ? `deploy failed ${age(deploy.createdAt)} ago`
          : "deploy failed",
        section: "deploys",
      });
    } else if (deploy.state === "CANCELED") {
      checks.push({
        name: "deploy",
        status: "warn",
        detail: "last deploy canceled",
        section: "deploys",
      });
    }
  }

  if (report.llm) {
    const usd7 = estimateUsd(report.llm.last7d);
    const prior = estimateUsd(report.llm.prior7d);
    if (
      usd7 >= SPEND_WARN_MIN_USD &&
      usd7 >= SPEND_WARN_MULTIPLIER * Math.max(prior, 0.5)
    ) {
      checks.push({
        name: "spend",
        status: "warn",
        detail: `llm spend ${fmtUsd(usd7)} past 7d (prior week ${fmtUsd(prior)})`,
        section: "llm",
      });
    }
  }

  return checks;
}
