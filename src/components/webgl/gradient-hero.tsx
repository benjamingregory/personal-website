"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { MeshGradient } from "@paper-design/shaders-react";

/**
 * Whisper-quiet warm mesh gradient behind the hero, with Paper Shaders' built-in
 * grain overlay so the gradient + film-grain texture come from one component.
 * Masked to a soft radial pool and held at low opacity so it melts into the page.
 * Colors track the light/dark theme. Reduced-motion freezes it (speed 0).
 */

// Faint warm spots that read as light through paper over the off-white surface.
const LIGHT_COLORS = ["#f6ecd6", "#ecd4ab", "#f1ddc0", "#dcbb8c"];
// Low-luminance embers — warm depth over near-black, never white.
const DARK_COLORS = ["#241d14", "#33271a", "#1b1610", "#3e2f1c"];

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

export default function GradientHero({
  intensity = 0.7,
}: {
  intensity?: number;
}) {
  const reduced = useReducedMotion();
  const dark = useIsDark();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 -top-14 -z-10 h-[240%] w-screen -translate-x-1/2"
      style={{
        opacity: intensity,
        // Broad top-anchored fade across the full viewport width — no center pooling.
        maskImage:
          "radial-gradient(150% 150% at 50% -15%, black 50%, transparent 96%)",
        WebkitMaskImage:
          "radial-gradient(150% 150% at 50% -15%, black 50%, transparent 96%)",
      }}
    >
      <MeshGradient
        className="h-full w-full"
        colors={dark ? DARK_COLORS : LIGHT_COLORS}
        distortion={0.9}
        swirl={0.3}
        scale={0.6}
        grainOverlay={0.18}
        speed={reduced ? 0 : 0.25}
      />
    </div>
  );
}
