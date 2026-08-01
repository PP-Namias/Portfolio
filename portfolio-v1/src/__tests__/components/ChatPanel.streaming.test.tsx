import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ChatPanel } from '@/components/ui/ChatPanel';

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: true,
  IS_MAGIC_CURSOR_VISIBLE: false,
  IS_PROJECTS_REVAMP_ENABLED: false,
  IS_STREAMING_SSR_ENABLED: false,
  IS_LANGGRAPH_ENABLED: true,
  IS_CHAT_STREAMING_ENABLED: true,
  IS_CHAT_THREADING_ENABLED: true,
}));

vi.mock('framer-motion', () => {
  const R = require('react');
  const MockButton = R.forwardRef(function MockMotionButton(
    { children, className, onClick, ...props }: Record<string, unknown>,
    ref: React.Ref<HTMLButtonElement>
  ) {
    return R.createElement('button', { ref, className, onClick, ...props }, children);
  });
  const MockDiv = R.forwardRef(function MockMotionDiv(
    { children, className, ...props }: Record<string, unknown>,
    ref: React.Ref<HTMLDivElement>
  ) {
    return R.createElement('div', { ref, className, ...props }, children);
  });
  return {
    motion: { button: MockButton, div: MockDiv },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock('@/components/ui/ChatMessage', () => ({
  ChatMessage: ({ message }: { message: { content: string; role: string } }) => (
    <div data-testid={`message-${message.role}`}>{message.content}</div>
  ),
}));

vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({ openModal: vi.fn(), closeModal: vi.fn(), activeModal: null }),
}));

vi.mock('@/hooks/useCmsContent', () => ({
  useCmsContent: () => ({
    profile: { name: 'Jhon Keneth Ryan Namias', title: 'Full Stack Engineer', email: 'pp.namias@gmail.com' },
    hero: { profileImageUrl: 'https://cdn.example.com/profile.jpg' },
    socialLinks: [],
  }),
}));

const mockStreamSend = vi.fn(async () => {});
vi.mock('@/hooks/use-chat-stream', () => ({
  useChatStream: () => ({
    sendMessage: mockStreamSend,
    isStreaming: false,
    error: null,
    currentThreadId: null,
    cancel: vi.fn(),
  }),
}));

function jsonResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  } as unknown as Response;
}

const thread1 = {
  id: 'thread-1',
  title: 'Existing chat',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  messageCount: 2,
};

const mockFetch = vi.fn((url: string, init?: RequestInit) => {
  if (init?.method === 'POST' && url === '/api/chat/threads') {
    return Promise.resolve(jsonResponse({
      thread: { ...thread1, id: 'thread-1', title: 'Tell me about your projects', messageCount: 0 },
    }));
  }
  if (init?.method === 'DELETE' && url === '/api/chat/threads/thread-1') {
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) } as unknown as Response);
  }
  if (init?.method === 'PATCH' && url === '/api/chat/threads/thread-1') {
    return Promise.resolve(jsonResponse({ thread: { ...thread1, title: 'Renamed' } }));
  }
  if (url === '/api/chat/threads') {
    return Promise.resolve(jsonResponse({ threads: [thread1] }));
  }
  if (url === '/api/chat/threads/thread-1') {
    return Promise.resolve(jsonResponse({
      thread: thread1,
      messages: [
        { id: 1, threadId: 'thread-1', role: 'user', content: 'Saved question', toolCalls: null, createdAt: '2026-01-01T00:00:00.000Z' },
        { id: 2, threadId: 'thread-1', role: 'assistant', content: 'Saved answer', toolCalls: null, createdAt: '2026-01-01T00:00:01.000Z' },
      ],
    }));
  }
  return Promise.resolve(jsonResponse({}));
});

function renderChatPanel() {
  function Harness() {
    const [messages, setMessages] = React.useState<Array<{
      id: string;
      role: 'user' | 'assistant';
      content: string;
      timestamp: Date;
    }>>([]);
    return (
      <ChatPanel
        onBack={vi.fn()}
        onClose={vi.fn()}
        isMaximized={false}
        onToggleMaximize={vi.fn()}
        messages={messages}
        setMessages={setMessages}
      />
    );
  }
  return render(<Harness />);
}

describe('ChatPanel streaming + threading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = mockFetch as unknown as typeof fetch;
  });

  it('creates a thread on first message and reuses it with history on follow-up', async () => {
    const user = userEvent.setup();
    renderChatPanel();

    await user.type(screen.getByLabelText('Chat message'), 'Tell me about your projects');
    await user.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(mockStreamSend).toHaveBeenCalledTimes(1);
    });

    await user.type(screen.getByLabelText('Chat message'), 'And your skills?');
    await user.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(mockStreamSend).toHaveBeenCalledTimes(2);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/chat/threads',
      expect.objectContaining({ method: 'POST' })
    );

    const firstCall = mockStreamSend.mock.calls[0];
    const secondCall = mockStreamSend.mock.calls[1];

    expect(firstCall[0]).toBe('Tell me about your projects');
    expect(firstCall[1]).toBe('thread-1');

    expect(secondCall[0]).toBe('And your skills?');
    expect(secondCall[1]).toBe('thread-1');
    expect(secondCall[2]).toEqual([
      { role: 'user', content: 'Tell me about your projects' },
    ]);
  });

  it('opens the thread sidebar and lists conversations', async () => {
    renderChatPanel();

    fireEvent.click(screen.getByLabelText('Open thread sidebar'));

    await waitFor(() => {
      expect(screen.getByText('Conversations')).toBeInTheDocument();
    });
    expect(mockFetch).toHaveBeenCalledWith('/api/chat/threads', expect.any(Object));
    expect(screen.getByLabelText('Thread: Existing chat')).toBeInTheDocument();
  });

  it('loads a thread and its messages when selected', async () => {
    renderChatPanel();

    fireEvent.click(screen.getByLabelText('Open thread sidebar'));
    await waitFor(() => {
      expect(screen.getByLabelText('Thread: Existing chat')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Thread: Existing chat'));

    await waitFor(() => {
      expect(screen.getByText('Saved question')).toBeInTheDocument();
    });
    expect(screen.getByText('Saved answer')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith('/api/chat/threads/thread-1', expect.any(Object));
  });

  it('deletes a thread from the sidebar', async () => {
    renderChatPanel();

    fireEvent.click(screen.getByLabelText('Open thread sidebar'));
    await waitFor(() => {
      expect(screen.getByLabelText('Thread: Existing chat')).toBeInTheDocument();
    });

    const threadRow = screen.getByLabelText('Thread: Existing chat');
    fireEvent.click(screen.getByLabelText('Delete thread'));
    fireEvent.click(screen.getByLabelText('Confirm delete'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/chat/threads/thread-1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
    expect(threadRow).not.toBeInTheDocument();
  });
});
