import { Suspense } from "react";
import { PROJECTS } from "@/lib/projects";
import {
  ProjectSection,
  SectionSkeleton,
} from "@/components/project-section";

// Always render live — every load reads the databases directly.
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6">
      {PROJECTS.map((project, index) => (
        <Suspense
          key={project.key}
          fallback={<SectionSkeleton project={project} index={index} />}
        >
          <ProjectSection project={project} index={index} />
        </Suspense>
      ))}
    </main>
  );
}
