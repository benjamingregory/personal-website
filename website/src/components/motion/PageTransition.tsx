"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // Only animate client-side route changes. On first load, `initial: false`
  // keeps the server HTML visible instead of hiding it until hydration.
  const [state, setState] = useState({ path: pathname, first: true });
  if (state.path !== pathname) {
    setState({ path: pathname, first: false });
  }
  const isFirstRoute = state.path === pathname && state.first;

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={isFirstRoute ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
