import { beforeAll, describe, expect, it } from 'vitest';

import { classifyIntentKeywords } from '../../src/graph/nodes/analyzeIntent';
import { buildRagSystemPrompt } from '../../src/graph/nodes/generate';
import { filterChunks } from '../../src/graph/nodes/relevanceFilter';
import { buildNoAnswerResponse, extractCitationIndices, validateNode } from '../../src/graph/nodes/validate';
import type { RetrievedChunk } from '../../src/graph/types';

beforeAll(() => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
  process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  process.env.GOOGLE_GEMINI_API_KEY = 'test-key';
});

function makeChunk(overrides: Partial<RetrievedChunk>): RetrievedChunk {
  return {
    id: 'aisvc:project:p1:0',
    docId: 'p1',
    docType: 'project',
    chunkIndex: 0,
    text: 'A sufficiently long chunk text about the project.',
    score: 0.85,
    metadata: { title: 'Project One', urlPath: '/projects/p1' },
    ...overrides,
  };
}

describe('classifyIntentKeywords', () => {
  it('detects greetings', () => {
    expect(classifyIntentKeywords('Hello there!')).toBe('greeting');
  });

  it('detects contact intent', () => {
    expect(classifyIntentKeywords('How can I hire PP Namias?')).toBe('contact');
  });

  it('detects off-topic intent', () => {
    expect(classifyIntentKeywords('What is the weather today?')).toBe('off_topic');
  });

  it('detects portfolio intent', () => {
    expect(classifyIntentKeywords('Which frameworks did you build projects with?')).toBe('portfolio');
  });

  it('defaults to general', () => {
    expect(classifyIntentKeywords('How do I approach complex problems?')).toBe('general');
  });
});

describe('filterChunks', () => {
  it('drops low-score, short, and duplicate chunks and returns citations', () => {
    const chunks = [
      makeChunk({ id: 'a', score: 0.9, text: 'Top relevant project content here.' }),
      makeChunk({ id: 'a2', docId: 'p1', chunkIndex: 0, score: 0.8, text: 'Duplicate of a.' }),
      makeChunk({ id: 'b', score: 0.4, text: 'Below threshold, should be dropped.' }),
      makeChunk({ id: 'c', score: 0.75, text: 'Tiny' }),
      makeChunk({ id: 'd', docType: 'post', docId: 'post1', score: 0.75, metadata: { title: 'A Blog Post', urlPath: '/blog/post1' }, text: 'A blog post chunk with enough length to survive.' }),
    ];

    const { filtered, citations } = filterChunks(chunks, 0.6, 6);

    expect(filtered.map((c) => c.id)).toEqual(['a', 'd']);
    expect(filtered[0]?.text).toBe('Top relevant project content here.');
    expect(citations).toEqual([
      { index: 1, docId: 'p1', docType: 'project', title: 'Project One', urlPath: '/projects/p1', score: 0.9 },
      { index: 2, docId: 'post1', docType: 'post', title: 'A Blog Post', urlPath: '/blog/post1', score: 0.75 },
    ]);
  });

  it('respects topK and sorts by score descending', () => {
    const chunks = [
      makeChunk({ id: 'low', score: 0.61 }),
      makeChunk({ id: 'mid', docId: 'm', score: 0.7 }),
      makeChunk({ id: 'high', docId: 'h', score: 0.95 }),
    ];
    const { filtered } = filterChunks(chunks, 0.6, 2);
    expect(filtered.map((c) => c.id)).toEqual(['high', 'mid']);
  });

  it('returns empty results for empty input', () => {
    const { filtered, citations } = filterChunks([], 0.6, 6);
    expect(filtered).toEqual([]);
    expect(citations).toEqual([]);
  });
});

describe('extractCitationIndices', () => {
  it('extracts unique numeric markers', () => {
    expect(extractCitationIndices('See [1] and [2] and again [1].')).toEqual([1, 2]);
  });

  it('returns empty when no markers', () => {
    expect(extractCitationIndices('No markers here.')).toEqual([]);
  });
});

describe('buildNoAnswerResponse', () => {
  it('mentions available topics when chunks exist', () => {
    const response = buildNoAnswerResponse({
      filteredChunks: [makeChunk({}), makeChunk({ docType: 'post' })],
    } as never);
    expect(response).toContain('project');
    expect(response).toContain('post');
  });

  it('returns generic message without chunks', () => {
    const response = buildNoAnswerResponse({ filteredChunks: [] } as never);
    expect(response).toContain("I don't have that information");
  });
});

describe('buildRagSystemPrompt', () => {
  it('includes context chunks with markers', () => {
    const prompt = buildRagSystemPrompt('question', [makeChunk({})]);
    expect(prompt).toContain('[1]');
    expect(prompt).toContain('=== CONTEXT ===');
  });

  it('omits context without chunks', () => {
    const prompt = buildRagSystemPrompt('question', []);
    expect(prompt).not.toContain('=== CONTEXT ===');
  });
});

describe('validateNode', () => {
  const baseState = {
    filteredChunks: [],
    citations: [],
    response: '',
  };

  it('falls back to a no-answer response when generation failed', () => {
    const result = validateNode({ ...baseState, response: '   ' } as never);
    expect(result.response).toContain("I don't have that information");
    expect(result.status).toBe('validate:no-answer-fallback');
    expect(result.validated).toBe(true);
  });

  it('strips citation markers that do not map to retrieved chunks', () => {
    const state = {
      ...baseState,
      filteredChunks: [makeChunk({})],
      citations: [{ index: 1, docId: 'p1', docType: 'project', title: 'P1', urlPath: '/', score: 0.9 }],
      response: 'Claim from [1] and bogus [9].',
    };
    const result = validateNode(state as never);
    expect(result.response).toBe('Claim from [1] and bogus .');
    expect(result.status).toBe('validate:done');
  });

  it('appends a sources line when no marker is cited', () => {
    const state = {
      ...baseState,
      filteredChunks: [makeChunk({})],
      citations: [{ index: 1, docId: 'p1', docType: 'project', title: 'Project One', urlPath: '/', score: 0.9 }],
      response: 'A claim without a marker.',
    };
    const result = validateNode(state as never);
    expect(result.response).toContain('Sources: [1] Project One');
    expect(result.status).toBe('validate:done');
  });

  it('passes through a validated response unchanged', () => {
    const state = {
      ...baseState,
      filteredChunks: [makeChunk({})],
      citations: [{ index: 1, docId: 'p1', docType: 'project', title: 'P1', urlPath: '/', score: 0.9 }],
      response: 'Grounded claim [1].',
    };
    const result = validateNode(state as never);
    expect(result.response).toBe('Grounded claim [1].');
    expect(result.validated).toBe(true);
  });
});
