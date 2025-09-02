# CLAUDE.md - Components Directory

This directory contains reusable React components for the personal website.

## Component Structure

```
components/
├── DarkModeToggle.tsx  # Dark mode toggle functionality
├── JsonLd.tsx          # Structured data for SEO
└── ui/                 # shadcn/ui components
    ├── badge.tsx       # Badge component
    ├── button.tsx      # Button component
    └── card.tsx        # Card component
```

## Component Guidelines

### DarkModeToggle
- Client component (`"use client"`)
- Manages dark mode state in localStorage
- Respects system preference as default
- Uses Lucide icons (Sun/Moon)

### JsonLd
- Server component for structured data
- Generates JSON-LD schema for SEO
- Used in blog posts and pages

### UI Components (shadcn/ui)
- Based on Radix UI primitives
- Styled with Tailwind CSS
- Use class-variance-authority for variants
- Follow compound component pattern where applicable

## Adding New Components

1. **Naming Convention**: Use PascalCase for component files
2. **Location**: 
   - Page-specific components: Keep in the page directory
   - Shared components: Place in this directory
   - UI primitives: Add to `ui/` subdirectory

3. **TypeScript**: Always define proper types for props
4. **Styling**: Use Tailwind utilities with cn() helper from `@/lib/utils`
5. **Client Components**: Only use `"use client"` when necessary (state, effects, event handlers)

## Component Patterns

### Variant Pattern (using CVA)
```typescript
const variants = cva("base-classes", {
  variants: {
    variant: {
      default: "default-classes",
      secondary: "secondary-classes",
    },
    size: {
      sm: "small-classes",
      md: "medium-classes",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
```

### Compound Components
```typescript
const Card = ({ children }) => <div>{children}</div>;
const CardHeader = ({ children }) => <div>{children}</div>;
const CardContent = ({ children }) => <div>{children}</div>;

Card.Header = CardHeader;
Card.Content = CardContent;
```

## Accessibility

- Always include proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers when possible
- Use semantic HTML elements

## Dark Mode Support

All components should support dark mode:
- Use `dark:` prefix for dark mode styles
- Test appearance in both modes
- Consider contrast ratios

## Performance

- Minimize client components
- Use React.memo for expensive renders
- Lazy load heavy components
- Optimize re-renders with proper dependencies

## Testing Components

When testing components:
1. Test user interactions
2. Verify accessibility attributes
3. Check responsive behavior
4. Test dark mode variants
5. Validate TypeScript types