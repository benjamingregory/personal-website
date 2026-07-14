import { Suspense } from "react";

// Drill-down page section: the shell (anchor id + labelled rule) renders
// synchronously so `/project#deploys` deep links always have a scroll target
// in the DOM, while the body streams behind its own Suspense.
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-4">
      <div className="flex items-baseline justify-between gap-4 border-b border-rule-soft pb-2">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {title}
        </h3>
        <a
          href="#"
          className="text-[10px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink-dim"
        >
          top
        </a>
      </div>
      <div className="mt-5">
        <Suspense fallback={<SectionSkeleton />}>{children}</Suspense>
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-3 w-40 rounded bg-panel" />
      <div className="h-16 rounded bg-panel" />
    </div>
  );
}
