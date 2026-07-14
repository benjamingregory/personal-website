import { test, expect } from '@playwright/test';

const PAGES = [
  {
    path: '/',
    heading: /hi, there/i,
    content: ['Selected work', 'Recent writing', 'Chat with an AI clone of me'],
  },
  {
    path: '/work',
    heading: /work/i,
    content: ['Kasava', 'Monroe', 'Astronomer'],
  },
  {
    path: '/projects',
    heading: /projects/i,
    content: ['Kasava', 'Monroe'],
  },
  {
    path: '/education',
    heading: /education/i,
    content: ['Stanford Graduate School of Business'],
  },
];

test.describe('Page smoke tests', () => {
  for (const { path, heading, content } of PAGES) {
    test(`${path} renders heading and content`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toContainText(heading);
      for (const text of content) {
        await expect(page.locator('main')).toContainText(text);
      }
      // Footer present on every page
      await expect(page.locator('footer')).toBeVisible();
    });

    test(`${path} has no horizontal scroll on mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('no unescaped HTML entities render as literal text', async ({ page }) => {
    for (const { path } of PAGES) {
      await page.goto(path);
      const body = await page.locator('body').textContent();
      expect(body, `literal entity on ${path}`).not.toMatch(/&(rsquo|amp|quot|ldquo|rdquo|mdash);/);
    }
  });
});
