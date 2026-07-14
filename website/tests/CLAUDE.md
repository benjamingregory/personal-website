# CLAUDE.md - Tests Directory

This directory contains Playwright E2E tests for the personal website.

## Test Structure

Tests are organized by feature area:

- `smoke.spec.ts` - Per-page smoke tests (/, /work, /projects, /education): heading, key content, footer, mobile overflow, entity regression
- `blog.spec.ts` - Blog listing, tag filter, post rendering, series, SEO meta
- `navigation.spec.ts` - Header nav, active state, keyboard, skip link, mobile nav
- `dark-mode.spec.ts` - Theme toggle, persistence, system preference
- `chat.spec.ts` - Chat page shell (heading, prompts, mute toggle, mobile)

## Running Tests

```bash
# Run all tests
pnpm test

# Run with visible browser
pnpm test:headed

# Debug tests interactively
pnpm test:debug

# Open Playwright UI
pnpm test:ui

# View test report
pnpm test:report
```

On a fresh clone, run `pnpm exec playwright install` first to download browsers.

## Writing Tests

### Test Patterns

1. **Selectors**: Use semantic HTML and ARIA attributes when possible
2. **Mobile Testing**: Always include mobile viewport tests (375x667 minimum)
3. **Each new page gets a smoke test** — add it to the `PAGES` array in `smoke.spec.ts`

### Current Selectors

These match the live components — verify against `src/components/` before adding new ones:

```typescript
// Header navigation (sticky top nav, no sidebar)
page.locator('nav[aria-label="Main"]')

// Nav links are named plainly: "Work", "Projects", "Blog", "Education"
page.locator('nav[aria-label="Main"]').getByRole('link', { name: 'Work' })

// Active nav item
page.locator('nav[aria-label="Main"] a[aria-current="page"]')

// Home link (the "Ben Gregory" wordmark)
page.getByRole('link', { name: 'Home' })

// Theme toggle (renders a placeholder until mounted — wait for its svg)
page.getByLabel('Toggle theme')

// Blog tag filter chips
page.locator('button[aria-pressed]')

// Blog post links (excluding navigation links)
page.locator('a[href^="/blog/"]').filter({ hasNot: page.locator('nav') })

// Skip link targets #main
page.getByRole('link', { name: /skip to main content/i })
```

### Gotchas

- **Theme toggle hydration**: `AnimatedThemeToggle` renders an empty placeholder button pre-mount with the same aria-label. Wait for `button svg` to be visible before clicking.
- **FadeUp sections**: below-fold content animates in on viewport enter. `toBeVisible()`/`toContainText()` still work (opacity: 0 counts as visible to Playwright), but screenshots of unscrolled full pages will show blank sections.
- **Dates**: blog rows render `MMM d, yyyy` in a mono span — there is no `<time>` element.

## Debugging Failed Tests

1. Check `test-results/` directory for screenshots and videos
2. Use `--debug` flag to step through tests
3. Verify selectors haven't changed in the application

## CI/CD Considerations

- CI runs lint, typecheck, then the suite via `.github/workflows/playwright.yml` (pnpm)
- The sharded workflow (`playwright-advanced.yml`) is manual-dispatch only
