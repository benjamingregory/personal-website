# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Next.js 14 App Router, TypeScript, and TailwindCSS. Features an MDX-powered blog system and static content management.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production (run before deploying)
- `npm run start` - Start production server
- `npm run lint` - Check code quality with ESLint

### Testing
- `npm test` - Run Playwright tests
- `npm run test:headed` - Run tests with browser visible
- `npm run test:debug` - Debug tests interactively
- `npm run test:ui` - Open Playwright UI mode
- `npm run test:report` - Show test report

### Common Tasks
- To add a new blog post: Create a new directory under `src/app/blog/[post-name]/` with `page.mdx` and optionally `layout.tsx`
- To update blog listing: Edit the posts array in `src/app/blog/page.tsx`
- To update sitemap: Edit the blog posts array in `src/app/sitemap.ts`

## Architecture

### Directory Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with Sidebar + Footer
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles and Tailwind directives
│   ├── robots.ts          # SEO robots configuration
│   ├── sitemap.ts         # Dynamic sitemap generation
│   ├── blog/
│   │   ├── page.tsx       # Blog listing (contains hardcoded post metadata)
│   │   ├── [...slug]/     # Dynamic routing for MDX blog posts
│   │   │   ├── page.tsx   # MDX rendering page
│   │   │   └── layout.tsx # Blog-specific layout
│   │   └── [post-name]/   # Individual blog posts as MDX files
│   │       ├── page.mdx   # Blog post content
│   │       └── layout.tsx # Optional post-specific layout
│   ├── work/page.tsx      # Work experience showcase
│   ├── projects/page.tsx  # Projects portfolio
│   ├── education/page.tsx # Education section
│   └── interests/         # Interests and hobbies (planned)
├── components/
│   ├── DarkModeToggle.tsx # Dark mode toggle component
│   ├── JsonLd.tsx         # Structured data component
│   └── ui/                # Reusable UI components
│       ├── badge.tsx
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
└── mdx-components.tsx     # MDX component configuration
```

### Key Patterns

1. **MDX Blog System**: 
   - Blog posts are MDX files in `src/app/blog/[post-name]/page.mdx`
   - Custom MDX components are configured in `src/mdx-components.tsx`
   - Dynamic routing available via `[...slug]` for flexible paths
   - Contentlayer integration for MDX processing and metadata

2. **Static Data Management**: 
   - All content (blog metadata, work experience, projects) is managed as static data in code
   - No CMS or database
   - Blog metadata hardcoded in `src/app/blog/page.tsx`

3. **Layout Hierarchy**: 
   - Root layout (`app/layout.tsx`) provides Sidebar navigation and Footer
   - Blog posts can have custom layouts (`blog/[post-name]/layout.tsx`)
   - Dynamic blog posts use `blog/[...slug]/layout.tsx`

4. **Styling**: TailwindCSS utility-first approach with:
   - Custom typography plugin for blog content
   - Responsive breakpoints (mobile-first)
   - Custom gradient utilities configured in tailwind.config.ts
   - Dark mode support via class-based theming
   - Scrollbar hiding utility (`tailwind-scrollbar-hide`)

5. **Font Strategy**: 
   - Main site uses "Outfit" font
   - Blog posts use "Montserrat" font (configured in blog layouts)

6. **SEO & Metadata**:
   - Dynamic sitemap generation (`app/sitemap.ts`)
   - Robots.txt configuration (`app/robots.ts`)
   - JSON-LD structured data support via `JsonLd` component

7. **Testing**:
   - Playwright E2E tests in `tests/` directory
   - Tests cover navigation, blog functionality, and dark mode
   - Mobile responsiveness testing included

### Important Files
- `src/app/blog/page.tsx` - Contains hardcoded blog post metadata array
- `src/mdx-components.tsx` - Custom MDX component styling
- `next.config.js` - MDX configuration and image domain allowlist
- `tailwind.config.ts` - Custom utilities and plugins
- `contentlayer.config.ts` - Contentlayer configuration for MDX processing
- `src/app/sitemap.ts` - Dynamic sitemap generation with blog posts
- `src/app/robots.ts` - SEO robots configuration
- `src/components/DarkModeToggle.tsx` - Dark mode implementation

## Development Guidelines

1. **Adding Blog Posts**:
   - Create directory: `src/app/blog/your-post-name/`
   - Add `page.mdx` with content
   - Update posts array in `src/app/blog/page.tsx` with metadata
   - Update sitemap in `src/app/sitemap.ts` with the new post
   - Optionally add custom `layout.tsx` for specific styling needs

2. **Component Patterns**:
   - Use functional components with TypeScript
   - Client components marked with `"use client"` when needed
   - Keep components co-located with their routes
   - Use shadcn/ui components from `src/components/ui/`

3. **Path Imports**: Use `@/*` alias for src directory imports (e.g., `@/app/Sidebar`)

4. **Responsive Design**: 
   - Always consider mobile view, use `sm:` breakpoints for desktop styles
   - Test on mobile viewport (375x667) minimum
   - Ensure sidebar navigation works on mobile

5. **Testing Requirements**:
   - Write Playwright tests for new features
   - Test mobile responsiveness
   - Verify SEO meta tags are present
   - Check that navigation remains consistent

6. **Performance Considerations**:
   - Leverage Next.js App Router for automatic code splitting
   - Use dynamic imports for heavy components
   - Optimize images with Next.js Image component

7. **Type Safety**:
   - Always define TypeScript types for props and data
   - Use strict TypeScript configuration
   - Avoid using `any` type

## Dependencies

### Core Framework
- **Next.js 14.2.4** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type safety

### Styling
- **TailwindCSS 3.4.1** - Utility-first CSS
- **@tailwindcss/typography** - Typography plugin for prose content
- **tailwind-scrollbar-hide** - Hide scrollbars utility
- **clsx & tailwind-merge** - Utility for conditional classes

### MDX & Content
- **@mdx-js/loader & @mdx-js/react** - MDX processing
- **@next/mdx** - Next.js MDX integration
- **contentlayer** - Content processing and metadata
- **reading-time** - Calculate reading time for posts

### UI Components
- **@radix-ui/react-slot** - Primitive components
- **lucide-react** - Icon library
- **class-variance-authority** - Component variants

### Testing
- **@playwright/test** - E2E testing framework

## Troubleshooting

### Common Issues

1. **MDX not rendering**: Check that the file extension is `.mdx` and the directory structure is correct
2. **Blog post not showing**: Ensure metadata is added to `src/app/blog/page.tsx`
3. **Dark mode not persisting**: Check localStorage permissions in browser
4. **Tests failing**: Run `npm run build` first to ensure production build works