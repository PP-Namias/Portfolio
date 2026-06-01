import {createClient, type ClientConfig, type SanityClient} from '@sanity/client'

import {getStudioEnvSnapshot} from '../../studio/env'

export const API_VERSION = '2025-10-21'

let cachedClient: SanityClient | null = null
let cachedPreviewClient: SanityClient | null = null
let cachedReadClient: SanityClient | null = null

function baseConfig(useCdn: boolean): ClientConfig {
  const env = getStudioEnvSnapshot()
  return {
    projectId: env.projectId,
    dataset: env.dataset,
    apiVersion: API_VERSION,
    useCdn,
    perspective: 'published',
    stega: false,
  }
}

export function getPublicClient(): SanityClient {
  if (!cachedClient) {
    cachedClient = createClient(baseConfig(true))
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
  const env = getStudioEnvSnapshot()
  cachedReadClient = createClient({
    ...baseConfig(false),
    token: env.readToken,
    perspective: 'published',
  })
  return cachedReadClient
}
