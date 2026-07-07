import { test, expect } from '@playwright/test';

// The toggle renders a placeholder button until the component mounts;
// waiting for its icon guarantees clicks land on the live button.
async function themeToggle(page: import('@playwright/test').Page) {
  const button = page.getByLabel('Toggle theme');
  await expect(button.locator('svg')).toBeVisible();
  return button;
}

test.describe('Dark Mode Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle dark mode when button is clicked', async ({ page }) => {
    const html = page.locator('html');
    const toggleButton = await themeToggle(page);

    // Check initial state (light mode)
    await expect(html).not.toHaveClass(/dark/);

    // Click toggle to enable dark mode
    await toggleButton.click();
    await expect(html).toHaveClass(/dark/);
    await expect(toggleButton.locator('svg')).toBeVisible();

    // Click toggle to disable dark mode
    await toggleButton.click();
    await expect(html).not.toHaveClass(/dark/);
    await expect(toggleButton.locator('svg')).toBeVisible();
  });

  test('should persist dark mode preference in localStorage', async ({ page, context }) => {
    test.slow(); // multiple navigations; dev server is slow under parallel load
    const toggleButton = await themeToggle(page);

    // Enable dark mode
    await toggleButton.click();

    // Check localStorage
    const darkMode = await page.evaluate(() => localStorage.getItem('darkMode'));
    expect(darkMode).toBe('true');

    // Navigate to another page (domcontentloaded: WebKit can stall on the
    // dev server's load event; the class assertion auto-waits regardless)
    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Create a new page in the same context
    const newPage = await context.newPage();
    await newPage.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(newPage.locator('html')).toHaveClass(/dark/);
    await newPage.close();
  });

  test('should respect system color scheme preference by default', async ({ page, browserName }) => {
    // Skip this test in webkit as it handles color scheme differently
    test.skip(browserName === 'webkit', 'Webkit handles color scheme differently');

    // Clear localStorage to test default behavior
    await page.evaluate(() => localStorage.clear());

    // Set dark color scheme preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Set light color scheme preference
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('dark mode should work across all main pages', async ({ page }) => {
    test.slow(); // multiple navigations; dev server is slow under parallel load
    const html = page.locator('html');
    const toggleButton = await themeToggle(page);

    // Enable dark mode on home page
    await toggleButton.click();
    await expect(html).toHaveClass(/dark/);

    // Test on different pages
    const pages = ['/work', '/education', '/projects', '/blog'];
    for (const pagePath of pages) {
      await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
      await expect(html).toHaveClass(/dark/);
      await expect(page.getByLabel('Toggle theme')).toBeVisible();
    }
  });
});
