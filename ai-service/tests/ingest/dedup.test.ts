import { describe, expect, it } from 'vitest';

import { dedupeByLatest, dedupeChunks, djb2Hash, isStaleDoc } from '../../src/ingest/dedup';
import type { Chunk } from '../../src/ingest/types';
import type { SourceDocument } from '../../src/ingest/types';

function makeSourceDoc(id: string, updatedAt: string): SourceDocument {
  return { docType: 'project', id, title: id, updatedAt };
}

function makeChunk(docId: string, chunkIndex: number, text: string): Chunk {
  return {
    docId,
    docType: 'project',
    chunkIndex,
    text,
    metadata: { urlPath: '/', updatedAt: '2026-01-01T00:00:00Z' },
  };
}

describe('dedup', () => {
  it('keeps the latest version of duplicate source documents', () => {
    const { docs, removed } = dedupeByLatest([
      makeSourceDoc('a', '2026-01-01T00:00:00Z'),
      makeSourceDoc('a', '2026-02-01T00:00:00Z'),
      makeSourceDoc('b', '2026-01-01T00:00:00Z'),
    ]);
    expect(removed).toBe(1);
    expect(docs).toHaveLength(2);
    expect(docs.find((d) => d.id === 'a')?.updatedAt).toBe('2026-02-01T00:00:00Z');
  });

  it('removes duplicate and empty chunks', () => {
    const { chunks, removed } = dedupeChunks([
      makeChunk('p:1', 0, 'same text'),
      makeChunk('p:1', 0, 'same text'),
      makeChunk('p:2', 0, ''),
      makeChunk('p:2', 0, 'different'),
    ]);
    expect(removed).toBe(2);
    expect(chunks).toHaveLength(2);
  });

  it('produces stable hashes', () => {
    expect(djb2Hash('hello')).toBe(djb2Hash('hello'));
    expect(djb2Hash('hello')).not.toBe(djb2Hash('world'));
  });

  it('detects stale documents against a cutoff', () => {
    expect(isStaleDoc('2026-01-01T00:00:00Z', '2026-06-01T00:00:00Z')).toBe(true);
    expect(isStaleDoc('2026-07-01T00:00:00Z', '2026-06-01T00:00:00Z')).toBe(false);
  });
});
