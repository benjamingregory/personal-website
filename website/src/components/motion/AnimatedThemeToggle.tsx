"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";

export default function AnimatedThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const ls = localStorage.getItem("darkMode");
    const dark =
      ls === "true" ||
      (!ls && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("darkMode", String(next));
    document.documentElement.classList.toggle("dark", next);
  }

  if (!mounted) {
    return (
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-md"
        aria-label="Toggle theme"
      />
    );
  }

  const Icon = isDark ? Sun : Moon;

  if (reduced) {
    return (
      <button
        onClick={toggle}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-transform duration-150 ease-out active:scale-95 hover:bg-muted hover:text-foreground"
        aria-label="Toggle theme"
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-[color,background-color,transform] duration-150 ease-out active:scale-95 hover:bg-muted hover:text-foreground"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -45, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 45, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inline-flex"
        >
          <Icon className="h-4 w-4" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
