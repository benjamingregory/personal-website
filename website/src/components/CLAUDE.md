# CLAUDE.md — Components

Reusable React components. Most pages compose these; never duplicate component logic across pages.

## Layout

```
components/
├── Header.tsx              # Sticky top nav (client) — sole navigation surface; all links visible on mobile
├── Footer.tsx              # Single footer (server) — visible on all viewports
├── JsonLd.tsx              # Structured-data wrappers (server) — plain inline <script> tags
├── ProjectMedia.tsx        # Server — discovers public/projects/<slug>/ media, pairs -light/-dark
├── ProjectCarousel.tsx     # Client — Embla carousel + thumbnails, rendered by ProjectMedia
├── chat/ChatInterface.tsx  # Client — the /chat UI (useChat, mic, TTS queue)
├── webgl/                  # Client — Paper Shaders gradient hero + NEXT_PUBLIC_WEBGL_FX kill switch
├── motion/                 # Motion primitives (client, except HoverCard)
└── ui/                     # shadcn/ui primitives — Carousel (+ Button, only used by Carousel)
```

## Motion primitives

Each respects `prefers-reduced-motion`. All are "use client" except `HoverCard`, which is a server component (CSS-only hover). Import the runtime from `motion/react` (the renamed Framer Motion).

| Component | Purpose | When to use |
|---|---|---|
| `FadeUp` | Fade + 12px upward translate on viewport enter, once | Wrap any major page section |
| `PageTransition` | Fade keyed on pathname for route changes | Already wired in root layout |
| `AnimatedThemeToggle` | Sun/moon swap with rotate+scale | Already wired in `Header` |
| `HoverCard` | Card lift + arrow nudge on hover | Project cards, blog teasers |
| `StackToggle` | Animated expand/collapse for "show full stack" | Projects page |
| `ReadingProgress` | Scroll-linked spring progress bar | Blog post layout (already wired) |
| `BlogIndex` | Tag filter with FLIP layout animation on the post list | Blog index (already wired) |
| `SectionScrollSpy` | On-page TOC w/ animated active marker | Blog posts (already wired via `blog/[...slug]/page.tsx`) |

## Conventions

- **Server first.** Default to server components. Add `"use client"` only if you need state, effects, browser APIs, or motion hooks.
- **Semantic tokens only.** Use `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`. Never raw `gray-*` or `bg-white`.
- **Single hover effect per element.** Don't combine lift + color + scale.
- **Reduced motion.** Wrap motion patterns with `useReducedMotion()` and provide a no-motion fallback.
- **Fonts.** Use `font-sans` (Inter, body), `font-display` (Outfit, headings), `font-mono` (JetBrains Mono, dates/labels).
- **Animated underline.** For text links use `anim-underline` utility (defined in `globals.css`) — preferred over default underline.

## Don't add

- Sparkle icons (`Sparkles`, `WandSparkles`, etc.) — banned. Communicate "AI" via copy or behavior.
- Gradient text on titles or hero.
- Magnetic/cursor-following hover effects, scroll-jacked sections, parallax.
- Multi-icon-per-element compositions.

See `DESIGN_PRINCIPLES.md` at the repo root for the full ruleset.
