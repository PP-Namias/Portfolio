import { embedText } from './embedder'
import { queryVectors, isVectorStoreConfigured } from './vector-store'
import { RetrievedChunk } from './types'

const SIMILARITY_THRESHOLD = 0.60
const DEFAULT_TOP_K = 5

export async function retrieve(
  query: string,
  topK: number = DEFAULT_TOP_K
): Promise<RetrievedChunk[]> {
  if (!query.trim()) return []

  try {
    const queryEmbedding = await embedText(query)
    const results = await queryVectors(queryEmbedding, topK * 2, true)

    if (!Array.isArray(results)) return []

    const scored: RetrievedChunk[] = results
      .filter((r) => r.score >= SIMILARITY_THRESHOLD && r.metadata)
      .map((r) => ({
        docId: (r.metadata?.docId as string) || r.id,
        docType: (r.metadata?.docType as string) || 'unknown',
        chunkIndex: (r.metadata?.chunkIndex as number) || 0,
        text: (r.metadata?.chunkText as string) || '',
        metadata: r.metadata || {},
        score: r.score,
      }))

    const seen = new Set<string>()
    const deduplicated: RetrievedChunk[] = []
    for (const item of scored) {
      const key = `${item.docId}:${item.chunkIndex}`
      if (!seen.has(key)) {
        seen.add(key)
        deduplicated.push(item)
      }
    }

    return deduplicated.slice(0, topK)
  } catch (error) {
    console.warn('[RAG] Retrieval failed', error)
    return []
  }
}

export function formatContext(results: RetrievedChunk[]): string {
  if (results.length === 0) return ''

  const sections: string[] = ['=== RETRIEVED CONTEXT ===']
  const seenTypes = new Map<string, { title: string; text: string }[]>()

  for (const chunk of results) {
    const typeLabel = chunk.docType.charAt(0).toUpperCase() + chunk.docType.slice(1)
    const title = (chunk.metadata?.title as string) || chunk.metadata?.name as string || chunk.docId
    const key = `${typeLabel}: ${title}`

    if (!seenTypes.has(key)) {
      seenTypes.set(key, [])
    }
    seenTypes.get(key)!.push({ title: key, text: chunk.text })
  }

  for (const [, entries] of seenTypes) {
    const header = entries[0].title
    sections.push(`\nFrom ${header}:`)
    for (const entry of entries) {
      if (entry.text) {
        sections.push(entry.text)
      }
    }
  }

  sections.push('\n=== END CONTEXT ===')
  return sections.join('\n')
}

export { isVectorStoreConfigured as isRagConfigured }
