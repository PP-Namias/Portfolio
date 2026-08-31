import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages'
import type { ChatDataContext, ConversationHistoryMessage } from '@/app/api/chat/lib/types'

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
}))

// The graph delegates failover to the provider chain, so the chain is the seam
// these tests mock. Per-provider behaviour is covered in providers.claude.test.ts
// and providerChain.test.ts.
vi.mock('@/app/api/chat/lib/providers', () => ({
  generateWithProviderChain: vi.fn(async () => ({
    result: {
      provider: 'claude',
      model: 'claude-sonnet-5',
      message: 'Mock Claude response with portfolio information.',
      attempts: 1,
      latencyMs: 100,
    },
    attempts: [{ provider: 'claude', result: 'success' }],
  })),
  streamWithProviderChain: vi.fn(
    async (
      _message: string,
      _history: unknown[],
      _promptParts: unknown,
      handlers: { onChunk: (text: string) => void }
    ) => {
      handlers.onChunk('Mock')
      handlers.onChunk(' stream')
      return {
        result: {
          provider: 'claude',
          model: 'claude-sonnet-5',
          message: 'Mock stream',
          latencyMs: 50,
        },
        attempts: [{ provider: 'claude', result: 'success' }],
      }
    }
  ),
}))

vi.mock('@/app/api/chat/lib/promptBuilder', () => ({
  buildSystemPromptParts: vi.fn(() => ({ stable: 'Mock system prompt', volatile: '' })),
}))

vi.mock('@/app/api/chat/lib/smartFallback', () => ({
  buildSmartFallback: vi.fn(() => 'Mock fallback response.'),
}))

vi.mock('@/lib/rag/retriever', () => ({
  retrieve: vi.fn(async () => []),
  formatContext: vi.fn(() => ''),
  isRagConfigured: vi.fn(() => false),
}))

vi.mock('@/lib/chat/persistence', () => ({
  saveCheckpoint: vi.fn(),
  loadCheckpoint: vi.fn(() => null),
  deleteCheckpoint: vi.fn(),
}))

import { runChatGraph, getCompiledGraph } from '@/lib/chat/graph'

describe('Chat Graph Engine', () => {
  const mockHistory: ConversationHistoryMessage[] = []

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a response for a simple greeting', async () => {
    const result = await runChatGraph({
      message: 'Hello!',
      history: mockHistory,
    })

    expect(result.response).toBeDefined()
    expect(result.response.length).toBeGreaterThan(0)
    expect(result.threadId).toBeDefined()
  })

  it('should return a response for a portfolio question', async () => {
    const result = await runChatGraph({
      message: 'Tell me about your projects',
      history: mockHistory,
    })

    expect(result.response).toBeDefined()
    expect(result.response.length).toBeGreaterThan(0)
  })

  it('should generate a unique threadId when none provided', async () => {
    const result1 = await runChatGraph({
      message: 'Hello',
      history: mockHistory,
    })

    const result2 = await runChatGraph({
      message: 'Hello again',
      history: mockHistory,
    })

    expect(result1.threadId).not.toBe(result2.threadId)
  })

  it('should use provided threadId when given', async () => {
    const threadId = 'test-thread-123'
    const result = await runChatGraph({
      message: 'Hello',
      history: mockHistory,
      threadId,
    })

    expect(result.threadId).toBe(threadId)
  })

  it('should handle a calculate request as tool_call intent', async () => {
    const result = await runChatGraph({
      message: 'Calculate 15 plus 30',
      history: mockHistory,
    })

    expect(result.response).toBeDefined()
  })

  it('should handle stock price query', async () => {
    const result = await runChatGraph({
      message: 'What is the stock price of AAPL?',
      history: mockHistory,
    })

    expect(result.response).toBeDefined()
  })

  it('should handle web search query', async () => {
    const result = await runChatGraph({
      message: 'Search for latest AI news',
      history: mockHistory,
    })

    expect(result.response).toBeDefined()
  })

  it('should fallback gracefully when every provider in the chain fails', async () => {
    vi.mocked(
      (await import('@/app/api/chat/lib/providers')).generateWithProviderChain
    ).mockResolvedValueOnce({
      result: null,
      attempts: [
        { provider: 'claude', result: 'error', errorClass: 'provider_error:error' },
        { provider: 'gemini', result: 'error', errorClass: 'provider_error:error' },
      ],
    })

    const result = await runChatGraph({
      message: 'Tell me about Keneth',
      history: mockHistory,
    })

    expect(result.response).toBeDefined()
  })

  it('should call onToken callback with streamed chunks during streaming', async () => {
    const onToken = vi.fn()
    await runChatGraph({
      message: 'Hello',
      history: mockHistory,
      onToken,
    })

    expect(onToken).toHaveBeenCalledTimes(2)
    expect(onToken).toHaveBeenNthCalledWith(1, 'Mock')
    expect(onToken).toHaveBeenNthCalledWith(2, ' stream')
  })

  it('executes a tool exactly once and feeds the tool result into generation', async () => {
    const { generateWithProviderChain } = await import('@/app/api/chat/lib/providers')
    const result = await runChatGraph({
      message: 'Calculate 15 plus 30',
      history: mockHistory,
    })

    expect(generateWithProviderChain).toHaveBeenCalledTimes(1)
    const generateArg = vi.mocked(generateWithProviderChain).mock.calls[0][0]
    expect(generateArg).toContain('Tool result')
    expect(generateArg).toContain('result')
    expect(result.response).toBeDefined()
  })

  it('does not loop tool execution more than once per message', async () => {
    const { generateWithProviderChain } = await import('@/app/api/chat/lib/providers')
    await runChatGraph({
      message: 'Calculate 100 divided by 4',
      history: mockHistory,
    })

    expect(generateWithProviderChain).toHaveBeenCalledTimes(1)
  })

  it('streams the tool result through the generation call when streaming', async () => {
    const { streamWithProviderChain } = await import('@/app/api/chat/lib/providers')
    const onToken = vi.fn()
    await runChatGraph({
      message: 'Calculate 7 times 6',
      history: mockHistory,
      onToken,
    })

    expect(streamWithProviderChain).toHaveBeenCalledTimes(1)
    const generateArg = vi.mocked(streamWithProviderChain).mock.calls[0][0]
    expect(generateArg).toContain('Tool result')
    expect(onToken).toHaveBeenCalled()
  })

  it('should call onStatus callback with lifecycle events', async () => {
    const onStatus = vi.fn()
    await runChatGraph({
      message: 'Hello',
      history: mockHistory,
      onStatus,
    })

    expect(onStatus).toHaveBeenCalled()
  })

  it('should handle contact intent correctly', async () => {
    const result = await runChatGraph({
      message: 'How can I contact Keneth?',
      history: mockHistory,
    })

    expect(result.response).toBeDefined()
    expect(result.response.length).toBeGreaterThan(0)
  })

  it('should handle empty message gracefully', async () => {
    const result = await runChatGraph({
      message: '',
      history: mockHistory,
    })

    expect(result.response).toBeDefined()
  })

  it('should produce a compiled graph instance', () => {
    const graph = getCompiledGraph()
    expect(graph).toBeDefined()
  })

  it('should return same instance on repeated getCompiledGraph calls', () => {
    const graph1 = getCompiledGraph()
    const graph2 = getCompiledGraph()
    expect(graph1).toBe(graph2)
  })

  it('should handle very long messages', async () => {
    const longMsg = 'A'.repeat(5000)
    const result = await runChatGraph({
      message: longMsg,
      history: mockHistory,
    })
    expect(result.response).toBeDefined()
    expect(result.response.length).toBeGreaterThan(0)
  })

  it('should handle special characters and unicode', async () => {
    const result = await runChatGraph({
      message: 'Hello 你好 Привет مرحبا!',
      history: mockHistory,
    })
    expect(result.response).toBeDefined()
    expect(result.response.length).toBeGreaterThan(0)
  })
})
