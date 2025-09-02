# CLAUDE.md - Tests Directory

This directory contains Playwright E2E tests for the personal website.

## Test Structure

Tests are organized by feature area:
- `blog.spec.ts` - Blog functionality tests
- `navigation.spec.ts` - Site navigation tests  
- `dark-mode.spec.ts` - Dark mode toggle tests

## Running Tests

```bash
# Run all tests
npm test

# Run with visible browser
npm run test:headed

# Debug tests interactively
npm run test:debug

# Open Playwright UI
npm run test:ui

# View test report
npm run test:report
```

## Writing Tests

### Test Patterns

1. **Page Object Pattern**: Not currently used but can be implemented for complex pages
2. **Selectors**: Use semantic HTML and ARIA attributes when possible
3. **Mobile Testing**: Always include mobile viewport tests

### Common Test Scenarios

#### Blog Tests
- Blog listing display
- Individual post navigation
- MDX content rendering
- Typography styles
- Multi-part series navigation
- Mobile responsiveness
- SEO meta tags

#### Navigation Tests
- Sidebar navigation
- Page transitions
- Active link states
- Mobile menu behavior

#### Dark Mode Tests
- Toggle functionality
- Persistence across refreshes
- Initial state based on system preference

### Best Practices

1. **Wait for Content**: Use `waitForLoadState('networkidle')` when needed
2. **Robust Selectors**: Prefer text content and ARIA labels over classes
3. **Viewport Testing**: Test at minimum 375x667 (iPhone SE size)
4. **Assertions**: Be specific about what you're testing
5. **Test Isolation**: Each test should be independent

### Common Selectors

```typescript
// Navigation
page.locator('nav[aria-label="Main navigation"]')

// Blog posts (excluding navigation links)
page.locator('a[href^="/blog/"]').filter({ 
  hasNot: page.locator('nav') 
})

// Main content area
page.locator('main')

// Headings (excluding nav)
page.locator('h1, h2, h3').filter({ 
  hasNot: page.locator('nav') 
})
```

## Debugging Failed Tests

1. Check `test-results/` directory for screenshots and videos
2. Use `--debug` flag to step through tests
3. Review error context files in test-results subdirectories
4. Verify selectors haven't changed in the application

## CI/CD Considerations

- Tests should run in headless mode in CI
- Set appropriate timeouts for slower CI environments
- Consider parallelization for faster execution
- Store test artifacts (screenshots, videos) for debugging