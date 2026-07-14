"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { MeshGradient } from "@paper-design/shaders-react";

/**
 * Warm mesh gradient behind the hero — the site's one sanctioned ambient
 * layer (DESIGN_PRINCIPLES §4). Paper Shaders' built-in grain overlay keeps
 * gradient + film-grain texture in one component. Colors track the
 * light/dark theme; light mode runs at lower opacity so muted ink stays at
 * AA contrast over the warmest spots. The mask reaches full transparency
 * well before the canvas edge so the wash ends in a fade, not a seam.
 * Reduced-motion freezes it (speed 0).
 */

// Cream to amber — visibly warm, high-chroma stops. Saturation is what keeps
// the wash clean: vivid golds blend into more gold, while pale desaturated
// tans blend into gray-brown mud. The deepest amber at the 0.6 light-mode
// opacity blends to ~#F5D4A3 over the paper — 4.7:1 against muted ink.
const LIGHT_COLORS = ["#fdf3dd", "#f6d99b", "#fbeac6", "#f0bb6f"];
// Low-luminance embers — warm depth over near-black, never white.
const DARK_COLORS = ["#241d14", "#33271a", "#1b1610", "#3e2f1c"];

// Fade completes at 92% of the canvas, safely inside the bottom edge.
const MASK = "linear-gradient(to bottom, black 55%, transparent 92%)";

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export default function GradientHero({ intensity }: { intensity?: number }) {
  const reduced = useReducedMotion();
  const dark = useIsDark();
  // Dark embers can run hotter than light sand: text over the light wash is
  // mid-gray muted ink, so the light ceiling is a contrast constraint.
  const opacity = intensity ?? (dark ? 0.7 : 0.5);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 -top-14 -z-10 h-[250%] w-screen -translate-x-1/2"
      style={{
        opacity,
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      <MeshGradient
        className="h-full w-full"
        colors={dark ? DARK_COLORS : LIGHT_COLORS}
        distortion={0.9}
        swirl={0.3}
        scale={0.6}
        // Full grain over light midtones reads as dust; keep it for dark,
        // where it hides banding in the embers.
        grainOverlay={dark ? 0.18 : 0.1}
        speed={reduced ? 0 : 0.35}
      />
    </div>
  );
}
