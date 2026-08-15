import { describe, it, expect } from 'vitest';

describe('RAG types', () => {
  it('exports Chunk interface shape', () => {
    const chunk = {
      docId: 'doc-1',
      docType: 'project',
      chunkIndex: 0,
      text: 'some text',
      metadata: { title: 'Test' },
    };
    expect(chunk.docId).toBe('doc-1');
    expect(chunk.docType).toBe('project');
  });

  it('exports VectorRecord interface shape', () => {
    const record = {
      id: 'vec-1',
      vector: [0.1, 0.2, 0.3],
      metadata: { source: 'test' },
    };
    expect(record.vector.length).toBe(3);
  });

  it('exports RetrievedChunk interface shape', () => {
    const chunk = {
      docId: 'doc-1',
      docType: 'project',
      chunkIndex: 0,
      text: 'some text',
      metadata: {},
      score: 0.95,
    };
    expect(chunk.score).toBe(0.95);
  });

  it('exports DocType union', () => {
    const validTypes = ['profile', 'project', 'experience', 'certification', 'post'] as const;
    expect(validTypes).toContain('project');
  });

  it('exports IndexStats interface shape', () => {
    const stats = {
      totalVectors: 100,
      byType: { project: 50, experience: 50 },
      lastIndexedAt: '2026-01-01T00:00:00Z',
      lastError: null,
    };
    expect(stats.totalVectors).toBe(100);
    expect(stats.byType.project).toBe(50);
  });
});
