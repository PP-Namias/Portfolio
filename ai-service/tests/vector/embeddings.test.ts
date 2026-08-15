import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockEmbedContent } = vi.hoisted(() => ({ mockEmbedContent: vi.fn() }));

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { embedContent: mockEmbedContent };
  },
}));

import { embedDocuments, embedText } from '../../src/vector/embeddings';

beforeAll(() => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
  process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  process.env.GOOGLE_GEMINI_API_KEY = 'test-key';
  process.env.AI_EMBEDDING_MODEL = 'gemini-embedding-001';
  process.env.AI_EMBEDDING_DIMENSIONS = '768';
});

afterAll(() => {
  vi.resetModules();
});

beforeEach(() => {
  mockEmbedContent.mockReset();
});

function respondWith(count: number, dims = 768): { embeddings: { values: number[] }[] } {
  const embeddings = Array.from({ length: count }, (_, index) => ({
    values: Array.from({ length: dims }, (_, d) => index * dims + d),
  }));
  return { embeddings };
}

describe('embeddings', () => {
  it('embeds a single query with RETRIEVAL_QUERY task type', async () => {
    mockEmbedContent.mockResolvedValue(respondWith(1));
    const vector = await embedText('who is namias');
    expect(vector).toHaveLength(768);
    expect(mockEmbedContent).toHaveBeenCalledWith({
      model: 'gemini-embedding-001',
      contents: 'who is namias',
      config: { taskType: 'RETRIEVAL_QUERY', outputDimensionality: 768 },
    });
  });

  it('batches documents into single API calls preserving order', async () => {
    const texts = Array.from({ length: 25 }, (_, index) => `doc ${index}`);
    mockEmbedContent.mockImplementation(async ({ contents }: { contents: string[] }) =>
      respondWith(contents.length),
    );

    const vectors = await embedDocuments(texts);

    expect(vectors).toHaveLength(25);
    expect(mockEmbedContent).toHaveBeenCalledTimes(3);
    const calls = mockEmbedContent.mock.calls as Array<[unknown]>;
    const first = calls[0]!;
    const second = calls[1]!;
    const third = calls[2]!;

    expect(first[0]).toMatchObject({
      contents: texts.slice(0, 10),
      config: { taskType: 'RETRIEVAL_DOCUMENT', outputDimensionality: 768 },
    });
    expect(second[0]).toMatchObject({ contents: texts.slice(10, 20) });
    expect(third[0]).toMatchObject({ contents: texts.slice(20, 25) });
    expect(vectors[0]).toEqual(Array.from({ length: 768 }, (_, d) => d));
    expect(vectors[9]).toEqual(Array.from({ length: 768 }, (_, d) => 9 * 768 + d));
    expect(vectors[10]).toEqual(Array.from({ length: 768 }, (_, d) => d));
  });

  it('returns an empty array without calling the API for no inputs', async () => {
    await expect(embedDocuments([])).resolves.toEqual([]);
    expect(mockEmbedContent).not.toHaveBeenCalled();
  });

  it('throws when a batch is incomplete', async () => {
    mockEmbedContent.mockResolvedValue(respondWith(2));
    await expect(embedDocuments(['a', 'b', 'c'])).rejects.toThrow('incomplete batch');
  });

  it('throws when embeddings carry no values', async () => {
    mockEmbedContent.mockResolvedValue({ embeddings: [{}] });
    await expect(embedText('x')).rejects.toThrow('Gemini embedding returned no values');
  });
});
