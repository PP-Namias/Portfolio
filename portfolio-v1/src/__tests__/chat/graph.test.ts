import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import type { ChatDataContext, ConversationHistoryMessage } from '@/app/api/chat/lib/types';

vi.mock('@/lib/cms-content.server', () => ({
  getCmsContent: vi.fn(async () => ({
    profile: { name: 'Keneth', title: 'Engineer' },
    experiences: [],
    projects: [],
    technologies: [],
    certifications: [],
    memberships: [],
    socialLinks: [],
  })),
}));

vi.mock('@/app/api/chat/lib/providers', () => ({
  generateWithGemini: vi.fn(async () => ({
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    message: 'Mock Gemini response with portfolio information.',
    attempts: 1,
    latencyMs: 100,
  })),
  generateWithOpenAI: vi.fn(async () => ({
    provider: 'openai',
    model: 'gpt-4o-mini',
    message: 'Mock OpenAI response.',
    attempts: 1,
    latencyMs: 100,
  })),
  isMultiProviderEnabled: vi.fn(() => false),
  classifyProviderError: vi.fn(() => 'test_error'),
}));

vi.mock('@/app/api/chat/lib/promptBuilder', () => ({
  buildSystemPrompt: vi.fn(() => 'Mock system prompt'),
}));

vi.mock('@/app/api/chat/lib/smartFallback', () => ({
  buildSmartFallback: vi.fn(() => 'Mock fallback response.'),
}));

vi.mock('@/lib/rag/retriever', () => ({
  retrieve: vi.fn(async () => []),
  formatContext: vi.fn(() => ''),
  isRagConfigured: vi.fn(() => false),
}));

vi.mock('@/lib/chat/persistence', () => ({
  saveCheckpoint: vi.fn(),
  loadCheckpoint: vi.fn(() => null),
  deleteCheckpoint: vi.fn(),
}));

import { runChatGraph, getCompiledGraph } from '@/lib/chat/graph';

describe('Chat Graph Engine', () => {
  const mockHistory: ConversationHistoryMessage[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a response for a simple greeting', async () => {
    const result = await runChatGraph({
      message: 'Hello!',
      history: mockHistory,
    });

    expect(result.response).toBeDefined();
    expect(result.response.length).toBeGreaterThan(0);
    expect(result.threadId).toBeDefined();
  });

  it('should return a response for a portfolio question', async () => {
    const result = await runChatGraph({
      message: 'Tell me about your projects',
      history: mockHistory,
    });

    expect(result.response).toBeDefined();
    expect(result.response.length).toBeGreaterThan(0);
  });

  it('should generate a unique threadId when none provided', async () => {
    const result1 = await runChatGraph({
      message: 'Hello',
      history: mockHistory,
    });

    const result2 = await runChatGraph({
      message: 'Hello again',
      history: mockHistory,
    });

    expect(result1.threadId).not.toBe(result2.threadId);
  });

  it('should use provided threadId when given', async () => {
    const threadId = 'test-thread-123';
    const result = await runChatGraph({
      message: 'Hello',
      history: mockHistory,
      threadId,
    });

    expect(result.threadId).toBe(threadId);
  });

  it('should handle a calculate request as tool_call intent', async () => {
    const result = await runChatGraph({
      message: 'Calculate 15 plus 30',
      history: mockHistory,
    });

    expect(result.response).toBeDefined();
  });

  it('should handle stock price query', async () => {
    const result = await runChatGraph({
      message: 'What is the stock price of AAPL?',
      history: mockHistory,
    });

    expect(result.response).toBeDefined();
  });

  it('should handle web search query', async () => {
    const result = await runChatGraph({
      message: 'Search for latest AI news',
      history: mockHistory,
    });

    expect(result.response).toBeDefined();
  });

  it('should fallback gracefully on provider failure', async () => {
    vi.mocked((await import('@/app/api/chat/lib/providers')).generateWithGemini)
      .mockRejectedValueOnce(new Error('Provider unavailable'));

    const result = await runChatGraph({
      message: 'Tell me about Keneth',
      history: mockHistory,
    });

    expect(result.response).toBeDefined();
  });

  it('should call onToken callback during streaming', async () => {
    const onToken = vi.fn();
    await runChatGraph({
      message: 'Hello',
      history: mockHistory,
      onToken,
    });

    expect(onToken).toHaveBeenCalled();
  });

  it('should call onStatus callback with lifecycle events', async () => {
    const onStatus = vi.fn();
    await runChatGraph({
      message: 'Hello',
      history: mockHistory,
      onStatus,
    });

    expect(onStatus).toHaveBeenCalled();
  });

  it('should handle contact intent correctly', async () => {
    const result = await runChatGraph({
      message: 'How can I contact Keneth?',
      history: mockHistory,
    });

    expect(result.response).toBeDefined();
    expect(result.response.length).toBeGreaterThan(0);
  });

  it('should handle empty message gracefully', async () => {
    const result = await runChatGraph({
      message: '',
      history: mockHistory,
    });

    expect(result.response).toBeDefined();
  });

  it('should produce a compiled graph instance', () => {
    const graph = getCompiledGraph();
    expect(graph).toBeDefined();
  });

  it('should return same instance on repeated getCompiledGraph calls', () => {
    const graph1 = getCompiledGraph();
    const graph2 = getCompiledGraph();
    expect(graph1).toBe(graph2);
  });
});
