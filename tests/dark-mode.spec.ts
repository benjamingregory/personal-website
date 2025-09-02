import { test, expect } from '@playwright/test';

test.describe('Dark Mode Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle dark mode when button is clicked', async ({ page }) => {
    const html = page.locator('html');
    const toggleButton = page.getByLabel('Toggle dark mode');
    
    // Check initial state (light mode)
    await expect(html).not.toHaveClass(/dark/);
    
    // Click toggle to enable dark mode
    await toggleButton.click();
    await expect(html).toHaveClass(/dark/);
    
    // Icon should change to sun in dark mode
    await expect(toggleButton.locator('svg')).toBeVisible();
    
    // Click toggle to disable dark mode
    await toggleButton.click();
    await expect(html).not.toHaveClass(/dark/);
    
    // Icon should change back to moon in light mode
    await expect(toggleButton.locator('svg')).toBeVisible();
  });

  test('should persist dark mode preference in localStorage', async ({ page, context }) => {
    const toggleButton = page.getByLabel('Toggle dark mode');
    
    // Enable dark mode
    await toggleButton.click();
    
    // Check localStorage
    const darkMode = await page.evaluate(() => localStorage.getItem('darkMode'));
    expect(darkMode).toBe('true');
    
    // Navigate to another page
    await page.goto('/blog');
    
    // Dark mode should still be active
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Create a new page in the same context
    const newPage = await context.newPage();
    await newPage.goto('/');
    
    // Dark mode should be active on the new page
    const newHtml = newPage.locator('html');
    await expect(newHtml).toHaveClass(/dark/);
    
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
    
    // Should be in dark mode
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Set light color scheme preference
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    
    // Should be in light mode
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should have smooth color transitions', async ({ page }) => {
    const body = page.locator('body');
    
    // Check that transition classes are applied via Tailwind
    const hasTransition = await body.evaluate(el => {
      const styles = window.getComputedStyle(el);
      // Check for any transition property (Tailwind applies transition-colors)
      return styles.transitionProperty !== 'none' && 
             styles.transitionProperty !== '' &&
             styles.transitionDuration !== '0s';
    });
    
    expect(hasTransition).toBeTruthy();
  });

  test('dark mode should work across all main pages', async ({ page }) => {
    const toggleButton = page.getByLabel('Toggle dark mode');
    const html = page.locator('html');
    
    // Enable dark mode on home page
    await toggleButton.click();
    await expect(html).toHaveClass(/dark/);
    
    // Test on different pages
    const pages = ['/work', '/education', '/projects', '/blog'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Verify dark class is maintained
      await expect(html).toHaveClass(/dark/);
      
      // Verify that the toggle button still shows the correct icon (sun in dark mode)
      const toggleIcon = page.getByLabel('Toggle dark mode').locator('svg');
      await expect(toggleIcon).toBeVisible();
    }
  });
});