import { createClient, type SanityClient } from '@sanity/client';

import { getEnv } from '../config/env';

const SANITY_API_VERSION = '2026-02-19';

export function createSanityClient(): SanityClient {
  const env = getEnv();
  return createClient({
    projectId: env.sanityProjectId,
    dataset: env.sanityDataset,
    apiVersion: SANITY_API_VERSION,
    useCdn: true,
    perspective: 'published',
    token: env.sanityToken || undefined,
  });
}

export async function fetchSanity<T>(query: string): Promise<T[]> {
  const client = createSanityClient();
  const result = await client.fetch<T | T[]>(query);
  if (result === null || result === undefined) {
    return [];
  }
  return Array.isArray(result) ? result : [result];
}
