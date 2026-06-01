import {createClient, type ClientConfig, type SanityClient} from '@sanity/client'

export const API_VERSION = '2026-02-19'

let cachedLive: SanityClient | null = null

interface LiveOptions {
  client?: ClientConfig
  serverToken?: string
  browserToken?: string
}

export function defineLive(options: LiveOptions) {
  const {client, serverToken, browserToken} = options
  if (!cachedLive) {
    cachedLive = createClient({
      projectId: client?.projectId || 'nl0qw78w',
      dataset: client?.dataset || 'production',
      apiVersion: client?.apiVersion || API_VERSION,
      useCdn: client?.useCdn ?? true,
      perspective: client?.perspective || 'published',
      token: serverToken,
    })
  }
  const sanityFetch = async <T = unknown>(query: string, params: Record<string, unknown> = {}) => {
    return cachedLive!.fetch<T>(query, params)
  }
  const SanityLive = () => null
  return {sanityFetch, SanityLive, browserToken}
}
