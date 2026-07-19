import { getCmsContent } from '@/lib/cms-content.server'
import { chunkAllCmsContent } from './chunker'
import { embedBatch } from './embedder'
import { upsertVectors, deleteByMetadata, getVectorCount, resetIndex, isVectorStoreConfigured } from './vector-store'
import { Chunk, IndexStats } from './types'

let lastIndexedAt: string | null = null
let lastError: string | null = null

function buildVectorId(chunk: Chunk): string {
  return `${chunk.docType}:${chunk.docId}:${chunk.chunkIndex}`
}

export async function reindexAll(): Promise<{ indexed: number; failed: number }> {
  if (!isVectorStoreConfigured()) {
    throw new Error('Vector store is not configured')
  }

  lastError = null
  let indexed = 0
  let failed = 0

  try {
    const cms = await getCmsContent()
    const chunks = chunkAllCmsContent(cms)

    if (chunks.length === 0) {
      lastIndexedAt = new Date().toISOString()
      return { indexed: 0, failed: 0 }
    }

    const embedded = await embedBatch(chunks)
    const validVectors = embedded
      .filter((e): e is { chunk: Chunk; embedding: number[] } => e !== null && e.embedding.length > 0)
      .map((e) => ({
        id: buildVectorId(e.chunk),
        vector: e.embedding,
        metadata: {
          docId: e.chunk.docId,
          docType: e.chunk.docType,
          chunkIndex: e.chunk.chunkIndex,
          chunkText: e.chunk.text.slice(0, 500),
          ...e.chunk.metadata,
          indexedAt: new Date().toISOString(),
        },
      }))

    if (validVectors.length === 0) {
      throw new Error('No valid embeddings generated')
    }

    await upsertVectors(validVectors)
    indexed = validVectors.length
    failed = chunks.length - embedded.length
    lastIndexedAt = new Date().toISOString()
  } catch (error) {
    lastError = error instanceof Error ? error.message : String(error)
    throw error
  }

  return { indexed, failed }
}

export async function reindexDocument(docType: string, docId: string): Promise<{ indexed: number }> {
  if (!isVectorStoreConfigured()) {
    throw new Error('Vector store is not configured')
  }

  try {
    await deleteDocumentVectors(docId)
  } catch {
    // Non-fatal — proceed to reindex
  }

  const cms = await getCmsContent()
  const allChunks = chunkAllCmsContent(cms)
  const docChunks = allChunks.filter((chunk) => chunk.docId === docId || chunk.docId.startsWith(`${docType}:`))

  if (docChunks.length === 0) {
    return { indexed: 0 }
  }

  const embedded = await embedBatch(docChunks)
  const validVectors = embedded
    .filter((e): e is { chunk: Chunk; embedding: number[] } => e !== null && e.embedding.length > 0)
    .map((e) => ({
      id: buildVectorId(e.chunk),
      vector: e.embedding,
      metadata: {
        docId: e.chunk.docId,
        docType: e.chunk.docType,
        chunkIndex: e.chunk.chunkIndex,
        chunkText: e.chunk.text.slice(0, 500),
        ...e.chunk.metadata,
        indexedAt: new Date().toISOString(),
      },
    }))

  if (validVectors.length > 0) {
    await upsertVectors(validVectors)
  }

  return { indexed: validVectors.length }
}

export async function deleteDocumentVectors(docId: string): Promise<void> {
  if (!isVectorStoreConfigured()) return
  await deleteByMetadata({ docId })
}

export async function getStats(): Promise<IndexStats> {
  if (!isVectorStoreConfigured()) {
    return { totalVectors: 0, byType: {}, lastIndexedAt, lastError }
  }

  try {
    const total = await getVectorCount()
    return {
      totalVectors: total,
      byType: {},
      lastIndexedAt,
      lastError,
    }
  } catch {
    return { totalVectors: 0, byType: {}, lastIndexedAt, lastError }
  }
}

export async function resetVectorIndex(): Promise<void> {
  if (!isVectorStoreConfigured()) return
  await resetIndex()
  lastIndexedAt = null
  lastError = null
}
