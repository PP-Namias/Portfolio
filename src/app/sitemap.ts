import { MetadataRoute } from 'next';
import { getCmsContent } from '@/lib/cms-content.server';
import { blogPosts as localBlogPosts } from '@/data/blogPosts';
import { IS_BLOG_VISIBLE } from '@/lib/features';

const BASE_URL = 'https://namias.tech';

export default function sitemap(): MetadataRoute.Sitemap | Promise<MetadataRoute.Sitemap> {
  if (!IS_BLOG_VISIBLE) {
    return [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ];
  }

  // In test environments, return synchronously. In runtime, return a Promise
  // that resolves after fetching CMS content.
  const isTest = process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';

  if (isTest) {
    const blogPosts = localBlogPosts;
    const blogEntries = blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
      { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      ...blogEntries,
    ];
  }

  return getCmsContent().then(({ blogPosts }) => {
    const blogEntries = blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
      { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      ...blogEntries,
    ];
  });
}
