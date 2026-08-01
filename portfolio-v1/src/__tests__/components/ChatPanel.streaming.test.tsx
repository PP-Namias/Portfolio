import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
  IS_CHAT_THREADING_ENABLED: false,
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

const mockFetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as unknown as Response));

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

describe('ChatPanel streaming with conversations hidden', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = mockFetch as unknown as typeof fetch;
  });

  it('reuses one session thread id with growing history and never calls the threads API', async () => {
    const user = userEvent.setup();
    renderChatPanel();

    expect(screen.queryByLabelText('Open thread sidebar')).not.toBeInTheDocument();
    expect(screen.queryByText('Conversations')).not.toBeInTheDocument();

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

    expect(mockFetch).not.toHaveBeenCalled();

    const firstCall = mockStreamSend.mock.calls[0];
    const secondCall = mockStreamSend.mock.calls[1];

    expect(firstCall[0]).toBe('Tell me about your projects');
    expect(firstCall[1]).toMatch(/^session_\d+$/);
    expect(firstCall[2]).toEqual([]);

    expect(secondCall[0]).toBe('And your skills?');
    expect(secondCall[1]).toBe(firstCall[1]);
    expect(secondCall[2]).toEqual([
      { role: 'user', content: 'Tell me about your projects' },
    ]);
  });
});
