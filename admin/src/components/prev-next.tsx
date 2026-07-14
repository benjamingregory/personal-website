import Link from "next/link";
import { PROJECTS } from "@/lib/projects";

// Bottom-of-page round-robin: finish reading one project, continue the
// round. Order matches the overview grid.
export function PrevNext({ current }: { current: string }) {
  const i = PROJECTS.findIndex((p) => p.key === current);
  if (i === -1) return null;
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  return (
    <nav
      aria-label="project pager"
      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule-soft pt-4 text-[10px] uppercase tracking-[0.2em]"
    >
      <Link
        href={`/${prev.key}`}
        prefetch={false}
        className="text-ink-faint hover:text-ink-dim"
      >
        ← {prev.shortName}
      </Link>
      <Link
        href="/"
        prefetch={false}
        className="text-ink-faint hover:text-ink-dim"
      >
        overview
      </Link>
      <Link
        href={`/${next.key}`}
        prefetch={false}
        className="text-ink-faint hover:text-ink-dim"
      >
        {next.shortName} →
      </Link>
    </nav>
  );
}
