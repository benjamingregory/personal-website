import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bengregory.com'; // Update with your actual domain

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/education`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // Blog posts - matching the data from blog/page.tsx
  const blogPosts = [
    { href: '/blog/building_monroe/part_1', date: '2025-03-10' },
    { href: '/blog/building_monroe/part_2', date: '2025-03-10' },
    { href: '/blog/building_monroe/part_3', date: '2025-03-10' },
    { href: '/blog/gdc_coplay', date: '2025-03-25' },
    { href: '/blog/sculpting_code', date: '2025-08-04' },
    { href: '/blog/open_source_paradox', date: '2025-08-11' },
    { href: '/blog/claude-code-kasava-one-developer-army', date: '2025-09-10' },
  ].map((post) => ({
    url: `${baseUrl}${post.href}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPosts];
}