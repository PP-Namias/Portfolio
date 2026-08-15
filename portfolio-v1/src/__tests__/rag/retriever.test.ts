import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockEmbedText = vi.hoisted(() => vi.fn());
const mockQueryVectors = vi.hoisted(() => vi.fn());

vi.mock('@/lib/rag/embedder', () => ({
  embedText: mockEmbedText,
}));

vi.mock('@/lib/rag/vector-store', () => ({
  queryVectors: mockQueryVectors,
  isVectorStoreConfigured: vi.fn(() => true),
}));

import { retrieve, formatContext } from '@/lib/rag/retriever';

describe('retriever', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array for empty query', async () => {
    const results = await retrieve('');
    expect(results).toEqual([]);
  });

  it('returns empty array when no results meet threshold', async () => {
    mockEmbedText.mockResolvedValue([0.1, 0.2]);
    mockQueryVectors.mockResolvedValue([
      { id: 'test-1', score: 0.5, metadata: { docId: 'proj:test', docType: 'project', chunkText: 'Some text' } },
    ]);
    const results = await retrieve('test query');
    expect(results).toEqual([]);
  });

  it('returns deduplicated results sorted by score', async () => {
    mockEmbedText.mockResolvedValue([0.1, 0.2]);
    mockQueryVectors.mockResolvedValue([
      { id: 'a:0', score: 0.95, metadata: { docId: 'proj:a', docType: 'project', chunkText: 'Project A text', title: 'Project A' } },
      { id: 'b:0', score: 0.88, metadata: { docId: 'proj:b', docType: 'project', chunkText: 'Project B text', title: 'Project B' } },
      { id: 'a:0', score: 0.82, metadata: { docId: 'proj:a', docType: 'project', chunkText: 'Project A text', title: 'Project A' } },
    ]);
    const results = await retrieve('test', 5);
    expect(results).toHaveLength(2);
    expect(results[0].docId).toBe('proj:a');
    expect(results[1].docId).toBe('proj:b');
  });

  it('handles embedder errors gracefully', async () => {
    mockEmbedText.mockRejectedValue(new Error('API error'));
    const results = await retrieve('test query');
    expect(results).toEqual([]);
  });

  it('handles query errors gracefully', async () => {
    mockEmbedText.mockResolvedValue([0.1, 0.2]);
    mockQueryVectors.mockRejectedValue(new Error('Store error'));
    const results = await retrieve('test query');
    expect(results).toEqual([]);
  });
});

describe('formatContext', () => {
  it('returns empty string for empty results', () => {
    expect(formatContext([])).toBe('');
  });

  it('formats results into context block', () => {
    const results = [
      {
        docId: 'proj:a',
        docType: 'project',
        chunkIndex: 0,
        text: 'Project A is a web app.',
        metadata: { title: 'Project A' },
        score: 0.95,
      },
      {
        docId: 'exp:b',
        docType: 'experience',
        chunkIndex: 0,
        text: 'Worked at Company B.',
        metadata: { company: 'Company B', position: 'Developer' },
        score: 0.88,
      },
    ];

    const formatted = formatContext(results);
    expect(formatted).toContain('RETRIEVED CONTEXT');
    expect(formatted).toContain('Project A');
    expect(formatted).toContain('Company B');
    expect(formatted).toContain('END CONTEXT');
  });
});
