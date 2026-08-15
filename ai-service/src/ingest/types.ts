export type DocType =
  | 'profile'
  | 'about'
  | 'technology'
  | 'experience'
  | 'project'
  | 'certification'
  | 'post'
  | 'membership'
  | 'recommendation';

export interface ChunkMetadata {
  title?: string;
  slug?: string;
  category?: string;
  urlPath: string;
  updatedAt: string;
  tags?: string[];
  field?: string;
  chunkCount?: number;
}

export interface Chunk {
  docId: string;
  docType: DocType;
  chunkIndex: number;
  text: string;
  metadata: ChunkMetadata;
}

export interface SourceDocument {
  docType: DocType;
  id: string;
  title: string;
  updatedAt: string;
}

export interface IngestionStats {
  documents: number;
  chunks: number;
  skippedEmpty: number;
  deduplicated: number;
  byType: Record<string, number>;
  generatedAt: string;
}

export interface IngestionResult {
  chunks: Chunk[];
  stats: IngestionStats;
}
