import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your_project_id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

/**
 * Advanced Fetching & Failover Architecture - Phase 4
 */
export async function safeFetchSanity<T>(query: string, fallbackData: T): Promise<T> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.warn('[Sanity] No Project ID found. Falling back to local data.');
    return fallbackData;
  }

  try {
    const start = Date.now();
    // Aggressive timeout map
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    
    const data = await client.fetch<T>(query, {}, {
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    clearTimeout(timeout);
    
    console.log(`[Sanity] Fetched in ${Date.now() - start}ms`);
    return data || fallbackData;
  } catch (error) {
    console.error('[Sanity] Fetch failed, falling back to local JSON.', error);
    return fallbackData;
  }
}
