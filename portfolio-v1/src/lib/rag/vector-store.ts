import { VectorRecord } from './types'

function getVectorUrl(): string {
  return process.env.UPSTASH_VECTOR_URL || ''
}

function getVectorToken(): string {
  return process.env.UPSTASH_VECTOR_TOKEN || ''
}

function isConfigured(): boolean {
  return Boolean(getVectorUrl() && getVectorToken())
}

async function vectorRequest<T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  if (!isConfigured()) {
    throw new Error('Upstash Vector is not configured. Set UPSTASH_VECTOR_URL and UPSTASH_VECTOR_TOKEN.')
  }

  const url = `${getVectorUrl().replace(/\/$/, '')}${path}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getVectorToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Upstash Vector request failed (${response.status}): ${errorText.slice(0, 200)}`)
  }

  return (await response.json()) as T
}

export async function upsertVectors(vectors: VectorRecord[]): Promise<void> {
  if (vectors.length === 0) return
  const url = `${getVectorUrl().replace(/\/$/, '')}/upsert`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getVectorToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vectors),
    cache: 'no-store',
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Upstash Vector upsert failed (${response.status}): ${errorText.slice(0, 200)}`)
  }
}

export async function queryVectors(
  vector: number[],
  topK: number = 5,
  includeMetadata: boolean = true,
  includeVectors: boolean = false
): Promise<Array<{ id: string; score: number; metadata?: Record<string, unknown>; vector?: number[] }>> {
  const result = await vectorRequest<{
    results?: Array<{ id: string; score: number; metadata?: Record<string, unknown>; vector?: number[] }>
  }>('/query', {
    vector,
    topK,
    includeMetadata,
    includeVectors,
  })
  return result.results ?? []
}

export async function deleteVectors(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await vectorRequest('/delete', { ids })
}

export async function deleteByMetadata(filter: Record<string, unknown>): Promise<void> {
  await vectorRequest('/delete', { filter })
}

export async function getVectorCount(): Promise<number> {
  try {
    const result = await vectorRequest<{ total: number }>('/info', {})
    return result.total || 0
  } catch {
    return 0
  }
}

export async function resetIndex(): Promise<void> {
  await vectorRequest('/reset', {})
}

export { isConfigured as isVectorStoreConfigured }
