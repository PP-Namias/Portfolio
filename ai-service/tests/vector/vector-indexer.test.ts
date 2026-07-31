import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/vector/upstash-store', () => ({
  buildVectorId: (chunk: { docType: string; docId: string; chunkIndex: number }) =>
    `aisvc:${chunk.docType}:${chunk.docId}:${chunk.chunkIndex}`,
  deleteByMetadata: vi.fn(async () => {}),
  getVectorCount: vi.fn(async () => 0),
  resetIndex: vi.fn(async () => {}),
  upsertVectors: vi.fn(async () => {}),
}));

vi.mock('../../src/vector/embeddings', () => ({
  embedDocuments: vi.fn(async (texts: string[]) => texts.map((text) => [text.length])),
}));

vi.mock('../../src/ingest/indexer', () => ({
  prepareKnowledgeBase: vi.fn(),
}));

import type { Chunk } from '../../src/ingest/types';
import { prepareKnowledgeBase } from '../../src/ingest/indexer';
import { embedDocuments } from '../../src/vector/embeddings';
import {
  incrementalIndex,
  loadIndexState,
  reindexAll,
  saveIndexState,
} from '../../src/vector/indexer';
import { deleteByMetadata, upsertVectors, type UpstashVectorRecord } from '../../src/vector/upstash-store';

const mockPrepare = vi.mocked(prepareKnowledgeBase);
const mockUpsert = vi.mocked(upsertVectors);
const mockDeleteByMetadata = vi.mocked(deleteByMetadata);

beforeAll(() => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
  process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  process.env.GOOGLE_GEMINI_API_KEY = 'test-key';
  process.env.UPSTASH_VECTOR_URL = 'https://test.upstash.io';
  process.env.UPSTASH_VECTOR_TOKEN = 'test-token';
});

beforeEach(async () => {
  vi.clearAllMocks();
  await saveIndexState({ version: 1, lastIndexedAt: null, documents: {} });
});

function makeChunks(): Chunk[] {
  return [
    {
      docId: 'project:one',
      docType: 'project',
      chunkIndex: 0,
      text: 'Project one summary',
      metadata: { urlPath: '/projects/one', updatedAt: '2026-01-01T00:00:00Z' },
    },
    {
      docId: 'post:two',
      docType: 'post',
      chunkIndex: 0,
      text: 'Post two body',
      metadata: { urlPath: '/blog/two', updatedAt: '2026-01-02T00:00:00Z', title: 'Two' },
    },
  ];
}

describe('vector indexer', () => {
  it('full reindex embeds, upserts, and persists state', async () => {
    mockPrepare.mockResolvedValue({
      chunks: makeChunks(),
      stats: {
        documents: 2,
        chunks: 2,
        skippedEmpty: 0,
        deduplicated: 0,
        byType: { project: 1, post: 1 },
        generatedAt: '2026-01-01T00:00:00Z',
      },
    });

    const result = await reindexAll();

    expect(result.mode).toBe('full');
    expect(result.indexed).toBe(2);
    expect(embedDocuments).toHaveBeenCalledWith(['Project one summary', 'Post two body']);
    expect(mockUpsert).toHaveBeenCalledTimes(1);
    const records = mockUpsert.mock.calls[0]![0] as UpstashVectorRecord[];
    expect(records[0]!.id).toBe('aisvc:project:project:one:0');
    expect(records[0]!.metadata).toMatchObject({ docId: 'project:one', urlPath: '/projects/one' });

    const state = await loadIndexState();
    expect(state.documents).toEqual({
      'project:one': '2026-01-01T00:00:00Z',
      'post:two': '2026-01-02T00:00:00Z',
    });
    expect(state.lastIndexedAt).not.toBeNull();
  });

  it('full reindex with reset clears the index first', async () => {
    mockPrepare.mockResolvedValue({
      chunks: makeChunks(),
      stats: { documents: 2, chunks: 2, skippedEmpty: 0, deduplicated: 0, byType: {}, generatedAt: 'x' },
    });
    const { resetIndex } = await import('../../src/vector/upstash-store');
    await reindexAll({ reset: true });
    expect(vi.mocked(resetIndex)).toHaveBeenCalledTimes(1);
  });

  it('dry run does not upsert or persist state', async () => {
    mockPrepare.mockResolvedValue({
      chunks: makeChunks(),
      stats: { documents: 2, chunks: 2, skippedEmpty: 0, deduplicated: 0, byType: {}, generatedAt: 'x' },
    });

    const result = await reindexAll({ dryRun: true });

    expect(result.mode).toBe('dry-run');
    expect(mockUpsert).not.toHaveBeenCalled();
    const state = await loadIndexState();
    expect(state.documents).toEqual({});
  });

  it('incremental index embeds only changed docs and deletes removed ones', async () => {
    await saveIndexState({
      version: 1,
      lastIndexedAt: '2026-01-02T00:00:00Z',
      documents: {
        'project:one': '2026-01-01T00:00:00Z',
        'post:two': '2026-01-02T00:00:00Z',
        'post:gone': '2026-01-01T00:00:00Z',
      },
    });

    mockPrepare.mockResolvedValue({
      chunks: [
        {
          docId: 'project:one',
          docType: 'project',
          chunkIndex: 0,
          text: 'Project one summary',
          metadata: { urlPath: '/projects/one', updatedAt: '2026-02-01T00:00:00Z' },
        },
        {
          docId: 'post:two',
          docType: 'post',
          chunkIndex: 0,
          text: 'Post two body',
          metadata: { urlPath: '/blog/two', updatedAt: '2026-01-02T00:00:00Z', title: 'Two' },
        },
      ],
      stats: {
        documents: 2,
        chunks: 2,
        skippedEmpty: 0,
        deduplicated: 0,
        byType: { project: 1, post: 1 },
        generatedAt: '2026-01-01T00:00:00Z',
      },
    });

    const result = await incrementalIndex();

    expect(result.indexed).toBe(1);
    expect(result.removed).toBe(1);
    expect(result.skipped).toBe(1);
    expect(embedDocuments).toHaveBeenCalledWith(['Project one summary']);
    expect(mockDeleteByMetadata).toHaveBeenCalledWith({ docId: 'post:gone' });
    expect(mockDeleteByMetadata).toHaveBeenCalledWith({ docId: 'project:one' });

    const state = await loadIndexState();
    expect(Object.keys(state.documents).sort()).toEqual(['post:two', 'project:one']);
  });

  it('incremental index with empty state treats every doc as new', async () => {
    mockPrepare.mockResolvedValue({
      chunks: makeChunks(),
      stats: { documents: 2, chunks: 2, skippedEmpty: 0, deduplicated: 0, byType: {}, generatedAt: 'x' },
    });

    const result = await incrementalIndex();

    expect(result.indexed).toBe(2);
    expect(result.removed).toBe(0);
    expect(embedDocuments).toHaveBeenCalledTimes(1);
  });
});
