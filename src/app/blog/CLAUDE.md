# CLAUDE.md — Blog

The blog is fully MDX-driven via `next-mdx-remote/rsc`. There is **no registry** to update for new posts.

## Layout

```
src/app/blog/
├── page.tsx                # Index: pulls posts via lib/posts, hands to <BlogIndex>
└── [...slug]/
    ├── page.tsx            # Renders a post via <MDXRemote source={post.content} />
    └── layout.tsx          # Wraps post in <ReadingProgress />

src/content/blog/           # Where posts actually live
├── <slug>.mdx              # Flat post → /blog/<slug>
└── <series>/<part>.mdx     # Series part → /blog/<series>/<part>
```

## Adding a post

1. Create `src/content/blog/<slug>.mdx` (or `<series>/<part>.mdx`).
2. Add frontmatter (`title`, `date`, `description` are required; `tags`, `series`, `published` are optional):
   ```mdx
   ---
   title: "Post Title"
   date: 2026-05-01
   description: "One-line description."
   tags: ["product", "ai"]
   series: "Optional Series Name"
   published: true
   ---
   ```
3. Write the body. Markdown + JSX both work.

The post auto-appears in `/blog`, the home recent-writing list, the sitemap, and the route-generation step. Nothing else to update.

## How rendering works

- `src/lib/posts.ts` walks `src/content/blog/`, parses frontmatter with `gray-matter`, and returns typed `Post[]` (in-process cached).
- `[...slug]/page.tsx` finds the matching post, renders the editorial header (back link, title, description, mono metadata row, tags), then `<MDXRemote>` for the body.
- `mdx-components.tsx` overrides custom components (currently just `<img>` to a Next `<Image>`).
- The blog post layout wraps every post in `<ReadingProgress />`, which is a scroll-linked spring bar at the top of the viewport.

## Frontmatter notes

- **`tags` casing matters.** "AI" and "ai" are different tags in the index filter. Pick a casing convention for your tags and stick to it.
- **`series`** groups parts together. A "More in this series" sidebar auto-renders on every post in the series.
- **`published: false`** hides a post from listings and 404s the route.

## Styling

Posts inherit the global font/typography. The body is rendered inside `prose prose-neutral` (Tailwind Typography), with custom overrides for headings (uses `font-display`) and links (uses `anim-underline`-adjacent styling).

For images in posts: place files in `public/` and reference with absolute paths (`![alt](/my-image.png)`). The MDX `img` override renders them via Next `<Image>` automatically.

## Don't

- Don't create `page.mdx` files inside `src/app/blog/` — the file routing has been removed; all routing is via `[...slug]/page.tsx`.
- Don't add per-post `layout.tsx` files. The single `[...slug]/layout.tsx` handles all posts.
- Don't import from `contentlayer/generated`. Contentlayer was removed; use `getAllPosts` / `getPost` from `@/lib/posts`.
