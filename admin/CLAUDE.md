# CLAUDE.md

Private health dashboard at admin.benjaminrgregory.com — a single pane of
glass over four projects (Jobflow, Kasava, Monroe, the personal site). The
overview's status strip answers "is anything broken?", its 2×2 card grid
answers "is anything moving?", and depth lives on per-project `/[project]`
drill-down pages (90d activity, traffic facets, exceptions, LLM spend/day,
deploy history, product breakdowns).

## Stack

Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript, `postgres`
(postgres-js) for DB reads. pnpm. Server components throughout; exactly two
client shims, both stateless: [AutoRefresh](src/components/auto-refresh.tsx)
(layout-mounted `router.refresh()` every 60s, skipped while hidden) and
[NavClient](src/components/nav-client.tsx) (`usePathname` active-link state +
single-key shortcuts). Add a third only with a comparable justification.

## Navigation

- **DeskNav** ([desk-nav.tsx](src/components/desk-nav.tsx)) — persistent
  micro-label row in the layout: `overview · ¹jobflow · ²kasava · ³monroe ·
  ⁴site`. Digits are the keyboard shortcuts (`o` = overview), rendered as
  faint hints and hidden below `sm`. Active link is brighter ink — no tabs,
  no pills, no accent colors in nav. Per-project **deviation-only dots**
  (only warn/err render, each behind its own Suspense in a fixed-width slot)
  give ambient awareness of the other projects from any page; they share the
  `cache()`d `loadSnapshot` with everything else.
- **`prefetch={false}` on every internal link** — routes are force-dynamic;
  prefetching would fire real DB/PostHog/Vercel calls on hover for data that
  must be live-at-view anyway. Keep this on any new link.
- **Cross-links**: strip alert rows deep-link symptom → evidence via
  `/{project}#{check.section}` (`section` lives on `Check`, assigned in
  health.ts); card names and the `diagnostics →` footer link to the page;
  detail pages end in a prev/next pager
  ([prev-next.tsx](src/components/prev-next.tsx)).

## Commands

- `pnpm dev` — dev server on `http://localhost:3100`
- `pnpm build` / `pnpm start`
- `pnpm lint` / `pnpm typecheck`

## Architecture

- [src/proxy.ts](src/proxy.ts) — HTTP Basic Auth over everything. Fails closed
  when `ADMIN_PASSWORD` is unset. Credentials checked via constant-time digest
  comparison.
- [src/lib/db.ts](src/lib/db.ts) — one lazy postgres-js pool per `*_DATABASE_URL`
  env var, cached on `globalThis` (HMR-safe). `prepare: false` for Supabase's
  transaction pooler. **Read-only by convention: metrics modules must only
  SELECT.**
- [src/lib/snapshot.ts](src/lib/snapshot.ts) — `loadSnapshot(key)`, the one
  loader everything renders from: project report + PostHog analytics + Vercel
  deploy state + computed health checks. Wrapped in React `cache()` so the
  status strip (which awaits all four) and each card (which awaits its own)
  share one fetch per project per request. Also stamps `report.latencyMs`
  (DB round-trip wall clock) for the slow-db check and card header meta.
- [src/lib/health.ts](src/lib/health.ts) — the check rules. Emits only
  deviations (`warn`/`err`); a healthy project has an empty `checks` array.
  Current rules: db unreachable / not wired, db slow (>4s), activity pulse
  stale (per-project `pulse.staleAfterHours` in projects.ts), posthog
  unreachable, `$exception` count past 24h (≥50 → err), deploy ERROR/CANCELED,
  and the weekly LLM spend guardrail (≥$5 and ≥2× the prior week). Thresholds
  are named constants at the top of the file.
- [src/lib/metrics/](src/lib/metrics/) — one module per project returning a
  `ProjectReport`: three card-face stats, `more` detail-only counts, raw
  `llm` usage windows, 30-day daily series, last-activity timestamp.
  Failures degrade to a card-level check, never a crashed page.
  - Monroe's schema is Prisma-origin: PascalCase tables (`"User"`, `"UserShow"`)
    and camelCase timestamps (`"createdAt"`) must stay double-quoted.
  - [llm-usage.ts](src/lib/metrics/llm-usage.ts) — per-model token counts +
    estimated spend in four windows (30d / all-time / trailing 7d / prior 7d;
    the weekly pair feeds the spend guardrail). All three DB projects read
    Mastra observability spans (`mastra_ai_spans`, `model_generation`/
    `model_inference`; `inputTokens` already includes cache read/write);
    Monroe additionally reads `"LlmUsage"`, written by its Workers API's
    instrumented Anthropic/OpenAI clients. Cost comes from the per-MTok
    pricing map in that file — update it when models rotate. A missing table
    (42P01) counts as zero usage. The card face shows one spend tile; the
    per-model table and calls/tokens tiles live in the diagnostics
    disclosure.
- [src/lib/posthog.ts](src/lib/posthog.ts) — HogQL over PostHog's query API.
  Config per project: `POSTHOG_PROJECT_ID_<PROJECT>` + `POSTHOG_API_KEY`
  (or per-org `POSTHOG_API_KEY_<PROJECT>` override). Unconfigured → a warn
  check instead of an error. Returns visitor/pageview totals, a 30-day daily
  trend (zero-filled), `$exception` counts (24h + 7d), and three ranked
  breakdowns — top pages, referring sources, product events (any event not
  prefixed `$`).
  - **Everything is scoped to production hosts.** Local dev is the operator's
    own machine, not a user; counting it makes a dead product look alive. Other
    projects get `NOT LIKE 'localhost%'`; Jobflow and the personal site get an
    exact-host allowlist (`PROJECT_HOSTS`), which excludes localhost for free.
  - That allowlist is load-bearing, not stylistic: Jobflow and the personal site
    **share one PostHog project**, and Jobflow is served from
    `jobflow.benjaminrgregory.com` — a *subdomain of the personal site's own
    apex*. Any `$host LIKE '%benjaminrgregory.com'` test therefore matches both
    products (and this admin), silently filing Jobflow's traffic under the
    personal site. Split them by exact host, never by suffix.
- [src/lib/vercel.ts](src/lib/vercel.ts) — latest production deployment per
  project (`VERCEL_TOKEN` + `VERCEL_TEAM_ID` + `VERCEL_PROJECT_ID_<PROJECT>`).
  Unconfigured → silently skipped.
- [src/lib/projects.ts](src/lib/projects.ts) — the registry. Adding a project =
  a metrics module + one entry here (name, `shortName` for nav, descriptor,
  accent, env-var suffix, `db` flag, optional `pulse` cadence, optional
  `detail` loaders for the drill-down page).
- [src/lib/detail.ts](src/lib/detail.ts) — `cache()`-wrapped per-section
  loaders for `/[project]`: `loadSeries90` / `loadProduct` / `loadLlmDaily`
  (per-project SQL lives in the metrics modules, wired via `ProjectDef.detail`),
  `loadTrafficDetail` (`webAnalyticsDetail` in posthog.ts: 15-row breakdowns +
  countries/devices/browsers + exception groups + daily exception series),
  `loadDeployHistory` (`recentDeploys` in vercel.ts: last 8 with state, age,
  build seconds, commit message).
- [src/app/page.tsx](src/app/page.tsx) — `force-dynamic`. The
  [StatusStrip](src/components/status-strip.tsx) streams behind its own
  `<Suspense>` (it resolves when the slowest project does); each
  [ProjectCard](src/components/project-card.tsx) streams behind its own, so
  one slow database never blocks the rest.
- [src/app/\[project\]/page.tsx](src/app/[project]/page.tsx) — the drill-down.
  Fixed section order (activity → traffic → errors → llm → deploys →
  product; missing sources skip without reordering). Each
  [Section](src/components/section.tsx) shell renders **synchronously** with
  its anchor id while the body streams behind Suspense — that's what makes
  `/{project}#deploys` deep links scroll reliably; don't move the ids inside
  the async bodies. Shared tiles/lists/tables live in
  [metric-bits.tsx](src/components/metric-bits.tsx).
- **Pool sizing** ([src/lib/db.ts](src/lib/db.ts)): a drill-down page bursts
  ~12 concurrent queries on one project's pool (snapshot + series90 +
  product + llm daily). `max` must stay ≥ the largest burst or Supabase's
  pooler wedges queries forever (currently 16). Recount when adding section
  loaders.

## Design

Dark-only "quiet terminal": JetBrains Mono data on a warm near-black ground;
the only serif left is the small Newsreader wordmark in the top bar. No grain
overlay, no entrance animation — the page is an instrument, not a
presentation. Exception-first color: healthy state is quiet ink with a small
ok dot; `--color-warn` / `--color-err` appear only on open checks. Per-project
accent is confined to the card's 2px top rule, the sparkline/trend strokes,
and the favicon tile — text never wears an accent color. Tokens live in
[src/app/globals.css](src/app/globals.css) `@theme` — reference them
semantically (`bg-ground`, `text-ink-dim`, `border-rule`); never inline new
hexes. Card-face numbers are `text-2xl` and lead with 7d movement hints;
lifetime totals are demoted to hints and the diagnostics disclosure.

## Env vars

See [.env.example](.env.example). All secrets live in Vercel env + `.env.local`.
New sources (Vercel deploy checks) degrade silently when their vars are unset.
