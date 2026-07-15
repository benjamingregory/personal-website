/**
 * Hero-wash palette, shared by the WebGL shader (gradient-hero.tsx) and the
 * static CSS fallback painted by the SSR shell (gradient-hero-lazy.tsx).
 * Lives in its own module so the shell can import the colors without
 * dragging the Paper Shaders chunk into the initial bundle.
 */

// Beige / tan, wide range — tan and camel highlights down to saddle-brown
// shadows. The wide lightness spread is what keeps low-chroma tan reading
// as suede rather than khaki mud: depth, not a flat midtone band. The
// darkest brown at the 0.35 light-mode intensity blends to ~#BAAFA2 —
// ~5.1:1 against the muted ink, so a notch of shadow headroom remains.
export const LIGHT_COLORS = ["#cdb691", "#e8d5b5", "#4a3020", "#6f4e33"];

// Low-luminance embers — warm depth over near-black, never white.
export const DARK_COLORS = ["#241d14", "#33271a", "#1b1610", "#3e2f1c"];

// Fade completes at 92% of the canvas, safely inside the bottom edge.
export const MASK = "linear-gradient(to bottom, black 55%, transparent 92%)";
