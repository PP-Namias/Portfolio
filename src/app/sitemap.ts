import { MetadataRoute } from 'next';
import { getCmsContent, getProjectSlugsForStaticParams } from '@/lib/cms-content.server';
import { IS_BLOG_VISIBLE, IS_PROJECTS_REVAMP_ENABLED } from '@/lib/features';

const BASE_URL = 'https://namias.tech';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  if (IS_BLOG_VISIBLE) {
    const { blogPosts } = await getCmsContent();
    entries.push({ url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
    for (const post of blogPosts) {
      entries.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  if (IS_PROJECTS_REVAMP_ENABLED) {
    const projectSlugs = await getProjectSlugsForStaticParams();
    for (const { slug } of projectSlugs) {
      entries.push({
        url: `${BASE_URL}/projects/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
