# CLAUDE.md

Private metrics dashboard at admin.benjaminrgregory.com. One page, four
sections — Jobflow, Kasava, Monroe, and the personal site — each mixing live
Postgres usage numbers with PostHog web analytics.

## Stack

Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript, `postgres`
(postgres-js) for DB reads. pnpm. No client-side JS beyond what Next ships —
every component is a server component; sparklines are server-rendered SVG.

## Commands

- `pnpm dev` — dev server on http://localhost:3100
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
- [src/lib/metrics/](src/lib/metrics/) — one module per project returning a
  `ProjectReport` (stats, 30-day daily series, last-activity timestamp).
  Failures degrade to an inline error, never a crashed page.
  - Monroe's schema is Prisma-origin: PascalCase tables (`"User"`, `"UserShow"`)
    and camelCase timestamps (`"createdAt"`) must stay double-quoted.
- [src/lib/posthog.ts](src/lib/posthog.ts) — HogQL over PostHog's query API.
  Config per project: `POSTHOG_PROJECT_ID_<PROJECT>` + `POSTHOG_API_KEY`
  (or per-org `POSTHOG_API_KEY_<PROJECT>` override). Unconfigured → the
  section says so instead of erroring.
- [src/lib/projects.ts](src/lib/projects.ts) — the registry. Adding a project =
  a metrics module + one entry here (name, descriptor, accent, env vars).
- [src/app/page.tsx](src/app/page.tsx) — `force-dynamic`; each section streams
  behind its own `<Suspense>` so one slow database never blocks the rest.

## Design

Dark-only "operations desk": editorial serif masthead (Newsreader) over
JetBrains Mono data, warm near-black ground, per-project accent used only for
the section rule, sparkline stroke, and favicon tile. Tokens live in
[src/app/globals.css](src/app/globals.css) `@theme` — reference them
semantically (`bg-ground`, `text-ink-dim`, `border-rule`); never inline new
hexes. Accent hexes are dark-surface-validated dataviz palette steps; text
never wears an accent color. Respect `prefers-reduced-motion` (the section
reveal already does).

## Env vars

See [.env.example](.env.example). All secrets live in Vercel env + `.env.local`.
