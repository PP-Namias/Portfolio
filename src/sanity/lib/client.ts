import {createClient, type ClientConfig, type SanityClient} from '@sanity/client'

export const API_VERSION = '2026-02-19'

function readEnv(name: string, fallback?: string): string {
  const value = process.env[name]
  if (typeof value === 'string' && value.trim().length > 0) return value.trim()
  if (fallback) return fallback
  throw new Error(`Missing required env var: ${name}`)
}

let cachedClient: SanityClient | null = null
let cachedPreviewClient: SanityClient | null = null
let cachedReadClient: SanityClient | null = null

function baseConfig(useCdn: boolean): ClientConfig {
  return {
    projectId: readEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'nl0qw78w'),
    dataset: readEnv('NEXT_PUBLIC_SANITY_DATASET', 'production'),
    apiVersion: API_VERSION,
    useCdn,
    perspective: 'published',
    stega: false,
  }
}

export function getPublicClient(): SanityClient {
  if (!cachedClient) {
    const useCdn = process.env.NODE_ENV === 'production'
    cachedClient = createClient(baseConfig(useCdn))
  }
  return cachedClient
}

export function getPreviewClient(): SanityClient {
  if (!cachedPreviewClient) {
    cachedPreviewClient = createClient({
      ...baseConfig(false),
      perspective: 'previewDrafts',
      stega: {studioUrl: '/studio'},
    })
  }
  return cachedPreviewClient
}

export function getReadClient(): SanityClient {
  if (cachedReadClient) {
    return cachedReadClient
  }
  const readToken = process.env.SANITY_API_READ_TOKEN
  cachedReadClient = createClient({
    ...baseConfig(false),
    token: readToken,
    perspective: 'published',
  })
  return cachedReadClient
}
