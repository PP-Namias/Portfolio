import { GoogleGenerativeAI, type EmbedContentRequest } from '@google/generative-ai'
import { Chunk } from './types'

const EMBEDDING_MODEL = 'gemini-embedding-001'

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not configured')
  }
  return new GoogleGenerativeAI(apiKey)
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function embedText(text: string): Promise<number[]> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL })

  const result = await model.embedContent({
    content: { role: 'user', parts: [{ text }] },
  } as EmbedContentRequest)
  const embedding = result.embedding

  if (!embedding?.values) {
    throw new Error('Gemini embedding returned no values')
  }

  return embedding.values
}

export async function embedBatch(chunks: Chunk[]): Promise<Array<{ chunk: Chunk; embedding: number[] }>> {
  const results: Array<{ chunk: Chunk; embedding: number[] }> = []
  const batchSize = 10

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)

    const batchResults = await Promise.all(
      batch.map(async (chunk) => {
        try {
          const embedding = await embedText(chunk.text)
          return { chunk, embedding }
        } catch (error) {
          console.warn('[RAG] Embedding failed for chunk', chunk.docId, chunk.chunkIndex, error)
          return null
        }
      })
    )

    for (const result of batchResults) {
      if (result) {
        results.push(result)
      }
    }

    if (i + batchSize < chunks.length) {
      await sleep(200)
    }
  }

  return results
}
