import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

export async function safeFetchSanity<T>(
  query: string,
  fallbackData: T,
  timeoutMs = 2000
): Promise<T> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return fallbackData;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const sanityData = await client.fetch<T>(query, {}, {
      signal: controller.signal,
      next: { revalidate: 3600, tags: ['sanity'] }
    });
    
    clearTimeout(timeoutId);
    
    if (sanityData && (Array.isArray(sanityData) ? sanityData.length > 0 : Object.keys(sanityData).length > 0)) {
      return sanityData;
    }
    return fallbackData;
  } catch (error) {
    console.warn('[Sanity CMS] Fetch failed or timed out. Instantly failing over to local JSON fallback.', error);
    return fallbackData;
  }
}
