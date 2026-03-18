import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blogPosts';
import { IS_BLOG_VISIBLE } from '@/lib/features';

const BASE_URL = 'https://namias.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_BLOG_VISIBLE) {
    return [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    ];
  }

  const blogEntries = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...blogEntries,
  ];
}
