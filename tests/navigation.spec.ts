import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to all main sections', async ({ page }) => {
    const sections = [
      { name: 'Work', href: '/work', heading: /work/i },
      { name: 'Projects', href: '/projects', heading: /projects/i },
      { name: 'Blog', href: '/blog', heading: /blog/i },
      { name: 'Education', href: '/education', heading: /education/i },
    ];

    for (const section of sections) {
      await page
        .locator('nav[aria-label="Main"]')
        .getByRole('link', { name: section.name })
        .click();
      // Generous timeout: dev server compiles routes on first visit
      await expect(page).toHaveURL(section.href, { timeout: 15000 });
      await expect(page.locator('h1')).toContainText(section.heading, {
        timeout: 15000,
      });
    }
  });

  test('should mark the active navigation item with aria-current', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Main"]');

    // On home, no section link is current
    await expect(nav.locator('a[aria-current="page"]')).toHaveCount(0);

    // Navigate to Work and check it's marked current
    await page.goto('/work');
    const current = nav.locator('a[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('Work');
  });

  test('should navigate back to home when clicking name', async ({ page }) => {
    await page.goto('/blog');
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should have proper ARIA labels for accessibility', async ({ page }) => {
    await expect(page.locator('nav[aria-label="Main"]')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(
      page.locator('nav[aria-label="Main"]').getByRole('link', { name: 'Work' }),
    ).toBeVisible();
  });

  test('should be at top of page after navigating', async ({ page }) => {
    await page.goto('/blog');
    await page.evaluate(() => window.scrollTo(0, 200));
    await page
      .locator('nav[aria-label="Main"]')
      .getByRole('link', { name: 'Projects' })
      .click();
    await expect(page).toHaveURL('/projects');
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeLessThanOrEqual(10);
  });

  test('should show all nav links on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const nav = page.locator('nav[aria-label="Main"]');
    for (const name of ['Work', 'Projects', 'Blog', 'Education']) {
      await expect(nav.getByRole('link', { name })).toBeVisible();
    }
    // Header must not force horizontal scroll
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    const workLink = page
      .locator('nav[aria-label="Main"]')
      .getByRole('link', { name: 'Work' });
    await workLink.focus();
    await expect(workLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/work');
  });

  test('should have skip to main content link for accessibility', async ({ page }) => {
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toHaveClass(/sr-only/);
    await expect(skipLink).toHaveAttribute('href', '#main');
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
  });
});
