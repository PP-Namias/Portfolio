import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Chunk } from '@/lib/rag/types';

const mockGetCmsContent = vi.hoisted(() => vi.fn());
const mockChunkAllCmsContent = vi.hoisted(() => vi.fn());
const mockEmbedBatch = vi.hoisted(() => vi.fn());
const mockUpsertVectors = vi.hoisted(() => vi.fn());
const mockDeleteByMetadata = vi.hoisted(() => vi.fn());
const mockGetVectorCount = vi.hoisted(() => vi.fn());
const mockResetIndex = vi.hoisted(() => vi.fn());
const mockIsVectorStoreConfigured = vi.hoisted(() => vi.fn());

vi.mock('@/lib/cms-content.server', () => ({
  getCmsContent: mockGetCmsContent,
}));

vi.mock('@/lib/rag/chunker', () => ({
  chunkAllCmsContent: mockChunkAllCmsContent,
}));

vi.mock('@/lib/rag/embedder', () => ({
  embedBatch: mockEmbedBatch,
}));

vi.mock('@/lib/rag/vector-store', () => ({
  upsertVectors: mockUpsertVectors,
  deleteByMetadata: mockDeleteByMetadata,
  getVectorCount: mockGetVectorCount,
  resetIndex: mockResetIndex,
  isVectorStoreConfigured: mockIsVectorStoreConfigured,
}));

import { reindexAll, reindexDocument, deleteDocumentVectors, getStats, resetVectorIndex } from '@/lib/rag/indexer';

function makeChunk(docId: string, text: string, chunkIndex = 0): Chunk {
  return { docId, docType: 'project', chunkIndex, text, metadata: { title: 'Test' } };
}

describe('RAG Indexer', () => {
  beforeEach(() => {
    mockIsVectorStoreConfigured.mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('reindexAll', () => {
    it('reindexes all CMS content successfully', async () => {
      const chunks = [makeChunk('p1', 'Project 1'), makeChunk('p2', 'Project 2')];
      mockGetCmsContent.mockResolvedValue({} as any);
      mockChunkAllCmsContent.mockReturnValue(chunks);
      mockEmbedBatch.mockResolvedValue([
        { chunk: chunks[0], embedding: [0.1, 0.2] },
        { chunk: chunks[1], embedding: [0.3, 0.4] },
      ]);

      const result = await reindexAll();
      expect(result).toEqual({ indexed: 2, failed: 0 });
      expect(mockUpsertVectors).toHaveBeenCalledTimes(1);
      expect(mockUpsertVectors).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'project:p1:0', vector: [0.1, 0.2] }),
        ])
      );
    });

    it('returns zero when no chunks are produced', async () => {
      mockGetCmsContent.mockResolvedValue({} as any);
      mockChunkAllCmsContent.mockReturnValue([]);
      const result = await reindexAll();
      expect(result).toEqual({ indexed: 0, failed: 0 });
      expect(mockEmbedBatch).not.toHaveBeenCalled();
    });

    it('throws when vector store is not configured', async () => {
      mockIsVectorStoreConfigured.mockReturnValue(false);
      await expect(reindexAll()).rejects.toThrow('Vector store is not configured');
    });

    it('throws when no valid embeddings generated', async () => {
      mockGetCmsContent.mockResolvedValue({} as any);
      mockChunkAllCmsContent.mockReturnValue([makeChunk('p1', 'text')]);
      mockEmbedBatch.mockResolvedValue([]);
      await expect(reindexAll()).rejects.toThrow('No valid embeddings generated');
    });

    it('re-throws errors from dependencies', async () => {
      mockGetCmsContent.mockRejectedValue(new Error('CMS fetch failed'));
      await expect(reindexAll()).rejects.toThrow('CMS fetch failed');
    });
  });

  describe('reindexDocument', () => {
    it('reindexes a single document', async () => {
      mockGetCmsContent.mockResolvedValue({} as any);
      const chunks = [makeChunk('doc-1', 'text'), makeChunk('doc-1', 'more', 1)];
      mockChunkAllCmsContent.mockReturnValue(chunks);
      mockEmbedBatch.mockResolvedValue([
        { chunk: chunks[0], embedding: [0.1] },
        { chunk: chunks[1], embedding: [0.2] },
      ]);

      const result = await reindexDocument('project', 'doc-1');
      expect(result).toEqual({ indexed: 2 });
      expect(mockDeleteByMetadata).toHaveBeenCalledWith({ docId: 'doc-1' });
    });

    it('returns zero when no chunks match document', async () => {
      mockGetCmsContent.mockResolvedValue({} as any);
      mockChunkAllCmsContent.mockReturnValue([]);
      const result = await reindexDocument('project', 'nonexistent');
      expect(result).toEqual({ indexed: 0 });
    });
  });

  describe('deleteDocumentVectors', () => {
    it('deletes vectors by docId', async () => {
      await deleteDocumentVectors('doc-1');
      expect(mockDeleteByMetadata).toHaveBeenCalledWith({ docId: 'doc-1' });
    });

    it('skips deletion when vector store not configured', async () => {
      mockIsVectorStoreConfigured.mockReturnValue(false);
      await deleteDocumentVectors('doc-1');
      expect(mockDeleteByMetadata).not.toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('returns zero stats when vector store not configured', async () => {
      mockIsVectorStoreConfigured.mockReturnValue(false);
      const stats = await getStats();
      expect(stats.totalVectors).toBe(0);
    });

    it('returns total vector count when configured', async () => {
      mockGetVectorCount.mockResolvedValue(42);
      const stats = await getStats();
      expect(stats.totalVectors).toBe(42);
    });

    it('returns zero on error', async () => {
      mockGetVectorCount.mockRejectedValue(new Error('DB error'));
      const stats = await getStats();
      expect(stats.totalVectors).toBe(0);
    });
  });

  describe('resetVectorIndex', () => {
    it('resets the vector index', async () => {
      await resetVectorIndex();
      expect(mockResetIndex).toHaveBeenCalled();
    });

    it('skips reset when vector store not configured', async () => {
      mockIsVectorStoreConfigured.mockReturnValue(false);
      await resetVectorIndex();
      expect(mockResetIndex).not.toHaveBeenCalled();
    });
  });
});
