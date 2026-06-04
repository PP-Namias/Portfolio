import { MetadataRoute } from 'next';

const BASE_URL = 'https://namias.tech';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/studio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
