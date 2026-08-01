import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  buildVectorId,
  deleteByMetadata,
  deleteVectors,
  getVectorCount,
  queryVectors,
  upsertVectors,
} from '../../src/vector/upstash-store';

const mockFetch = vi.fn();

beforeAll(() => {
  vi.stubGlobal('fetch', mockFetch);
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
  process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  process.env.GOOGLE_GEMINI_API_KEY = 'test-key';
  process.env.UPSTASH_VECTOR_URL = 'https://test.upstash.io/';
  process.env.UPSTASH_VECTOR_TOKEN = 'test-token';
});

afterAll(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  mockFetch.mockReset();
});

function mockResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as unknown as Response;
}

describe('upstash-store', () => {
  it('builds namespaced vector ids', () => {
    const chunk = {
      docId: 'project:my-slug',
      docType: 'project' as const,
      chunkIndex: 2,
      text: 'text',
      metadata: { urlPath: '/projects/my-slug', updatedAt: '2026-01-01T00:00:00Z' },
    };
    expect(buildVectorId(chunk)).toBe('aisvc:project:project:my-slug:2');
  });

  it('upserts vectors with auth headers and trims trailing slash', async () => {
    mockFetch.mockResolvedValue(mockResponse({}));
    await upsertVectors([{ id: 'aisvc:project:a:0', vector: [0.1, 0.2] }]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0]!;
    expect(url).toBe('https://test.upstash.io/upsert');
    expect(init.headers.Authorization).toBe('Bearer test-token');
    expect(init.body).toContain('aisvc:project:a:0');
  });

  it('skips empty upserts', async () => {
    await upsertVectors([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('queries vectors and maps results', async () => {
    mockFetch.mockResolvedValue(
      mockResponse({ result: [{ id: 'aisvc:project:a:0', score: 0.85, metadata: { docId: 'project:a' } }] }),
    );
    const results = await queryVectors([0.1, 0.2], 5);
    expect(results).toHaveLength(1);
    expect(results[0]!.score).toBe(0.85);
    const [url, init] = mockFetch.mock.calls[0]!;
    expect(url).toBe('https://test.upstash.io/query');
    expect(JSON.parse(init.body)).toMatchObject({ topK: 5, includeMetadata: true });
    expect(JSON.parse(init.body).filter).toBe('namespace = "aisvc"');
  });

  it('deletes by ids and by metadata filter', async () => {
    mockFetch.mockResolvedValue(mockResponse({}));
    await deleteVectors(['a', 'b']);
    await deleteByMetadata({ docId: 'project:gone' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[1]![0]).toBe('https://test.upstash.io/delete');
    expect(JSON.parse(mockFetch.mock.calls[1]![1].body)).toEqual({ filter: { docId: 'project:gone' } });
  });

  it('returns zero count when info fails', async () => {
    mockFetch.mockResolvedValue(mockResponse({}, false, 500));
    await expect(getVectorCount()).resolves.toBe(0);
  });

  it('parses vectorCount from the info response', async () => {
    mockFetch.mockResolvedValue(mockResponse({ result: { vectorCount: 42, dimension: 768 } }));
    await expect(getVectorCount()).resolves.toBe(42);
  });

  it('throws descriptive errors on failed requests', async () => {
    mockFetch.mockResolvedValue(mockResponse({ message: 'nope' }, false, 401));
    await expect(upsertVectors([{ id: 'x', vector: [1] }])).rejects.toThrow('Upstash Vector /upsert failed (401)');
  });
});
