import { Suspense } from "react";
import { PROJECTS } from "@/lib/projects";
import { loadSnapshot } from "@/lib/snapshot";
import { StatusDot } from "./status-dot";
import { NavClient } from "./nav-client";

// Deviation-only nav dot: silence is the ok state — a dot next to `monroe`
// while you're reading the inrole page is signal, four green dots is noise.
async function NavDot({ projectKey }: { projectKey: string }) {
  const snap = await loadSnapshot(projectKey);
  if (snap.status === "ok") return null;
  return <StatusDot status={snap.status} />;
}

// The desk's persistent destination row. Lives in the layout so the frame
// never blanks while a slow page streams; each dot streams behind its own
// Suspense so the nav text paints with zero data.
export function DeskNav() {
  const items = [
    { href: "/", label: "overview", hint: "o", dot: null },
    ...PROJECTS.map((p, i) => ({
      href: `/${p.key}`,
      label: p.shortName,
      hint: String(i + 1),
      dot: (
        <Suspense fallback={null}>
          <NavDot projectKey={p.key} />
        </Suspense>
      ),
    })),
  ];

  return <NavClient items={items} />;
}
