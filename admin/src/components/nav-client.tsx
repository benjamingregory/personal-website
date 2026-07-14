"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export interface NavItem {
  href: string;
  label: string;
  // Single-key shortcut; also rendered as the faint hint before the label.
  hint: string;
  // Server-rendered status dot (Suspense-wrapped) passed through untouched.
  dot: React.ReactNode;
}

// The one client shim in the nav: pathname → active link, plus single-key
// shortcuts (o = overview, 1–4 = projects). Everything data-bearing stays on
// the server and arrives via the `dot` slots.
export function NavClient({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const el = document.activeElement as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }
      const item = items.find((i) => i.hint === e.key);
      if (item) router.push(item.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, router]);

  return (
    <nav
      aria-label="projects"
      className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-rule pb-3 text-[10px] uppercase tracking-[0.2em]"
    >
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            aria-current={active ? "page" : undefined}
            className={`flex items-baseline gap-1.5 ${
              active ? "text-ink" : "text-ink-faint hover:text-ink-dim"
            }`}
          >
            <span aria-hidden className="hidden text-ink-faint sm:inline">
              {item.hint}
            </span>
            {item.label}
            {/* Fixed-width dot slot: a late-arriving dot never shifts layout. */}
            <span className="inline-block w-2 self-center">{item.dot}</span>
          </Link>
        );
      })}
    </nav>
  );
}
