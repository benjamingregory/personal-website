import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { loadSnapshot } from "@/lib/snapshot";
import { worstStatus } from "@/lib/metrics/types";
import { StatusDot, STATUS_TEXT } from "./status-dot";

// The two-second answer: one dot for the whole desk, then every open
// deviation as its own line linking to the project's card. Healthy projects
// contribute nothing here — silence is the ok state.
export async function StatusStrip({
  refreshSeconds,
}: {
  refreshSeconds: number;
}) {
  const snaps = await Promise.all(PROJECTS.map((p) => loadSnapshot(p.key)));
  const issues = snaps.flatMap((s) =>
    s.checks.map((check) => ({ project: s.project, check })),
  );
  const overall = worstStatus(issues.map((i) => i.check));
  const errs = issues.filter((i) => i.check.status === "err").length;
  const warns = issues.filter((i) => i.check.status === "warn").length;
  const stamp = new Date().toISOString().slice(11, 19);

  const summary =
    overall === "ok"
      ? "all systems normal"
      : [
          errs > 0 && `${errs} ${errs === 1 ? "failure" : "failures"}`,
          warns > 0 && `${warns} ${warns === 1 ? "warning" : "warnings"}`,
        ]
          .filter(Boolean)
          .join(" · ");

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule pb-3">
        <p className="flex items-baseline gap-2.5 text-sm">
          <span className="self-center">
            <StatusDot status={overall} />
          </span>
          <span className={overall === "ok" ? "text-ink" : STATUS_TEXT[overall]}>
            {summary}
          </span>
        </p>
        <p
          suppressHydrationWarning
          className="text-[11px] tabular-nums text-ink-faint"
        >
          {PROJECTS.length} projects · updated {stamp} UTC · refreshes{" "}
          {refreshSeconds}s
        </p>
      </div>
      {issues.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {issues.map(({ project, check }) => (
            <li
              key={`${project.key}-${check.name}-${check.detail}`}
              className="flex items-baseline gap-2.5 text-xs"
            >
              <span className="self-center">
                <StatusDot status={check.status} />
              </span>
              {/* Symptom → evidence: land on the drill-down section that
                  explains the alert, not just the project's card. */}
              <Link
                href={`/${project.key}${check.section !== "checks" ? `#${check.section}` : ""}`}
                prefetch={false}
                className="shrink-0 text-ink underline decoration-rule underline-offset-4 hover:decoration-ink-dim"
              >
                {project.shortName}
              </Link>
              <span className={STATUS_TEXT[check.status]}>{check.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function StripSkeleton() {
  return (
    <div className="flex animate-pulse items-center justify-between border-b border-rule pb-3">
      <div className="h-4 w-44 rounded bg-panel" />
      <div className="h-3 w-64 rounded bg-panel" />
    </div>
  );
}
