# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## Project

Personal site — bengregory.com. Editorial portfolio + blog. Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, TypeScript. Static-content driven; no CMS, no database. MDX blog content lives in `src/content/blog/` and is read at request time via a small utility.

Design intent is documented in [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md). Read it before making visual changes.

Copy voice and banned phrasing live in [LANGUAGE_PATTERNS.md](./LANGUAGE_PATTERNS.md). Read it before writing or editing any user-facing text — hero copy, headlines, blog posts, MDX bodies, metadata, CTAs, persona context. Run the `grep` checks in that file before declaring text work done.

## Commands

The package manager is **pnpm** (there is no `package-lock.json`; CI uses `pnpm install --frozen-lockfile`).

- `pnpm dev` — start Turbopack dev server on http://localhost:3000
- `pnpm build` — production build (runs `scripts/check-external-posts.mjs` first via `prebuild`)
- `pnpm start` — start the built server
- `pnpm lint` — ESLint (flat config in `eslint.config.mjs`)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — Playwright E2E tests (`pnpm test:headed`, `:debug`, `:ui`, `:report` variants)

## Architecture

### Routes

```
src/app/
├── layout.tsx              # Root layout: <Header>, <PageTransition>{children}, <Footer>, JSON-LD
├── page.tsx                # Home (server) — hero (WebGL gradient), "now", selected work, recent writing
├── not-found.tsx           # Designed 404 — home link + three recent posts
├── globals.css             # Tailwind v4 @theme + warm neutral tokens
├── opengraph-image.tsx     # Generated 1200x630 OG/Twitter card (ImageResponse)
├── icon.tsx / apple-icon.tsx  # Generated favicon + Apple touch icon
├── robots.ts
├── sitemap.ts              # Pulls posts from src/lib/posts.ts
├── feed.xml/route.ts       # RSS 2.0 feed — internal + external posts
├── work/page.tsx           # Server — timeline of roles
├── projects/
│   ├── page.tsx            # Server — full project rows + carousel + animated stack toggle
│   └── data.tsx            # Project registry (copy, stacks, ProjectMedia configs)
├── education/page.tsx      # Server — typographic list
├── chat/page.tsx           # Server shell that renders the AI-clone chat (see "Chat" below)
├── api/
│   ├── chat/route.ts       # Mastra agent → AI SDK streaming response
│   └── tts/route.ts        # ElevenLabs streaming TTS proxy
└── blog/
    ├── page.tsx            # Server — merges local posts + external Kasava posts, hands to <BlogIndex>
    └── [...slug]/
        ├── page.tsx        # Server — renders MDX via next-mdx-remote/rsc + <SectionScrollSpy> TOC
        └── layout.tsx      # Wraps post in <ReadingProgress />
```

### Content

- All MDX posts live in `src/content/blog/`. Flat posts: `src/content/blog/<slug>.mdx`. Series: `src/content/blog/<series>/<part>.mdx`.
- Frontmatter: `title`, `date`, `description`, `tags?`, `series?`, `published?`. Parsed by `gray-matter`. Tags are normalized to lowercase in `posts.ts`.
- `src/lib/posts.ts` walks the content dir and returns typed `Post[]`. It caches in-process; no rebuild step.
- `src/lib/external-posts.ts` is a hand-maintained registry of posts Ben wrote on kasava.dev. They're merged into `/blog`, the home recent-writing list, and the chat persona (each entry carries an `abstract` for the agent). `scripts/check-external-posts.mjs` (run on every `pnpm build` via `prebuild`) checks parity against a sibling Kasava checkout — it skips cleanly when the checkout is absent (e.g. CI); point it elsewhere with `KASAVA_BLOG_DIR`.
- MDX is rendered server-side via `next-mdx-remote/rsc`. Custom components in `src/mdx-components.tsx`: `<img>` → Next `<Image>`, and `<h2>` → anchor IDs (via `src/lib/toc.ts` slugify) that `SectionScrollSpy` links to.

### Components

```
src/components/
├── Header.tsx              # "use client" — sticky top nav with motion active-underline; all links visible on mobile
├── Footer.tsx              # Server — single footer, all viewports
├── JsonLd.tsx              # Structured data — server-rendered inline <script> tags
├── ProjectMedia.tsx        # Server — auto-discovers public/projects/<slug>/*.webp, pairs -light/-dark variants
├── ProjectCarousel.tsx     # "use client" — Embla carousel + thumbnail strip for multi-image projects
├── ui/                     # shadcn/ui — Carousel (+ Button, used only by Carousel)
├── webgl/
│   ├── gradient-hero.tsx   # "use client" — Paper Shaders mesh-gradient hero layer, fades in over the fallback
│   ├── gradient-hero-lazy.tsx # SSR shell — static CSS wash fallback + dynamic({ssr:false}) shader import
│   ├── palette.ts          # Wash colors + mask, shared by shader and fallback
│   └── flags.ts            # WEBGL_FX_ENABLED — kill switch via NEXT_PUBLIC_WEBGL_FX=off
└── motion/                 # Motion primitives (client except HoverCard, reduced-motion aware)
    ├── FadeUp.tsx          # Section fade-up on viewport enter
    ├── PageTransition.tsx  # Route fade keyed on pathname
    ├── AnimatedThemeToggle.tsx
    ├── HoverCard.tsx       # Server — card lift + arrow nudge via CSS hover
    ├── StackToggle.tsx     # Project full-stack expand/collapse
    ├── ReadingProgress.tsx # Scroll-linked progress bar
    ├── BlogIndex.tsx       # Tag filter with FLIP layout animation
    └── SectionScrollSpy.tsx # On-page TOC with active-section indicator (wired into every blog post)
```

Motion primitives respect `prefers-reduced-motion` via `useReducedMotion()` from `motion/react`. The motion package is the renamed Framer Motion — import from `motion/react`.

Library code in `src/lib/`: `posts.ts` (MDX post loader), `external-posts.ts` (Kasava post registry), `toc.ts` (slugify + heading extraction for the scroll-spy TOC), `utils.ts` (`cn` classname helper).

### Styling

- Tailwind v4 with CSS-defined theme (`@theme inline` in `globals.css`).
- Dark mode is class-based (`html.dark`). The `setInitialTheme` script in `layout.tsx` runs before paint to avoid flash.
- Color tokens are warm neutrals (HSL hue ~48° / 24°). Use semantic tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`) — never raw `gray-*` or `bg-white`.
- Fonts: Instrument Sans (sans/body), Outfit (display), JetBrains Mono (mono). Loaded via `next/font/google` and exposed as `--font-sans`, `--font-display`, `--font-mono`.
- Custom utility: `.anim-underline` (left-to-right underline reveal on hover/focus) defined in `globals.css`.

## Adding a blog post

1. Create `src/content/blog/<slug>.mdx` (or `src/content/blog/<series>/<part>.mdx`).
2. Add frontmatter:
   ```mdx
   ---
   title: "Post Title"
   date: 2026-05-01
   description: "One-line description."
   tags: ["product", "ai"]
   series: "Optional Series Name"
   published: true
   ---
   ```
3. Write the body. Markdown + JSX both work; use `<Image>` for images via the override in `mdx-components.tsx`.

That's it. The post auto-appears in `/blog`, the home recent-writing list, the sitemap, and `generateStaticParams`. No registry to update, no per-post layout to write.

## Chat (AI clone)

The `/chat` page hosts a voice-enabled AI clone of Ben. Architecture:

```
src/mastra/
├── index.ts                 # Mastra instance + Ben agent (lazy singleton)
├── persona.ts               # Builds the system prompt from context/*.md + blog index
├── tools/
│   └── fetch-external-post.ts # Agent tool — fetches full text of a kasava.dev post (allowlisted URLs only)
└── context/
    ├── boundaries.md        # Hard rules — overrides everything else
    ├── bio.md               # Career, education, where I'm from
    ├── voice.md             # How I talk (register, phrases, anti-tells)
    ├── topics.md            # What to engage / what to deflect
    └── opinions.md          # Specific points of view to represent

src/app/api/
├── chat/route.ts            # POST → handleChatStream({mastra, agentId:'ben'}) → createUIMessageStreamResponse
└── tts/route.ts             # POST {text} → ElevenLabs streaming mp3

src/components/chat/
└── ChatInterface.tsx        # "use client" — useChat from @ai-sdk/react, mic via Web Speech API, per-sentence TTS playback
```

- LLM: Mastra agent on `anthropic/claude-sonnet-4-6` (model router string — `@mastra/core` reads `ANTHROPIC_API_KEY` automatically).
- Guardrails: `PromptInjectionDetector` + `ModerationProcessor` from `@mastra/core/processors` run as `inputProcessors` on each request, both backed by Claude Haiku 4.5 (one extra Anthropic call each — minor latency + cost trade for safety on a public surface).
- Tools: the agent has one tool, `fetchExternalPost`, which pulls the full text of a Kasava blog post on demand (exact allowlist from `external-posts.ts`; the persona embeds only abstracts).
- Streaming: `@mastra/ai-sdk`'s `handleChatStream` + `ai` v7's `createUIMessageStreamResponse`. Client uses `useChat` (`@ai-sdk/react` v4) with `DefaultChatTransport`.
- Voice in: browser-native `SpeechRecognition` (Chrome/Safari/Edge). Falls back to text input where unsupported.
- Voice out: as text streams, sentences are extracted and POSTed to `/api/tts` which proxies ElevenLabs streaming TTS. Audio elements are queued and played sequentially. Mute toggle in the chat header drains the queue.
- Persona system prompt is built once per process and cached.
- The `boundaries.md` file is loaded first so its rules anchor the prompt.

### Env vars (set in Vercel + `.env.local`)

```
ANTHROPIC_API_KEY=        # required — chat agent + guardrails
ELEVENLABS_API_KEY=       # required for voice out
ELEVENLABS_VOICE_ID=      # required for voice out
NEXT_PUBLIC_WEBGL_FX=on   # optional — set to "off" to disable the WebGL hero
NEXT_PUBLIC_POSTHOG_KEY=  # optional — PostHog client token; analytics are a no-op when unset (src/instrumentation-client.ts)
KASAVA_BLOG_DIR=          # optional, local only — overrides the sibling Kasava checkout path for the prebuild parity check
```

See `.env.example` for the canonical list.

### Editing the persona

Edit the `.md` files in `src/mastra/context/`. The cached system prompt rebuilds on next process start; in dev that's the next request after a server restart.

## Conventions

- Default to server components. The only client components are `Header`, `AnimatedThemeToggle`, `ProjectCarousel`, `ChatInterface`, the WebGL hero, and the motion primitives (except `HoverCard`, which is server). Keep client-side surface small.
- Project screenshots go in `public/projects/<slug>/` as ~1600px-wide WebP, named `<n>-light.webp` / `<n>-dark.webp` pairs (`hero-*` sorts first). `ProjectMedia` discovers them from the filesystem — no registry to update.
- `@/*` path alias is the only one in `tsconfig.json`.
- Don't add gradients, raw color hex, or shadcn defaults masquerading as design — the design language is editorial. The one sanctioned exception is the hero wash (`webgl/gradient-hero.tsx`), governed by DESIGN_PRINCIPLES §4. See `DESIGN_PRINCIPLES.md`.
- For new motion: respect §9 of the principles — band between Linear marketing and rauno.me, never crossing into magnetic/cursor/scroll-jack territory.
- For any user-facing copy, follow `LANGUAGE_PATTERNS.md` — banned words, banned filler openers ("Here's the thing", "Let's be honest", etc.), and the required moves (name the artifact, mechanism follows claim, sparingly em-dash).

## Testing

- Playwright tests live in `tests/`. Test setup loads `localhost:3000` via the dev server.
- Each new page should get a basic smoke test (renders, has expected heading, mobile layout doesn't horizontally scroll).

## Deploy

- Hosted on Vercel.
- `metadataBase` is `https://www.benjaminrgregory.com`.
- OG image, favicon, and Apple icon are generated at build time by `src/app/opengraph-image.tsx`, `icon.tsx`, and `apple-icon.tsx` — no static image files to maintain.
