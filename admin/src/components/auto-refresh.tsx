"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Re-renders the whole server tree on an interval so the pane of glass stays
// current without a manual reload. Skips ticks while the tab is hidden and
// catches up the moment it becomes visible again.
export function AutoRefresh({ seconds }: { seconds: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) router.refresh();
    }, seconds * 1000);
    const onVisible = () => {
      if (!document.hidden) router.refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router, seconds]);

  return null;
}
