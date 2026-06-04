import { MetadataRoute } from 'next';
import { getCmsContent } from '@/lib/cms-content.server';
import { IS_BLOG_VISIBLE } from '@/lib/features';

const BASE_URL = 'https://namias.tech';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!IS_BLOG_VISIBLE) {
    return [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ];
  }

  const { blogPosts } = await getCmsContent();

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
