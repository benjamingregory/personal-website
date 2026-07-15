"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { MeshGradient } from "@paper-design/shaders-react";
import { DARK_COLORS, LIGHT_COLORS } from "./palette";

/**
 * Warm mesh gradient behind the hero — the site's one sanctioned ambient
 * layer (DESIGN_PRINCIPLES §4). Paper Shaders' built-in grain overlay keeps
 * gradient + film-grain texture in one component. Colors track the
 * light/dark theme; the positioned wrapper, mask, and opacity live in
 * gradient-hero-lazy.tsx (the SSR shell) so a static fallback can paint
 * before this chunk arrives — this layer only fades itself in over it.
 * Reduced-motion freezes it (speed 0).
 */

function useIsDark() {
  // Client-only component (dynamic ssr:false), so the initializer can read
  // the DOM directly — the first shader frame gets the right palette.
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export default function GradientHero() {
  const reduced = useReducedMotion();
  const dark = useIsDark();
  // Fade in from the static fallback one frame after mount. The chunk fetch
  // is the long pole; the canvas's first frames land inside the transition
  // window, and a not-yet-drawn canvas is transparent, so the fallback keeps
  // showing through until real pixels arrive.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <MeshGradient
      className="absolute inset-0 transition-opacity duration-700 ease-out"
      style={{ opacity: ready ? 1 : 0 }}
      colors={dark ? DARK_COLORS : LIGHT_COLORS}
      distortion={0.9}
      swirl={0.3}
      scale={0.6}
      // Full grain over light midtones reads as dust; keep it for dark,
      // where it hides banding in the embers.
      grainOverlay={dark ? 0.18 : 0.1}
      speed={reduced ? 0 : 0.35}
    />
  );
}
