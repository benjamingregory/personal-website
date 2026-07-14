# Design Principles

Guidelines for the design of bengregory.com — a personal portfolio and writing site. Adapted from the Kasava and Monroe principles (which are themselves derived from Linear, Vercel, Stripe, etc.) and refocused for an editorial, content-first personal site.

References for this site specifically: leerob.io, paulstamatiou.com, rauno.me, fed.brid.gy, robinrendle.com, brianlovin.com.

---

## Core Philosophy

**Writing first, work second, chrome last.** This is a personal site, not a product. Its job is to make the work and the writing legible and trustworthy. Anything that competes with the content — heavy nav, decorative gradients, badge walls, duplicate CTAs — is a bug.

If you can remove an element and the page still does its job, remove it.

---

## 1. Information Hierarchy

### One thing per page

Every page answers a single question:

| Page | The question |
|------|--------------|
| Home | Who is this person and what should I read next? |
| Work | What has he actually shipped, and where? |
| Projects | What's he building now and how was it built? |
| Blog | What's he been thinking about? |
| Blog post | (the post itself) |
| Education | (compact reference) |

If a page tries to answer two questions, split it or pick one.

### Visual priority

- **Primary**: 1 anchor per view (hero name on home, post title on a post, project name on a project row).
- **Secondary**: 2–3 supporting elements (subtitle, date, lede).
- **Tertiary**: collapsed, summarized, or moved to a sub-page.

### Don't duplicate navigation

If it's in the header nav, it doesn't get a card on the home page. The current "4 nav-mirror cards" anti-pattern (Work / Projects / Blog / Education tiles below the hero) is the canonical example to delete.

---

## 2. Typography is the primary design element

On a content site, type *is* the design. Get this right and most other choices fall out.

### Font roles

| Role | Font | Usage |
|------|------|-------|
| Sans (UI + body) | Inter or Outfit (single weight family) | Nav, captions, labels |
| Display | Same as sans, larger + tighter | Page titles, hero |
| Serif (long-form) | Source Serif 4 or system serif | Blog post body |
| Mono | JetBrains Mono | Code, data |

Pick one sans and one serif. No third decorative face.

### Letter-spacing scale

Negative tracking at display sizes is non-negotiable — without it, headings look like Word docs.

| Size | Tracking | Line-height |
|------|----------|-------------|
| Display (48px+) | `-0.03em` to `-0.04em` | 1.05–1.1 |
| H1 (30–48px) | `-0.02em` | 1.15 |
| H2 (24–30px) | `-0.015em` | 1.2 |
| Body | `-0.011em` (Inter optical correction) | 1.5–1.65 |
| Caption | normal | 1.4 |

### Weight scale

- Body: 400 light mode, 400–500 dark mode (compensate for irradiation).
- Section headings: 600.
- Display headings: 600–700. **Never 800/900** — too heavy for sans display.
- Mono labels: 500.

### Reading width

- Long-form prose: 60–75 characters per line (≈ `max-w-prose`).
- UI lists: 80–100 characters max.
- Never full-width body text on desktop.

### Anti-patterns

```
Bad:  Gradient text on a name (looks like 2021 Tailwind tutorials)
Bad:  text-5xl font-bold with default tracking + leading
Bad:  Two display fonts on one page
Good: Single display face, tight tracking, considered weight scale
```

---

## 3. Whitespace & Rhythm

Personal sites should breathe. This is not a dashboard.

### Vertical rhythm

| Element | Spacing |
|---------|---------|
| Between major page sections | 64–96px (`space-y-16` to `space-y-24`) |
| Between subsections | 32–48px |
| Between paragraphs | 16–24px |
| Within a card or row | 8–16px |

### Page padding

- Mobile: `px-5` minimum.
- Desktop: content max-width `~640–720px` for long-form, `~960px` for index pages, centered.

### No fixed-height pages

Never wrap a page in `h-screen` + `overflow-scroll`. Let the document flow. (This is a current bug; fix it during the redesign.)

---

## 4. Color & Restraint

### One accent

Pick one accent color and use it for links, focus rings, and active states. **Never** use a second saturated color in the chrome. The current blue→purple gradient hero is the textbook example to retire.

When you're tempted to add color, ask: would this work as the accent at a different lightness? If yes, use the accent scale.

### Warm neutrals over cool gray

Off-white / warm-tinted near-black surfaces (hue ~48° in HSL) read as intentional and premium. Pure `slate-*`/`zinc-*` reads as Tailwind-default.

### Status colors used sparingly

Reserved for actual semantic moments (a "now" indicator, an inline alert in a post). Not decoration.

### Anti-patterns

```
Bad:  bg-linear-to-r from-blue-600 to-purple-600 text on the name
Bad:  Each home-page card in a different bright color (blue/purple/green/orange)
Bad:  Raw text-gray-600 dark:text-gray-400 scattered through pages
Good: One accent, semantic tokens (text-foreground, text-muted-foreground)
```

---

## 5. Layout & Navigation

### No sidebar

A 240px persistent sidebar for 4 nav items is wrong for a content site. It eats the viewport and right-aligns text awkwardly. Replace with a thin top header (~56px): name (left), nav (center or right), theme toggle (right).

### Single source of truth for nav

The header is *the* navigation. The home page does not re-list the same destinations as cards. The footer is for contact + repo links + the legal-ish stuff, not duplicate nav.

### Single footer

One footer. Mobile and desktop. Don't hide it on mobile (current bug — `hidden sm:flex` removes contact info from phones entirely).

### Page chrome budget

| Surface | Budget |
|---------|--------|
| Header | ~56px |
| Footer | ~80–120px |
| Page padding | as defined in §3 |

Everything else is content.

---

## 6. Project & Work Pages — Show, Don't List

### Projects: one row per project

Each project deserves: name, year, one-line pitch, **one image** (screenshot or video), one paragraph of substantive prose, and a *short* tech list (5–6 items max). The full stack belongs behind a toggle, not as 25 badges in your face.

```
Good: Kasava (2025) — AI dev workflow platform
      [screenshot]
      One paragraph: what it does, what was hard, why it matters.
      Built with: Cloudflare Workers · Hono · Postgres · React · Anthropic
      [Live site →]   [Show full stack ▸]

Bad:  Project name + 7 stack categories × 5 badges each, no image, no narrative
```

### Work: timeline, not bullet wall

Each role: company logo (where available), role + dates as the visual anchor, one paragraph of what you owned, **2–3 bullets max** for highlights. Older / less-relevant roles collapse into a smaller "earlier" block.

### Education

Compact typographic list. Three rows. No card needed. Don't try to dress it up.

---

## 7. Imagery Earns Its Place

Every image must do work: a screenshot that clarifies what a project looks like, a logo that aids recognition, a single portrait that humanizes the site. **No stock illustrations. No emoji-as-illustration. No abstract gradients.**

### Required

- One photo (or a clean monogram) on the home page. A personal site without a face feels generic.
- One screenshot per project on the Projects page.
- A real OG image at `/og-image.jpg` (currently referenced in metadata but missing).

### Image guidelines

- Always include `alt` text.
- Lazy-load below the fold.
- Use Next.js `<Image>` for automatic optimization.
- Provide a sensible fallback if an image fails to load.

---

## 8. Voice & Copy

Copy is design. Three rules:

1. **Specific over generic.** "Building Kasava — an AI workflow tool for engineering teams" beats "Building AI-powered platforms and innovative web applications."
2. **First person, present tense.** "I'm building…" / "I write about…" — not "Software Engineer specializing in…"
3. **Cut the resume words.** "Revolutionize", "leveraging", "comprehensive" — out. Plain English.

The current home page lede ("Building AI-powered platforms and innovative web applications. Stanford MBA with expertise in full-stack development, product management, and scaling startups.") is a checklist of resume buzzwords. A redesign should rewrite it as one or two real sentences.

---

## 9. Motion — Considered, Not Conservative

Motion makes a content site feel alive without requiring the user to think about it. Aim for the band between leerob.io (almost none) and rauno.me (a motion playground): closer to **Linear marketing pages, Vercel.com, emilkowalski.com's blog, or brittanychiang.com**. Reactive, rewarding, never load-bearing.

### When motion earns its place

| Trigger | Allowed motion | Duration |
|---------|----------------|----------|
| Hover on a link/card | Color shift + arrow nudge OR border emphasis OR underline grow — pick one | 150ms |
| Card click → expand (e.g. project stack toggle) | Smooth height/opacity | 200–300ms |
| Section enters viewport (first paint, once) | Subtle fade + ≤16px upward translate | 300–500ms |
| List of items appearing | Stagger, ≤40ms between items | total ≤500ms |
| Theme toggle | Animated icon swap (sun ↔ moon rotate/scale) | 200ms |
| Page route change | Fade ≤200ms; no slide-ins, no overlays | 200ms |
| Tag filter / sort change | FLIP layout animation on the affected list | 250ms |
| Scroll-linked indicators (e.g. reading progress bar on posts) | Direct mapping, no spring | n/a |

### Hard constraints

- **One hover effect per element.** Don't combine lift + color + scale.
- **No scroll-jacking, no parallax beyond a token amount, no cursor effects.** These cross the rauno line.
- **No bounce / spring overshoot on UI elements.** Springs are fine for *layout* transitions (FLIP, drawers); not for hover feedback.
- **Motion is purely additive.** A user with `prefers-reduced-motion` should get the same site, just with motion replaced by instant state changes. Wrap with `motion-safe:` or `useReducedMotion()`.
- **No motion on text content while reading.** Stagger hero items on first paint, not paragraphs in a blog post.

### Tech

Use the [`motion`](https://motion.dev) package (the successor to `framer-motion`). Prefer the lightweight `motion/react` API for declarative animations and `motion()` (the imperative mini-library) for one-off DOM tweens — the latter is ~5kb if you only need it in one place.

### Anti-patterns

```
Bad:  Magnetic hover on every button (rauno-tier)
Bad:  Text-scramble or character-by-character reveal on the hero name
Bad:  Cursor-following blob / spotlight effects
Bad:  Scroll-jacked horizontal sections
Bad:  Page-load animation that delays content > 400ms
Good: One subtle fade-up on each section as it enters view, once
Good: Cards lift + arrow slides on hover
Good: FLIP animation when filtering blog posts by tag
Good: Animated theme toggle icon
```

---

## 10. Dark Mode

### Use semantic tokens

`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`. Never raw `bg-white`, `text-gray-600`, `border-gray-200` in layout chrome (current bug in `Footer.tsx` and the home hero).

### Test every component in both modes

In particular:
- Borders should not disappear into the background.
- Body text on dark uses weight 400–500 (irradiation compensation).
- The single accent shifts to a comfortable variant on dark (lower saturation, slightly warmer).

### Anti-patterns

```
Bad:  className="bg-white"                              → No dark variant
Bad:  className="text-gray-600 dark:text-gray-400"      → Bypasses tokens
Good: className="bg-background text-muted-foreground"
```

---

## 11. Empty / Edge States

A personal site has fewer empty states than an app, but they still matter:

- **404**: actually designed, with a link back to home + recent posts. Don't ship the Next.js default.
- **Blog with zero posts in a tag**: "No posts in this tag yet — see all posts."
- **Search (if added)**: helpful "no results" with suggested posts.

Keep them brief, specific, and actionable. No big illustrations. No "Oops!"

---

## 12. Mobile

### Reflow, don't rearrange

- Single column at all sizes.
- Header collapses to a simple inline link row (4 items fits — no hamburger needed).
- Footer is visible on mobile (current bug: it isn't).
- Touch targets ≥44×44px.

### Test viewports

- 375×667 (iPhone SE) — minimum.
- 390×844 (iPhone 13/14) — primary.
- 768×1024 (iPad) — verify no awkward middle-state layout.

---

## 13. Pre-ship Checklist

Before merging any UI change:

- [ ] Removed every element that doesn't earn its place?
- [ ] Single primary anchor per page is obvious within 2 seconds?
- [ ] No duplicate navigation?
- [ ] One accent color, one display font, no gradients?
- [ ] Display headings have negative tracking + tight leading?
- [ ] Body uses semantic color tokens (no raw `gray-*` or `bg-white`)?
- [ ] Works in dark mode (visually verified, not just inferred)?
- [ ] Works at 375px wide?
- [ ] All images have `alt`, lazy-load below the fold?
- [ ] No `h-screen` + `overflow-scroll` page wrappers?
- [ ] Honors `prefers-reduced-motion`?
- [ ] OG image present and accurate?

---

## Anti-Patterns to Avoid

| Anti-Pattern | Better Approach |
|--------------|-----------------|
| 240px sidebar nav for 4 items | Thin top header (Principle 5) |
| Home page mirrors header nav as cards | Header is the only nav (Principle 5) |
| Gradient text on the hero name | Single accent or plain `text-foreground` (Principle 4) |
| Each home tile a different bright color | One accent across the site (Principle 4) |
| Raw `text-gray-*` / `bg-white` everywhere | Semantic tokens (Principle 10) |
| 25+ tech badges per project, no image | One screenshot + 5 chips + collapse (Principle 6) |
| Bullet-list wall on /work | Timeline + 2–3 bullet highlights per role (Principle 6) |
| Two competing footers | One footer, all viewports (Principle 5) |
| Footer hidden on mobile | Visible on mobile, contact intact (Principle 12) |
| `h-screen` + `overflow-scroll` per page | Native document flow (Principle 3) |
| "Building AI-powered innovative platforms…" | Specific, first-person, plain (Principle 8) |
| No personal photo or face | One portrait or considered monogram (Principle 7) |
| Default Next.js 404 | Designed 404 with home + recent posts (Principle 11) |
| `text-5xl font-bold` with no tracking | Display tracking + leading (Principle 2) |
| Two display fonts | One display face (Principle 2) |
| Magnetic hover, cursor blobs, scroll-jacking | Reactive but restrained motion (Principle 9) |
| Bouncy springs on hover feedback | Springs only for layout transitions; ease-out for hover (Principle 9) |
| Sparkle icon to mean "AI" | Use plain language ("AI dev tool") |

---

## What this site is *not* trying to be

- A SaaS dashboard (Kasava's principles around chat panels, sidebars, density tradeoffs do not apply here).
- A media-browsing app (Monroe's card grids, horizontal scroll, watch-status pills do not apply here).
- A design-experiment showcase (no scroll-jacking, no canvas demos, no parallax).

It's a quiet, well-typeset record of work and writing. That's the bar.
