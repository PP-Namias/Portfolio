import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Reload module with mocked fetch
import { upsertVectors, queryVectors, deleteVectors, deleteByMetadata, getVectorCount, resetIndex, isVectorStoreConfigured } from '@/lib/rag/vector-store';

describe('vector-store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('UPSTASH_VECTOR_URL', 'https://test.upstash.io/vector');
    vi.stubEnv('UPSTASH_VECTOR_TOKEN', 'test-token');
  });

  it('isVectorStoreConfigured returns false when env vars missing', () => {
    vi.stubEnv('UPSTASH_VECTOR_URL', '');
    vi.stubEnv('UPSTASH_VECTOR_TOKEN', '');
    expect(isVectorStoreConfigured()).toBe(false);
  });

  it('isVectorStoreConfigured returns true when env vars present', () => {
    expect(isVectorStoreConfigured()).toBe(true);
  });

  it('upsertVectors sends POST with correct body', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));
    await upsertVectors([{ id: 'test-1', vector: [0.1, 0.2], metadata: { docType: 'project' } }]);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://test.upstash.io/vector/upsert',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        }),
        body: expect.stringContaining('test-1'),
      })
    );
  });

  it('upsertVectors skips empty arrays', async () => {
    await upsertVectors([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('queryVectors returns results', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ results: [{ id: 'test-1', score: 0.95, metadata: { docType: 'project' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    const results = await queryVectors([0.1, 0.2], 5);
    expect(results).toHaveLength(1);
    expect(results[0].score).toBe(0.95);
  });

  it('queryVectors throws on error response', async () => {
    mockFetch.mockResolvedValueOnce(new Response('Bad Request', { status: 400 }));
    await expect(queryVectors([0.1, 0.2])).rejects.toThrow();
  });

  it('deleteVectors sends POST with ids', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));
    await deleteVectors(['test-1', 'test-2']);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/delete'),
      expect.objectContaining({
        body: expect.stringContaining('test-1'),
      })
    );
  });

  it('deleteByMetadata sends POST with filter', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));
    await deleteByMetadata({ docId: 'test-1' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/delete'),
      expect.objectContaining({
        body: expect.stringContaining('"filter"'),
      })
    );
  });

  it('getVectorCount returns total', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ total: 42 }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    const count = await getVectorCount();
    expect(count).toBe(42);
  });

  it('resetIndex calls reset endpoint', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));
    await resetIndex();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/reset'),
      expect.any(Object)
    );
  });
});
