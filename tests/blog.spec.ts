import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('should display blog listing page', async ({ page }) => {
    // Check page title/heading
    await expect(page.locator('h1')).toContainText('Blog');
    
    // Check that blog posts are displayed
    const posts = page.locator('article, [role="article"], a[href^="/blog/"]').filter({ 
      hasNot: page.locator('nav') 
    });
    const postCount = await posts.count();
    expect(postCount).toBeGreaterThan(0);
  });

  test('should display blog post metadata', async ({ page }) => {
    // Look for date elements (common in blog posts)
    const dates = page.locator('time, [class*="date"]');
    const dateCount = await dates.count();
    expect(dateCount).toBeGreaterThan(0);
    
    // Check for blog post titles
    const titles = page.locator('h2, h3').filter({ 
      hasNot: page.locator('nav') 
    });
    const titleCount = await titles.count();
    expect(titleCount).toBeGreaterThan(0);
  });

  test('should navigate to individual blog posts', async ({ page }) => {
    // Get all blog post links
    const postLinks = page.locator('a[href^="/blog/"]').filter({ 
      hasNot: page.locator('nav') 
    });
    
    const linkCount = await postLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    
    // Click on the first blog post
    const firstPostHref = await postLinks.first().getAttribute('href');
    await postLinks.first().click();
    
    // Verify navigation
    await expect(page).toHaveURL(firstPostHref!);
    
    // Verify blog post content is displayed
    await expect(page.locator('main')).toBeVisible();
    
    // Blog posts should have content
    const content = await page.locator('main').textContent();
    expect(content?.length).toBeGreaterThan(100);
  });

  test('should render MDX content properly', async ({ page }) => {
    // Navigate to a specific blog post
    await page.goto('/blog/claude-code-kasava-one-developer-army');
    
    // Check that MDX content is rendered
    await expect(page.locator('main')).toBeVisible();
    
    // Check for typical MDX elements
    const headings = page.locator('h1, h2, h3, h4, h5, h6').filter({ 
      hasNot: page.locator('nav') 
    });
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Check for paragraphs
    const paragraphs = page.locator('p');
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(0);
  });

  test('should have proper typography styles for blog content', async ({ page }) => {
    await page.goto('/blog/claude-code-kasava-one-developer-army');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check that main content area exists
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for typography elements - headings and paragraphs
    const headings = page.locator('h1, h2, h3, h4').filter({ 
      hasNot: page.locator('nav') 
    });
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Check for paragraph content
    const paragraphs = page.locator('p');
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(0);
  });

  test('should handle blog post navigation in Building Monroe series', async ({ page }) => {
    // Test multi-part blog series
    await page.goto('/blog/building_monroe/part_1');
    
    // Verify the page loads
    await expect(page.locator('main')).toBeVisible();
    
    // Navigate to part 2
    await page.goto('/blog/building_monroe/part_2');
    await expect(page.locator('main')).toBeVisible();
    
    // Content should be different between parts
    const part1Content = await page.goto('/blog/building_monroe/part_1').then(async () => 
      await page.locator('main').textContent()
    );
    
    const part2Content = await page.goto('/blog/building_monroe/part_2').then(async () => 
      await page.locator('main').textContent()
    );
    
    expect(part1Content).not.toBe(part2Content);
  });

  test('should maintain consistent layout across blog posts', async ({ page }) => {
    const blogPosts = [
      '/blog/claude-code-kasava-one-developer-army',
      '/blog/sculpting_code',
      '/blog/open_source_paradox',
    ];
    
    for (const post of blogPosts) {
      await page.goto(post);
      await page.waitForLoadState('networkidle');
      
      // Check sidebar is present
      const sidebar = page.locator('nav[aria-label="Main navigation"]');
      await expect(sidebar).toBeVisible();
      
      // Check main content area is present
      const main = page.locator('main');
      await expect(main).toBeVisible();
      
      // Check that content is present (headings and paragraphs)
      const hasContent = await page.locator('h1, h2, h3, p').count();
      expect(hasContent).toBeGreaterThan(0);
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Blog listing should still be accessible
    await expect(page.locator('h1')).toBeVisible();
    
    // Navigate to a specific blog post
    await page.goto('/blog/sculpting_code');
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    
    // Content should be readable on mobile
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check that content exists and is accessible
    const hasHeadings = await page.locator('h1, h2, h3, h4').count();
    expect(hasHeadings).toBeGreaterThan(0);
    
    const hasParagraphs = await page.locator('p').count();
    expect(hasParagraphs).toBeGreaterThan(0);
    
    // Verify viewport is properly set for mobile
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(viewportWidth).toBeLessThanOrEqual(375);
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    // Check blog listing page
    const listingTitle = await page.title();
    expect(listingTitle).toContain('Blog');
    
    // Navigate to a specific post
    await page.goto('/blog/claude-code-kasava-one-developer-army');
    
    // Check that title changed
    const postTitle = await page.title();
    expect(postTitle).not.toBe(listingTitle);
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    const descriptionContent = await metaDescription.getAttribute('content');
    expect(descriptionContent).toBeTruthy();
  });
});