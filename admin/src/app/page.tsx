import { Suspense } from "react";
import { PROJECTS } from "@/lib/projects";
import { ProjectCard, CardSkeleton } from "@/components/project-card";
import { StatusStrip, StripSkeleton } from "@/components/status-strip";

// Always render live — every load reads the databases directly.
export const dynamic = "force-dynamic";

// Single pane of glass: the strip answers "is anything broken?", the 2×2
// card grid answers "is anything moving?" — all four projects above the
// fold. Depth lives on each project's /[project] drill-down page.
export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-6">
      <Suspense fallback={<StripSkeleton />}>
        <StatusStrip refreshSeconds={60} />
      </Suspense>
      {/* grid-cols-1 matters: without a template the implicit column sizes
          to max-content and long tokens push past the phone viewport.
          items-start: a tall card must not stretch its row sibling. */}
      <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        {PROJECTS.map((project) => (
          <Suspense
            key={project.key}
            fallback={<CardSkeleton project={project} />}
          >
            <ProjectCard project={project} />
          </Suspense>
        ))}
      </div>
    </main>
  );
}
