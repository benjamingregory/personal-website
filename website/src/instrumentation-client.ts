import posthog from "posthog-js";

// No key (local dev, or analytics not yet provisioned) → posthog stays
// uninitialized and every posthog.* call is a no-op.
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // Pins the behavior bundle (autocapture, history-change pageviews,
    // pageleave, web vitals). App Router navigations are captured off
    // history changes, so no manual pageview component is needed.
    defaults: "2026-05-30",
  });
}
