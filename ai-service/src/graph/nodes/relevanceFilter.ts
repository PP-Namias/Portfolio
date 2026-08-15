import { getEnv } from '../../config/env';
import type { Citation, RagState, RetrievedChunk } from '../types';

const MIN_CHUNK_LENGTH = 20;

export function filterChunks(
  chunks: RetrievedChunk[],
  threshold: number,
  topK: number,
): { filtered: RetrievedChunk[]; citations: Citation[] } {
  const seen = new Set<string>();
  const filtered: RetrievedChunk[] = [];

  for (const chunk of chunks) {
    if (chunk.score < threshold) {
      continue;
    }
    const text = chunk.text.trim();
    if (!text || text.length < MIN_CHUNK_LENGTH) {
      continue;
    }
    const key = `${chunk.docId}:${chunk.chunkIndex}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    filtered.push({ ...chunk, text });
  }

  filtered.sort((a, b) => b.score - a.score);
  const top = filtered.slice(0, topK);

  const citations: Citation[] = top.map((chunk, index) => ({
    index: index + 1,
    docId: chunk.docId,
    docType: chunk.docType,
    title: (chunk.metadata.title as string) || chunk.docId,
    urlPath: (chunk.metadata.urlPath as string) || '/',
    score: chunk.score,
  }));

  return { filtered: top, citations };
}

export function relevanceFilterNode(state: RagState): Partial<RagState> {
  const env = getEnv();
  const { filtered, citations } = filterChunks(
    state.retrievedChunks,
    env.similarityThreshold,
    env.ragTopK,
  );
  return { filteredChunks: filtered, citations, status: 'relevance:done' };
}
