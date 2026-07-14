/**
 * WebGL effects feature flag. Off by setting `NEXT_PUBLIC_WEBGL_FX=off`,
 * which lets you A/B the GPU layers against the plain static site.
 * Reads at module scope so it tree-shakes/branches at build time.
 */
export const WEBGL_FX_ENABLED = process.env.NEXT_PUBLIC_WEBGL_FX !== "off";
