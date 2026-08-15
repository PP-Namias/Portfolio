import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChatStream } from '@/hooks/use-chat-stream';

function createSSEMock(events: Array<{ event: string; data: Record<string, unknown> }>) {
  const encoder = new TextEncoder();
  let chunk = '';
  for (const evt of events) {
    chunk += `event: ${evt.event}\ndata: ${JSON.stringify(evt.data)}\n\n`;
  }
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

function okResponse(body: ReadableStream): Response {
  return {
    ok: true,
    status: 200,
    body,
    json: () => Promise.resolve({}),
  } as unknown as Response;
}

function errorResponse(status: number, errorMsg: string): Response {
  return {
    ok: false,
    status,
    json: () => Promise.resolve({ error: errorMsg }),
  } as unknown as Response;
}

describe('useChatStream', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should send a message and stream tokens', async () => {
    const stream = createSSEMock([
      { event: 'token', data: { content: 'Hello' } },
      { event: 'token', data: { content: ' world' } },
      { event: 'done', data: { threadId: 't1' } },
    ]);
    fetchSpy.mockResolvedValue(okResponse(stream));

    const onToken = vi.fn();
    const onDone = vi.fn();
    const { result } = renderHook(() => useChatStream({ onToken, onDone }));

    await act(async () => {
      await result.current.sendMessage('test message');
    });

    expect(fetchSpy).toHaveBeenCalledWith('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ message: 'test message', threadId: undefined }),
      signal: expect.any(AbortSignal),
    });

    await waitFor(() => {
      expect(onToken).toHaveBeenCalledTimes(2);
    });
    expect(onToken).toHaveBeenNthCalledWith(1, 'Hello');
    expect(onToken).toHaveBeenNthCalledWith(2, ' world');
    expect(onDone).toHaveBeenCalledWith('t1');
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle tool_call events', async () => {
    const stream = createSSEMock([
      { event: 'tool_call', data: { name: 'web_search', args: { query: 'test' } } },
      { event: 'done', data: { threadId: 't2' } },
    ]);
    fetchSpy.mockResolvedValue(okResponse(stream));

    const onToolCall = vi.fn();
    const { result } = renderHook(() => useChatStream({ onToolCall }));

    await act(async () => {
      await result.current.sendMessage('search test');
    });

    await waitFor(() => {
      expect(onToolCall).toHaveBeenCalledWith({ name: 'web_search', args: { query: 'test' } });
    });
    expect(result.current.isStreaming).toBe(false);
  });

  it('should handle status events with threadId', async () => {
    const stream = createSSEMock([
      { event: 'status', data: { step: 'classifying' } },
      { event: 'status', data: { step: 'generating', threadId: 't3' } },
      { event: 'done', data: { threadId: 't3' } },
    ]);
    fetchSpy.mockResolvedValue(okResponse(stream));

    const onStatus = vi.fn();
    const { result } = renderHook(() => useChatStream({ onStatus }));

    expect(result.current.currentThreadId).toBeNull();

    await act(async () => {
      await result.current.sendMessage('status test');
    });

    await waitFor(() => {
      expect(onStatus).toHaveBeenCalledWith('classifying');
    });
    expect(onStatus).toHaveBeenCalledWith('generating');
    await waitFor(() => {
      expect(result.current.currentThreadId).toBe('t3');
    });
  });

  it('should handle error events', async () => {
    const stream = createSSEMock([
      { event: 'error', data: { error: 'Rate limit exceeded' } },
    ]);
    fetchSpy.mockResolvedValue(okResponse(stream));

    const onError = vi.fn();
    const { result } = renderHook(() => useChatStream({ onError }));

    await act(async () => {
      await result.current.sendMessage('error test');
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Rate limit exceeded');
    });
    expect(result.current.error).toBe('Rate limit exceeded');
  });

  it('should handle HTTP error responses', async () => {
    fetchSpy.mockResolvedValue(errorResponse(400, 'Message is required.'));

    const onError = vi.fn();
    const { result } = renderHook(() => useChatStream({ onError }));

    await act(async () => {
      await result.current.sendMessage('');
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Message is required.');
    });
    expect(result.current.error).toBe('Message is required.');
    expect(result.current.isStreaming).toBe(false);
  });

  it('should handle stream not available', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      status: 200,
      body: null,
      json: () => Promise.resolve({}),
    } as unknown as Response);

    const onError = vi.fn();
    const { result } = renderHook(() => useChatStream({ onError }));

    await act(async () => {
      await result.current.sendMessage('no stream');
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Stream not available');
    });
    expect(result.current.error).toBe('Stream not available');
  });

  it('should cancel an in-flight request', async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    fetchSpy.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useChatStream());

    await act(async () => {
      result.current.sendMessage('long running');
    });

    expect(result.current.isStreaming).toBe(true);

    act(() => {
      result.current.cancel();
    });

    expect(result.current.isStreaming).toBe(false);
    expect(abortSpy).toHaveBeenCalled();
  });

  it('should send with threadId', async () => {
    const stream = createSSEMock([
      { event: 'done', data: { threadId: 'existing-thread' } },
    ]);
    fetchSpy.mockResolvedValue(okResponse(stream));

    const { result } = renderHook(() => useChatStream());

    await act(async () => {
      await result.current.sendMessage('thread msg', 'existing-thread');
    });

    expect(fetchSpy).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      body: JSON.stringify({ message: 'thread msg', threadId: 'existing-thread' }),
    }));
  });

  it('should send conversation history and thread id in the request body', async () => {
    const stream = createSSEMock([
      { event: 'done', data: { threadId: 't1' } },
    ]);
    fetchSpy.mockResolvedValue(okResponse(stream));

    const { result } = renderHook(() => useChatStream());

    await act(async () => {
      await result.current.sendMessage('follow up', 't1', [
        { role: 'user', content: 'first question' },
        { role: 'assistant', content: 'first answer' },
      ]);
    });

    expect(fetchSpy).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      body: JSON.stringify({
        message: 'follow up',
        threadId: 't1',
        history: [
          { role: 'user', content: 'first question' },
          { role: 'assistant', content: 'first answer' },
        ],
      }),
    }));
  });

  it('should omit history from the body when not provided', async () => {
    const stream = createSSEMock([
      { event: 'done', data: { threadId: 't1' } },
    ]);
    fetchSpy.mockResolvedValue(okResponse(stream));

    const { result } = renderHook(() => useChatStream());

    await act(async () => {
      await result.current.sendMessage('no history');
    });

    expect(fetchSpy).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      body: JSON.stringify({ message: 'no history', threadId: undefined }),
    }));
  });

  it('should set isStreaming true during request', async () => {
    const stream = createSSEMock([
      { event: 'done', data: { threadId: 't' } },
    ]);
    fetchSpy.mockResolvedValue(okResponse(stream));

    const { result } = renderHook(() => useChatStream());

    let sendPromise: Promise<void>;
    act(() => {
      sendPromise = result.current.sendMessage('test');
    });

    await waitFor(() => {
      expect(result.current.isStreaming).toBe(true);
    });

    await act(async () => {
      await sendPromise!;
    });

    expect(result.current.isStreaming).toBe(false);
  });
});
