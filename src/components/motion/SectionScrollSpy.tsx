"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Item = { id: string; label: string };

export default function SectionScrollSpy({
  items,
  className,
}: {
  items: Item[];
  className?: string;
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className={cn("hidden xl:block", className)}
    >
      <ul className="space-y-1 border-l border-border pl-4 text-sm">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "relative block py-1 transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && !reduced && (
                  <motion.span
                    layoutId="scrollspy-marker"
                    className="absolute -left-4 top-0 h-full w-px bg-foreground"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
