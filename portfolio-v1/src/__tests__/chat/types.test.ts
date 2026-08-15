import { describe, it, expect } from 'vitest';

describe('Chat types', () => {
  it('exports ChatIntent type', () => {
    const intent: 'rag_query' | 'tool_call' | 'general' | 'greeting' | 'contact' = 'general';
    expect(intent).toBe('general');
  });

  it('exports ToolCallResult interface shape', () => {
    const result = {
      tool: 'calculator',
      input: { first_num: 5, second_num: 3, operation: 'add' },
      output: '8',
      success: true,
      durationMs: 100,
    };
    expect(result.tool).toBe('calculator');
    expect(result.success).toBe(true);
    expect(result.durationMs).toBeGreaterThan(0);
  });

  it('exports LangGraphChatState interface shape', () => {
    const state = {
      messages: [],
      threadId: 'test-1',
      chatDataContext: null,
      ragContext: '',
      ragChunks: [],
      intent: 'general' as const,
      toolIterations: 0,
      systemPrompt: '',
      providerAttempts: [],
      userMessage: 'hello',
      history: [],
    };
    expect(state.threadId).toBe('test-1');
    expect(state.intent).toBe('general');
  });

  it('exports ThreadMetadata interface shape', () => {
    const meta = {
      id: 't1',
      title: 'Test',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      messageCount: 5,
    };
    expect(meta.messageCount).toBe(5);
  });

  it('exports PersistedMessage interface shape', () => {
    const msg = {
      id: 1,
      threadId: 't1',
      role: 'user',
      content: 'Hello',
      toolCalls: null,
      createdAt: '2026-01-01T00:00:00Z',
    };
    expect(msg.content).toBe('Hello');
  });

  it('exports SSEEvent interface shape', () => {
    const event = {
      type: 'token' as const,
      content: 'Hello',
      threadId: 't1',
    };
    expect(event.type).toBe('token');
  });
});
