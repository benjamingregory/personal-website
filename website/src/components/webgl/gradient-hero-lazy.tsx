"use client";

import dynamic from "next/dynamic";
import { WEBGL_FX_ENABLED } from "./flags";

const GradientHero = dynamic(() => import("./gradient-hero"), { ssr: false });

export default function GradientHeroLazy(props: { intensity?: number }) {
  if (!WEBGL_FX_ENABLED) return null;
  return <GradientHero {...props} />;
}
