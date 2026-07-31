import type { Chunk, SourceDocument } from './types';

export function djb2Hash(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

export function dedupeByLatest<T extends SourceDocument>(docs: T[]): { docs: T[]; removed: number } {
  const latest = new Map<string, T>();
  let removed = 0;

  for (const doc of docs) {
    const existing = latest.get(doc.id);
    if (!existing || doc.updatedAt >= existing.updatedAt) {
      latest.set(doc.id, doc);
      if (existing) {
        removed++;
      }
    } else {
      removed++;
    }
  }

  return { docs: [...latest.values()], removed };
}

export function dedupeChunks(chunks: Chunk[]): { chunks: Chunk[]; removed: number } {
  const seen = new Set<string>();
  const result: Chunk[] = [];
  let removed = 0;

  for (const chunk of chunks) {
    if (!chunk.text) {
      removed++;
      continue;
    }

    const key = `${chunk.docId}:${chunk.chunkIndex}:${djb2Hash(chunk.text)}`;
    if (seen.has(key)) {
      removed++;
      continue;
    }
    seen.add(key);
    result.push(chunk);
  }

  return { chunks: result, removed };
}

export function isStaleDoc(updatedAt: string, cutoffIso: string): boolean {
  return updatedAt < cutoffIso;
}
