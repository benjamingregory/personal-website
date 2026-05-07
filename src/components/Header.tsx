"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import AnimatedThemeToggle from "./motion/AnimatedThemeToggle";
import { cn } from "@/lib/utils";

const NAV: Array<{ name: string; href: string; mobile?: boolean }> = [
  { name: "Work", href: "/work", mobile: true },
  { name: "Projects", href: "/projects", mobile: true },
  { name: "Blog", href: "/blog", mobile: true },
  { name: "Education", href: "/education" },
];

export default function Header() {
  const pathname = usePathname();
  const top = "/" + (pathname.split("/")[1] || "");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Home"
          className="whitespace-nowrap font-display font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/80"
        >
          Ben Gregory
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Main">
          {NAV.map((item) => {
            const active = top === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md font-medium px-2 py-1.5 text-sm transition-colors sm:px-3",
                  !item.mobile && "hidden sm:inline-flex",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.name}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-px h-px bg-foreground sm:inset-x-3"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
          <span className="ml-1 sm:ml-2">
            <AnimatedThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
