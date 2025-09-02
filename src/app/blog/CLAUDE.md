# CLAUDE.md - Blog Directory

This directory contains the blog system implementation using MDX and Next.js App Router.

## Blog Architecture

```
blog/
├── page.tsx              # Blog listing page with hardcoded metadata
├── [...slug]/           # Dynamic routing for flexible blog paths
│   ├── page.tsx        # Dynamic MDX rendering
│   └── layout.tsx      # Blog-specific layout
└── [post-name]/         # Individual blog post directories
    ├── page.mdx        # Blog post content in MDX
    └── layout.tsx      # Optional post-specific layout
```

## Adding a New Blog Post

### Step 1: Create Post Directory
```bash
mkdir src/app/blog/my-new-post
```

### Step 2: Write MDX Content
Create `page.mdx` with frontmatter and content:
```mdx
---
title: "My New Post"
date: "2025-01-15"
description: "A brief description"
tags: ["tech", "web"]
---

# My New Post

Your content here...
```

### Step 3: Update Blog Listing
Edit `src/app/blog/page.tsx` and add to the posts array:
```typescript
{
  title: "My New Post",
  href: "/blog/my-new-post",
  description: "A brief description",
  date: "January 15, 2025",
  readTime: "5 min read",
  tags: ["tech", "web"],
}
```

### Step 4: Update Sitemap
Edit `src/app/sitemap.ts` and add to blogPosts array:
```typescript
{ href: '/blog/my-new-post', date: '2025-01-15' }
```

### Step 5: (Optional) Custom Layout
Create `layout.tsx` for post-specific styling:
```typescript
export default function Layout({ children }) {
  return (
    <article className="custom-styles">
      {children}
    </article>
  );
}
```

## Blog Post Patterns

### Multi-Part Series
For series like "Building Monroe":
```
building_monroe/
├── layout.tsx     # Shared layout for the series
├── part_1/
│   └── page.mdx
├── part_2/
│   └── page.mdx
└── part_3/
    └── page.mdx
```

### Custom Fonts
Blog posts use Montserrat font (defined in layouts):
```typescript
const montserrat = Montserrat({ subsets: ["latin"] });
```

## MDX Components

Custom components are defined in `src/mdx-components.tsx`:
- Typography elements (h1-h6, p, ul, ol, li)
- Code blocks with syntax highlighting
- Links with styling
- Images with proper spacing
- Tables with borders
- Blockquotes with styling

## Blog Listing Page

The `page.tsx` file contains:
- Hardcoded post metadata array
- Grid layout for post cards
- Tag badges
- Reading time display
- Hover effects and transitions

## Dynamic Routing

The `[...slug]` directory enables:
- Flexible URL structures
- Contentlayer integration
- Dynamic MDX rendering
- Fallback handling

## SEO Considerations

Each blog post should have:
- Unique title in metadata
- Meta description
- Open Graph tags
- Structured data (JSON-LD)
- Proper heading hierarchy

## Styling Guidelines

1. **Typography**: Use Tailwind Typography plugin
2. **Spacing**: Consistent padding/margins
3. **Dark Mode**: Support both light and dark themes
4. **Mobile**: Responsive design required
5. **Code Blocks**: Syntax highlighting with proper contrast

## Common Issues

1. **Post not appearing**: Check all three places (page.tsx, sitemap.ts, directory exists)
2. **MDX errors**: Validate frontmatter format
3. **Layout issues**: Check parent layout conflicts
4. **Image loading**: Ensure domains are whitelisted in next.config.js

## Testing Blog Posts

Run tests to verify:
```bash
npm test tests/blog.spec.ts
```

Key test areas:
- Blog listing displays correctly
- Individual posts load
- MDX renders properly
- Navigation works
- Mobile responsive
- SEO tags present