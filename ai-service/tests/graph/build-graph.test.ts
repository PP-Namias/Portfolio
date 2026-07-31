import { AIMessage } from '@langchain/core/messages';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/graph/llm', () => ({
  createChatModel: vi.fn(),
  createChatModelWithFallback: vi.fn(),
}));

vi.mock('../../src/vector/embeddings', () => ({
  embedText: vi.fn(async () => [0.1, 0.2, 0.3]),
  embedDocuments: vi.fn(),
}));

vi.mock('../../src/vector/upstash-store', () => ({
  queryVectors: vi.fn(),
}));

import { buildRagGraph, runRag } from '../../src/graph/build-graph';
import { createChatModelWithFallback } from '../../src/graph/llm';
import { embedText } from '../../src/vector/embeddings';
import { queryVectors } from '../../src/vector/upstash-store';

const mockModel = vi.mocked(createChatModelWithFallback);
const mockQuery = vi.mocked(queryVectors);
const mockEmbed = vi.mocked(embedText);

function fakeModel() {
  return {
    invoke: vi.fn(async (messages: Array<{ content: unknown }>) => {
      const text = messages.map((m) => String(m.content)).join('\n');
      if (text.includes('User query:')) {
        return new AIMessage('{"intent": "portfolio", "reformulatedQuery": "rewritten portfolio query"}');
      }
      return new AIMessage('PP Namias built several projects with modern stacks [1] and [2].');
    }),
  };
}

function fakeChunk(score: number, chunkIndex = 0) {
  return {
    id: `aisvc:project:p1:${chunkIndex}:${score}`,
    score,
    metadata: {
      docId: 'p1',
      docType: 'project',
      chunkIndex,
      chunkText: `A rich chunk about a project with enough context length to pass the quality filter (score ${score}).`,
      title: 'Project One',
      urlPath: '/projects/p1',
    },
  };
}

beforeAll(() => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
  process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  process.env.GOOGLE_GEMINI_API_KEY = 'test-key';
  process.env.UPSTASH_VECTOR_URL = 'https://test.upstash.io/';
  process.env.UPSTASH_VECTOR_TOKEN = 'test-token';
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockModel.mockImplementation(() => fakeModel() as never);
});

describe('buildRagGraph', () => {
  it('routes portfolio queries through retrieval and returns citations', async () => {
    mockQuery.mockResolvedValue([fakeChunk(0.9, 0), fakeChunk(0.7, 1)] as never);

    const result = await runRag('What projects has PP Namias built?');

    expect(mockEmbed).toHaveBeenCalledWith('rewritten portfolio query');
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(result.intent).toBe('portfolio');
    expect(result.usedContext).toBe(true);
    expect(result.citations).toHaveLength(2);
    expect(result.citations[0]?.index).toBe(1);
    expect(result.response).toContain('projects');
    expect(result.validated).toBe(true);
    expect(result.status).toBe('validate:done');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('answers greetings conversationally without retrieval', async () => {
    mockModel.mockImplementation(() =>
      ({
        invoke: vi.fn(async (messages: Array<{ content: unknown }>) => {
          const text = messages.map((m) => String(m.content)).join('\n');
          if (text.includes('User query:')) {
            return new AIMessage('{"intent": "greeting", "reformulatedQuery": "hi"}');
          }
          return new AIMessage('Hello! Great to see you here.');
        }),
      }) as never,
    );

    const result = await runRag('Hi there!');

    expect(mockQuery).not.toHaveBeenCalled();
    expect(result.intent).toBe('greeting');
    expect(result.usedContext).toBe(false);
    expect(result.citations).toEqual([]);
    expect(result.response).toBe('Hello! Great to see you here.');
  });

  it('routes off-topic queries straight to the no-answer fallback', async () => {
    mockModel.mockImplementation(() =>
      ({
        invoke: vi.fn(async () => new AIMessage('{"intent": "off_topic", "reformulatedQuery": "weather"}')),
      }) as never,
    );

    const result = await runRag('What is the weather today?');

    expect(mockQuery).not.toHaveBeenCalled();
    expect(result.intent).toBe('off_topic');
    expect(result.status).toBe('validate:no-answer-fallback');
    expect(result.response).toContain("I don't have that information");
  });

  it('falls back to a no-answer response when retrieval yields nothing relevant', async () => {
    mockQuery.mockResolvedValue([fakeChunk(0.4)] as never);

    const result = await runRag('What projects has PP Namias built?');

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(result.usedContext).toBe(false);
    expect(result.status).toBe('validate:no-answer-fallback');
    expect(result.response).toContain('projects');
  });

  it('passes chat history through to the LLM', async () => {
    mockQuery.mockResolvedValue([] as never);
    const model = fakeModel();
    mockModel.mockImplementation(() => model as never);

    await runRag('Tell me more', [{ role: 'user', content: 'What is your name?' }]);

    const invoked = model.invoke.mock.calls[0]?.[0] as Array<{ content: unknown }>;
    expect(invoked.map((m) => String(m.content))).toContain('What is your name?');
  });

  it('compiles a graph instance with all nodes', () => {
    const graph = buildRagGraph();
    expect(graph).toBeDefined();
  });
});
