# CLAUDE.md

This repo holds two independent Next.js apps, each with its own pnpm workspace and lockfile:

- **[website/](website/)** — bengregory.com personal site (benjaminrgregory.com). Portfolio + blog + AI-clone chat. All guidance in [website/CLAUDE.md](website/CLAUDE.md); read it before working there.
- **[admin/](admin/)** — admin.benjaminrgregory.com. Private metrics dashboard pulling basic usage from the jobflow / kasava / monroe Postgres databases and PostHog analytics. Guidance in [admin/CLAUDE.md](admin/CLAUDE.md).

Both deploy to Vercel as separate projects (`personal-website` with root directory `website`, `personal-admin` with root directory `admin`). Run `pnpm install` / `pnpm dev` / `pnpm build` inside the app directory you're working on, not at the repo root.
