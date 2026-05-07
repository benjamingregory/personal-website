"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
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
  const lockedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const compute = () => {
      if (lockedRef.current) return;
      const offset = 120;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = item.id;
        else break;
      }
      setActive(current);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const target = el.getBoundingClientRect().top + window.scrollY - 96;
    history.pushState(null, "", `#${id}`);
    setActive(id);
    lockedRef.current = true;

    if (reduced) {
      window.scrollTo(0, target);
      lockedRef.current = false;
      return;
    }

    animate(window.scrollY, target, {
      duration: 0.7,
      ease: [0.32, 0.72, 0, 1],
      onUpdate: (latest) => window.scrollTo(0, latest),
      onComplete: () => {
        lockedRef.current = false;
      },
    });
  };

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
                onClick={(e) => handleClick(e, item.id)}
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
