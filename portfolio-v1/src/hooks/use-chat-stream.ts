'use client';

import { useState, useRef, useCallback } from 'react';

export interface ToolCallInfo {
  name: string;
  args: Record<string, unknown>;
}

export interface UseChatStreamOptions {
  onToken?: (token: string) => void;
  onToolCall?: (toolCall: ToolCallInfo) => void;
  onStatus?: (step: string) => void;
  onDone?: (threadId: string) => void;
  onError?: (error: string) => void;
}

export interface ChatHistoryItem {
  role: string;
  content: string;
}

export interface UseChatStreamReturn {
  sendMessage: (message: string, threadId?: string, history?: ChatHistoryItem[]) => Promise<void>;
  isStreaming: boolean;
  error: string | null;
  currentThreadId: string | null;
  cancel: () => void;
}

export function useChatStream(options: UseChatStreamOptions = {}): UseChatStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(async (message: string, threadId?: string, history?: ChatHistoryItem[]) => {
    cancel();

    const controller = new AbortController();
    abortRef.current = controller;

    setIsStreaming(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          message,
          threadId,
          history: history && history.length > 0 ? history : undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Request failed' }));
        setError(data.error || `Error ${res.status}`);
        options.onError?.(data.error || `Error ${res.status}`);
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError('Stream not available');
        options.onError?.('Stream not available');
        setIsStreaming(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            try {
              const data = JSON.parse(dataStr);
              switch (currentEvent) {
                case 'token':
                  if (data.content) {
                    options.onToken?.(data.content);
                  }
                  break;
                case 'tool_call':
                  if (data.name) {
                    options.onToolCall?.({ name: data.name, args: data.args || {} });
                  }
                  break;
                case 'status':
                  if (data.step) {
                    options.onStatus?.(data.step);
                    if (data.threadId) {
                      setCurrentThreadId(data.threadId);
                    }
                  }
                  break;
                case 'done':
                  if (data.threadId) {
                    setCurrentThreadId(data.threadId);
                    options.onDone?.(data.threadId);
                  }
                  break;
                case 'error':
                  setError(data.error || 'Stream error');
                  options.onError?.(data.error || 'Stream error');
                  break;
              }
            } catch {
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
      options.onError?.(msg);
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [cancel, options]);

  return {
    sendMessage,
    isStreaming,
    error,
    currentThreadId,
    cancel,
  };
}
