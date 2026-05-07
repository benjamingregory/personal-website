# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## Project

Personal site — bengregory.com. Editorial portfolio + blog. Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, TypeScript. Static-content driven; no CMS, no database. MDX blog content lives in `src/content/blog/` and is read at request time via a small utility.

Design intent is documented in [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md). Read it before making visual changes.

Copy voice and banned phrasing live in [LANGUAGE_PATTERNS.md](./LANGUAGE_PATTERNS.md). Read it before writing or editing any user-facing text — hero copy, headlines, blog posts, MDX bodies, metadata, CTAs, persona context. Run the `grep` checks in that file before declaring text work done.

## Commands

- `npm run dev` — start Turbopack dev server on http://localhost:3000
- `npm run build` — production build
- `npm run start` — start the built server
- `npm run lint` — ESLint
- `npm test` — Playwright E2E tests (`npm run test:headed`, `:debug`, `:ui`, `:report` variants)

## Architecture

### Routes

```
src/app/
├── layout.tsx              # Root layout: <Header>, <PageTransition>{children}, <Footer>
├── page.tsx                # Home (server) — hero, "now", selected work, recent writing
├── globals.css             # Tailwind v4 @theme + warm neutral tokens
├── robots.ts
├── sitemap.ts              # Pulls posts from src/lib/posts.ts
├── work/page.tsx           # Server — timeline of roles
├── projects/page.tsx       # Server — full project rows + animated stack toggle
├── education/page.tsx      # Server — typographic list
├── chat/page.tsx           # Server shell that renders the AI-clone chat (see "Chat" below)
├── api/
│   ├── chat/route.ts       # Mastra agent → AI SDK v5 streaming response
│   └── tts/route.ts        # ElevenLabs streaming TTS proxy
└── blog/
    ├── page.tsx            # Server — pulls posts, hands to <BlogIndex>
    └── [...slug]/
        ├── page.tsx        # Server — renders MDX via next-mdx-remote/rsc
        └── layout.tsx      # Wraps post in <ReadingProgress />
```

### Content

- All MDX posts live in `src/content/blog/`. Flat posts: `src/content/blog/<slug>.mdx`. Series: `src/content/blog/<series>/<part>.mdx`.
- Frontmatter: `title`, `date`, `description`, `tags?`, `series?`, `published?`. Parsed by `gray-matter`.
- `src/lib/posts.ts` walks the content dir and returns typed `Post[]`. It caches in-process; no rebuild step.
- MDX is rendered server-side via `next-mdx-remote/rsc`. Custom components in `src/mdx-components.tsx` (currently overrides `<img>` only).

### Components

```
src/components/
├── Header.tsx              # "use client" — sticky top nav with motion active-underline
├── Footer.tsx              # Server — single footer, all viewports
├── JsonLd.tsx              # Structured data
├── ui/                     # shadcn/ui — Button, Card, Badge (rarely used now)
└── motion/                 # Motion primitives (all "use client", reduced-motion aware)
    ├── FadeUp.tsx          # Section fade-up on viewport enter
    ├── PageTransition.tsx  # Route fade keyed on pathname
    ├── AnimatedThemeToggle.tsx
    ├── HoverCard.tsx       # Card lift + arrow nudge on hover
    ├── StackToggle.tsx     # Project full-stack expand/collapse
    ├── ReadingProgress.tsx # Scroll-linked progress bar
    ├── BlogIndex.tsx       # Tag filter with FLIP layout animation
    └── SectionScrollSpy.tsx # On-page TOC with active-section indicator (built; not currently wired)
```

All motion primitives respect `prefers-reduced-motion` via `useReducedMotion()` from `motion/react`. The motion package is the renamed Framer Motion — import from `motion/react`.

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
- Streaming: `@mastra/ai-sdk`'s `handleChatStream` + `ai` v6's `createUIMessageStreamResponse`. Client uses `useChat` with `DefaultChatTransport`.
- Voice in: browser-native `SpeechRecognition` (Chrome/Safari/Edge). Falls back to text input where unsupported.
- Voice out: as text streams, sentences are extracted and POSTed to `/api/tts` which proxies ElevenLabs streaming TTS. Audio elements are queued and played sequentially. Mute toggle in the chat header drains the queue.
- Persona system prompt is built once per process and cached.
- The `boundaries.md` file is loaded first so its rules anchor the prompt.

### Required env vars (set in Vercel + `.env.local`)

```
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
```

See `.env.example` for the canonical list.

### Editing the persona

Edit the `.md` files in `src/mastra/context/`. The cached system prompt rebuilds on next process start; in dev that's the next request after a server restart.

## Conventions

- All page files except `Header`, `AnimatedThemeToggle`, and motion primitives are server components. Keep client-side surface small.
- `@/*` path alias is the only one in `tsconfig.json`.
- Don't add gradients, raw color hex, or shadcn defaults masquerading as design — the design language is editorial. See `DESIGN_PRINCIPLES.md`.
- For new motion: respect §9 of the principles — band between Linear marketing and rauno.me, never crossing into magnetic/cursor/scroll-jack territory.
- For any user-facing copy, follow `LANGUAGE_PATTERNS.md` — banned words, banned filler openers ("Here's the thing", "Let's be honest", etc.), and the required moves (name the artifact, mechanism follows claim, sparingly em-dash).

## Testing

- Playwright tests live in `tests/`. Test setup loads `localhost:3000` via the dev server.
- Each new page should get a basic smoke test (renders, has expected heading, mobile layout doesn't horizontally scroll).

## Deploy

- Hosted on Vercel.
- `metadataBase` is `https://bengregory.com`.
- TODO: add `/og-image.jpg` to `public/` (currently referenced by metadata but missing).
