import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to all main sections', async ({ page }) => {
    const sections = [
      { name: 'Work', href: '/work', title: /work/i },
      { name: 'Education', href: '/education', title: /education/i },
      { name: 'Projects', href: '/projects', title: /projects/i },
      { name: 'Blog', href: '/blog', title: /blog/i },
    ];

    for (const section of sections) {
      // Click on navigation link
      await page.getByRole('link', { name: `Navigate to ${section.name} section` }).click();
      
      // Verify URL changed
      await expect(page).toHaveURL(section.href);
      
      // Verify page loaded (check for some content)
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('should highlight active navigation item', async ({ page }) => {
    // Check home page - no section should be bold
    const homeLinks = page.locator('nav').getByRole('link').filter({ hasText: /^(Work|Education|Projects|Blog)$/ });
    for (const link of await homeLinks.all()) {
      const span = link.locator('span');
      await expect(span).not.toHaveClass(/font-bold/);
    }

    // Navigate to Work and check it's highlighted
    await page.goto('/work');
    const workLink = page.getByRole('link', { name: 'Navigate to Work section' }).locator('span');
    await expect(workLink).toHaveClass(/font-bold/);
    
    // Check others are not highlighted
    const otherSections = ['Education', 'Projects', 'Blog'];
    for (const section of otherSections) {
      const link = page.getByRole('link', { name: `Navigate to ${section} section` }).locator('span');
      await expect(link).not.toHaveClass(/font-bold/);
    }
  });

  test('should navigate back to home when clicking name', async ({ page }) => {
    // Navigate to a different page first
    await page.goto('/blog');
    
    // Click on "Ben Gregory" to go home
    await page.getByRole('link', { name: /go to homepage/i }).click();
    
    // Should be on home page
    await expect(page).toHaveURL('/');
  });

  test('should have proper ARIA labels for accessibility', async ({ page }) => {
    // Check main navigation has proper aria-label
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();
    
    // Check navigation links have proper aria-labels
    const homeLink = page.getByRole('link', { name: /go to homepage/i });
    await expect(homeLink).toBeVisible();
    
    // Check section links have proper aria-labels
    const workLink = page.getByRole('link', { name: /navigate to work section/i });
    await expect(workLink).toBeVisible();
  });

  test('should maintain scroll position when navigating', async ({ page }) => {
    // Go to blog page
    await page.goto('/blog');
    
    // Scroll down a bit
    await page.evaluate(() => window.scrollTo(0, 200));
    
    // Navigate to another page
    await page.getByRole('link', { name: 'Navigate to Projects section' }).click();
    
    // Should be at top of new page
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeLessThanOrEqual(10); // Allow small margin for any animations
  });

  test('should show footer text on desktop only', async ({ page, viewport }) => {
    // The footer text is in the sidebar, has hidden class and sm:flex
    const footer = page.locator('[aria-label="Footer"]');
    
    // Desktop view - check if viewport is desktop size first
    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width >= 640) {
      await expect(footer).toBeVisible();
    } else {
      // If test starts in mobile view, set desktop size first
      await page.setViewportSize({ width: 1024, height: 768 });
      await expect(footer).toBeVisible();
    }
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(footer).toBeHidden();
  });

  test('sidebar should be responsive', async ({ page }) => {
    const sidebar = page.locator('nav[aria-label="Main navigation"]');
    
    // Ensure we start with desktop view
    const viewportSize = page.viewportSize();
    if (!viewportSize || viewportSize.width < 640) {
      await page.setViewportSize({ width: 1024, height: 768 });
    }
    
    // Desktop view - should have sm:w-[240px] applied
    let sidebarWidth = await sidebar.evaluate(el => el.offsetWidth);
    expect(sidebarWidth).toBeGreaterThanOrEqual(190); // Allow more flexibility for different browsers
    
    // Mobile view - should have min-w-[140px] applied
    await page.setViewportSize({ width: 375, height: 667 });
    sidebarWidth = await sidebar.evaluate(el => el.offsetWidth);
    expect(sidebarWidth).toBeGreaterThanOrEqual(100); // min-width with flexibility
    expect(sidebarWidth).toBeLessThanOrEqual(160); // Should be narrower than desktop
  });

  test('should handle keyboard navigation', async ({ page, browserName }) => {
    // WebKit/Safari handles focus differently, especially with tabindex
    if (browserName === 'webkit') {
      // For WebKit, directly focus the Work link to test navigation
      const workLink = page.getByRole('link', { name: /navigate to work section/i });
      await workLink.focus();
      await expect(workLink).toBeFocused();
      
      // Press Enter to navigate
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL('/work');
    } else {
      // Tab through navigation items for other browsers
      await page.keyboard.press('Tab'); // Skip to main content link
      await page.keyboard.press('Tab'); // Ben Gregory link
      await page.keyboard.press('Tab'); // Dark mode toggle
      await page.keyboard.press('Tab'); // Work link
      
      // Check Work link is focused
      const workLink = page.getByRole('link', { name: /navigate to work section/i });
      await expect(workLink).toBeFocused();
      
      // Press Enter to navigate
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL('/work');
    }
  });

  test('should have skip to main content link for accessibility', async ({ page, browserName }) => {
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    
    // Should be present but visually hidden initially
    await expect(skipLink).toHaveClass(/sr-only/);
    
    // WebKit/Safari handles focus differently
    if (browserName === 'webkit') {
      // For WebKit, directly focus the skip link
      await skipLink.focus();
      await expect(skipLink).toBeFocused();
    } else {
      // Should become visible on focus for other browsers
      await page.keyboard.press('Tab');
      await expect(skipLink).toBeFocused();
    }
    
    // Verify it has the focus:not-sr-only class for visibility on focus
    await expect(skipLink).toHaveClass(/focus:not-sr-only/);
    
    // Clicking should jump to main content
    await skipLink.click();
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeInViewport();
  });
});