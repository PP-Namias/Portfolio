export interface Chunk {
  docId: string
  docType: string
  chunkIndex: number
  text: string
  metadata: Record<string, unknown>
}

export interface VectorRecord {
  id: string
  vector: number[]
  metadata: Record<string, unknown>
}

export interface RetrievedChunk {
  docId: string
  docType: string
  chunkIndex: number
  text: string
  metadata: Record<string, unknown>
  score: number
}

export type DocType =
  | 'profile'
  | 'project'
  | 'experience'
  | 'certification'
  | 'post'
  | 'technology'
  | 'membership'
  | 'recommendation'
  | 'aboutSection'
  | 'galleryImage'

export interface IndexStats {
  totalVectors: number
  byType: Record<string, number>
  lastIndexedAt: string | null
  lastError: string | null
}
