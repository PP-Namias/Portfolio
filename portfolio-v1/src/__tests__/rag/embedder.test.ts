import { describe, it, expect, vi } from 'vitest';
import type { Chunk } from '@/lib/rag/types';

const mockGeminiEmbedContent = vi.hoisted(() => vi.fn());

vi.mock('@google/generative-ai', () => {
  const mockModel = {
    embedContent: mockGeminiEmbedContent,
  };
  return {
    GoogleGenerativeAI: vi.fn(function () {
      return { getGenerativeModel: vi.fn(() => mockModel) };
    }),
  };
});

import { embedText, embedBatch } from '@/lib/rag/embedder';

function makeChunk(docId: string, text: string, index = 0): Chunk {
  return { docId, docType: 'project', chunkIndex: index, text, metadata: {} };
}

describe('RAG Embedder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('embedText', () => {
    it('returns embedding vector for text input', async () => {
      vi.stubEnv('GOOGLE_GEMINI_API_KEY', 'test-key');
      mockGeminiEmbedContent.mockResolvedValue({
        embedding: { values: [0.1, 0.2, 0.3] },
      });
      const result = await embedText('Hello world');
      expect(result).toEqual([0.1, 0.2, 0.3]);
    });

    it('throws when API key is missing', async () => {
      vi.stubEnv('GOOGLE_GEMINI_API_KEY', '');
      await expect(embedText('test')).rejects.toThrow('GOOGLE_GEMINI_API_KEY is not configured');
    });

    it('throws when embedding returns no values', async () => {
      vi.stubEnv('GOOGLE_GEMINI_API_KEY', 'test-key');
      mockGeminiEmbedContent.mockResolvedValue({
        embedding: { values: null },
      });
      await expect(embedText('test')).rejects.toThrow('Gemini embedding returned no values');
    });

    it('throws when API call fails', async () => {
      vi.stubEnv('GOOGLE_GEMINI_API_KEY', 'test-key');
      mockGeminiEmbedContent.mockRejectedValueOnce(new Error('API error'));
      await expect(embedText('test')).rejects.toThrow('API error');
    });
  });

  describe('embedBatch', () => {
    it('embeds a batch of chunks', async () => {
      vi.stubEnv('GOOGLE_GEMINI_API_KEY', 'test-key');
      mockGeminiEmbedContent.mockResolvedValue({ embedding: { values: [0.5, 0.6] } });
      const chunks = [makeChunk('a', 'text a'), makeChunk('b', 'text b')];
      const result = await embedBatch(chunks);
      expect(result).toHaveLength(2);
      expect(result[0].embedding).toEqual([0.5, 0.6]);
      expect(result[0].chunk.docId).toBe('a');
    });

    it('skips chunks that fail embedding', async () => {
      vi.stubEnv('GOOGLE_GEMINI_API_KEY', 'test-key');
      mockGeminiEmbedContent
        .mockResolvedValueOnce({ embedding: { values: [0.1] } })
        .mockRejectedValueOnce(new Error('fail'));
      const chunks = [makeChunk('a', 'ok'), makeChunk('b', 'fail')];
      const result = await embedBatch(chunks);
      expect(result).toHaveLength(1);
      expect(result[0].chunk.docId).toBe('a');
    });

    it('processes chunks in batches with delay', async () => {
      vi.stubEnv('GOOGLE_GEMINI_API_KEY', 'test-key');
      mockGeminiEmbedContent.mockResolvedValue({ embedding: { values: [0.1] } });
      const chunks = Array.from({ length: 12 }, (_, i) => makeChunk(`doc-${i}`, `text ${i}`, i));
      const result = await embedBatch(chunks);
      expect(result).toHaveLength(12);
    });
  });
});
