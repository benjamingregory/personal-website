"use client";

import dynamic from "next/dynamic";
import { WEBGL_FX_ENABLED } from "./flags";
import { DARK_COLORS, LIGHT_COLORS, MASK } from "./palette";

const GradientHero = dynamic(() => import("./gradient-hero"), { ssr: false });

/**
 * SSR shell for the hero wash. The positioned wrapper, mask, opacity, and a
 * static CSS approximation of the wash are all in the server HTML, so the
 * wash paints with the rest of the hero. The shader itself (hydration + its
 * own chunk + WebGL compile behind it) cross-fades in on top once mounted —
 * same palette on both layers, so the handoff reads as the wash waking up,
 * not a swap.
 */

// The mesh laid out as soft radial pools: a highlight, the base tan, one
// warm accent, one shadow. Position/coverage only approximate the shader —
// it shows for a few hundred ms before the cross-fade.
function washFallback([base, highlight, shadow, accent]: string[]) {
  return [
    `radial-gradient(ellipse 70% 55% at 18% 22%, ${highlight} 0%, transparent 62%)`,
    `radial-gradient(ellipse 65% 60% at 82% 15%, ${base} 0%, transparent 65%)`,
    `radial-gradient(ellipse 55% 45% at 65% 62%, ${accent} 0%, transparent 68%)`,
    `radial-gradient(ellipse 60% 50% at 30% 78%, ${shadow} 0%, transparent 70%)`,
    base,
  ].join(", ");
}

export default function GradientHeroLazy({
  intensity,
}: {
  intensity?: number;
}) {
  if (!WEBGL_FX_ENABLED) return null;
  return (
    <div
      aria-hidden
      // The 0.35 light ceiling is a contrast constraint: muted ink must hold
      // 4.5:1 over the wash's deepest stop (see palette.ts). Recheck if raising.
      className="pointer-events-none absolute left-1/2 -top-14 -z-10 h-[400%] w-screen -translate-x-1/2 opacity-[0.35] dark:opacity-[0.7]"
      style={{
        opacity: intensity,
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      <div
        className="absolute inset-0 dark:hidden"
        style={{ background: washFallback(LIGHT_COLORS) }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{ background: washFallback(DARK_COLORS) }}
      />
      <GradientHero />
    </div>
  );
}
