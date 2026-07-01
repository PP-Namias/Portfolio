import { createClient, type SanityClient } from '@sanity/client'

const SANITY_API_VERSION = 'v2024-01-01'

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name]?.trim() || fallback
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

export function createSanityClient(): SanityClient {
  const projectId = getEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', process.env.SANITY_PROJECT_ID)
  const dataset = getEnv('NEXT_PUBLIC_SANITY_DATASET', process.env.SANITY_DATASET || 'production')
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

  return createClient({
    projectId,
    dataset,
    apiVersion: SANITY_API_VERSION,
    token,
    useCdn: false,
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sanityQuery<T = any>(
  query: string,
  params?: Record<string, any>
): Promise<T> {
  const client = createSanityClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return client.fetch<T>(query, params as any)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sanityCreate(doc: any) {
  const client = createSanityClient()
  return client.create(doc)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sanityCreateIfNotExists(doc: any) {
  const client = createSanityClient()
  return client.createIfNotExists(doc)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sanityUpdate(id: string, patch: Record<string, any>) {
  const client = createSanityClient()
  return client.patch(id).set(patch).commit()
}

export async function sanityDelete(id: string) {
  const client = createSanityClient()
  return client.delete(id)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sanityFetchAllPosts(): Promise<any[]> {
  const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    tags,
    publishedAt,
    publishAt,
    coverImagePath,
    featured,
    metaTitle,
    metaDescription,
    "mainImageUrl": mainImage.asset->url,
    "author": author->name,
    "categories": categories[]->title,
    sourceId,
    published
  }`
  return sanityQuery(query)
}
