import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatPanel } from '@/components/ui/ChatPanel';
import type { ChatMessage as ChatMessageType } from '@/types';

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: true,
  IS_MAGIC_CURSOR_VISIBLE: false,
  IS_PROJECTS_REVAMP_ENABLED: false,
  IS_STREAMING_SSR_ENABLED: false,
  IS_LANGGRAPH_ENABLED: false,
  IS_CHAT_STREAMING_ENABLED: false,
  IS_CHAT_THREADING_ENABLED: false,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, className, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button className={className} onClick={onClick} {...props}>{children}</button>
    ),
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock ChatMessage component
vi.mock('@/components/ui/ChatMessage', () => ({
  ChatMessage: ({
    message,
    onAction,
  }: {
    message: { content: string; role: string };
    onAction?: (action: string) => void;
  }) => (
    <div data-testid={`message-${message.role}`}>
      <span>{message.content}</span>
      <button aria-label="action-booking" onClick={() => onAction?.('booking')}>booking</button>
      <button aria-label="action-resume" onClick={() => onAction?.('resume')}>resume</button>
      <button aria-label="action-email" onClick={() => onAction?.('email')}>email</button>
      <button aria-label="action-linkedin" onClick={() => onAction?.('linkedin')}>linkedin</button>
      <button aria-label="action-github" onClick={() => onAction?.('github')}>github</button>
      <button aria-label="action-skills" onClick={() => onAction?.('skills')}>skills</button>
      <button aria-label="action-unknown" onClick={() => onAction?.('unknown')}>unknown</button>
    </div>
  ),
}));

// Mock useModal
const mockOpenModal = vi.fn();
vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({ openModal: mockOpenModal, closeModal: vi.fn(), activeModal: null }),
}));

// Mock useCmsContent
vi.mock('@/hooks/useCmsContent', () => ({
  useCmsContent: () => ({
    profile: {
      name: 'Jhon Keneth Ryan Namias',
      title: 'Full Stack Engineer',
      email: 'pp.namias@gmail.com',
    },
    hero: {
      profileImageUrl: 'https://cdn.example.com/profile.jpg',
    },
    socialLinks: [],
  }),
}));

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const mockOnBack = vi.fn();
const mockOnClose = vi.fn();
const mockOnToggleMaximize = vi.fn();

function renderChatPanel(messages: ChatMessageType[] = [], isMaximized = false) {
  const setMessages = vi.fn((updater) => {
    if (typeof updater === 'function') {
      return updater(messages);
    }
    return updater;
  });
  return {
    ...render(
      <ChatPanel
        onBack={mockOnBack}
        onClose={mockOnClose}
        isMaximized={isMaximized}
        onToggleMaximize={mockOnToggleMaximize}
        messages={messages}
        setMessages={setMessages}
      />
    ),
    setMessages,
  };
}

describe('ChatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'AI response here' }),
    });
  });

  it('renders the chat panel with header', () => {
    renderChatPanel();
    expect(screen.getByText('Jhon Keneth Ryan Namias')).toBeInTheDocument();
  });

  it('shows active status indicator by default', () => {
    renderChatPanel();
    expect(screen.getByText('Online • Ask me anything')).toBeInTheDocument();
  });

  it('has a back button that calls onBack', () => {
    renderChatPanel();
    fireEvent.click(screen.getByLabelText('Back to menu'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('has a close button that calls onClose', () => {
    renderChatPanel();
    fireEvent.click(screen.getByLabelText('Close chat'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders welcome message with quick-action buttons', () => {
    const welcomeMessages: ChatMessageType[] = [
      {
        id: 'welcome-message',
        role: 'assistant',
        content: "Hi there! I'm Keneth's AI assistant. I can help you learn about Keneth's skills, experience, projects, and more. What would you like to know?\n\n[WELCOME_TOPICS]",
        timestamp: new Date(),
      },
    ];
    renderChatPanel(welcomeMessages);
    expect(screen.getByText(/I can help you learn about Keneth/)).toBeInTheDocument();
  });

  it('sends a message and calls fetch', async () => {
    renderChatPanel();

    const input = screen.getByPlaceholderText('Ask about skills, projects...');
    await userEvent.type(input, 'Hello');
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"message":"Hello"'),
      });
    });
  });

  it('sends welcome message automatically when chat is empty', async () => {
    const { setMessages } = renderChatPanel();
    await waitFor(() => {
      expect(setMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            role: 'assistant',
            content: expect.stringContaining('[WELCOME_TOPICS]'),
          }),
        ])
      );
    });
  });

  it('shows error state when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderChatPanel();
    const input = screen.getByPlaceholderText('Ask about skills, projects...');
    await userEvent.type(input, 'Hello');
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText('Failed to connect. Please try again.')).toBeInTheDocument();
    });

    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('shows error when API returns error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Rate limited' }),
      status: 429,
    });

    renderChatPanel();
    const input = screen.getByPlaceholderText('Ask about skills, projects...');
    await userEvent.type(input, 'Hello');
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText('Rate limited')).toBeInTheDocument();
    });
  });

  it('shows default API error message when response has no error field', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
      status: 500,
    });

    renderChatPanel();
    const input = screen.getByPlaceholderText('Ask about skills, projects...');
    await userEvent.type(input, 'Hello');
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });
  });

  it('shows reconnecting status when server is unavailable', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: () => Promise.resolve({ error: 'Service unavailable' }),
    });

    renderChatPanel();
    const input = screen.getByPlaceholderText('Ask about skills, projects...');
    await userEvent.type(input, 'Hello');
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText('Temporarily reconnecting...')).toBeInTheDocument();
    });
  });

  it('disables send button when input is empty', () => {
    renderChatPanel();
    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).toBeDisabled();
  });

  it('does not send when submitted with empty input', () => {
    renderChatPanel();

    const form = screen.getByPlaceholderText('Ask about skills, projects...').closest('form');
    expect(form).toBeTruthy();

    fireEvent.submit(form as HTMLFormElement);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('has a maximize button that calls onToggleMaximize', () => {
    renderChatPanel();
    fireEvent.click(screen.getByLabelText('Maximize chat'));
    expect(mockOnToggleMaximize).toHaveBeenCalledTimes(1);
  });

  it('shows minimize label when maximized', () => {
    renderChatPanel([], true);
    expect(screen.getByLabelText('Minimize chat')).toBeInTheDocument();
    expect(screen.queryByLabelText('Maximize chat')).not.toBeInTheDocument();
  });

  it('does not render a clear chat button', () => {
    const messages: ChatMessageType[] = [
      { id: '1', role: 'user', content: 'Hello', timestamp: new Date() },
      { id: '2', role: 'assistant', content: 'Hi there!', timestamp: new Date() },
    ];
    renderChatPanel(messages);
    expect(screen.queryByLabelText('Clear chat history')).not.toBeInTheDocument();
  });

  it('shows follow-up suggestion chips after assistant response', () => {
    const messages: ChatMessageType[] = [
      { id: '1', role: 'user', content: 'Hello', timestamp: new Date() },
      { id: '2', role: 'assistant', content: 'Hi there!', timestamp: new Date() },
    ];
    renderChatPanel(messages);
    // Should show some follow-up suggestions (up to 3)
    expect(screen.getByText('What certifications do you have?')).toBeInTheDocument();
  });

  it('does not show follow-up chips when last message is from user', () => {
    const messages: ChatMessageType[] = [
      { id: '1', role: 'user', content: 'Hello', timestamp: new Date() },
    ];
    renderChatPanel(messages);
    expect(screen.queryByText('What certifications do you have?')).not.toBeInTheDocument();
  });

  it('opens booking modal for booking action', () => {
    const messages: ChatMessageType[] = [
      { id: '1', role: 'assistant', content: 'Use quick actions', timestamp: new Date() },
    ];
    renderChatPanel(messages);

    fireEvent.click(screen.getByLabelText('action-booking'));
    expect(mockOpenModal).toHaveBeenCalledWith('booking');
  });

  it('opens resume modal for resume action', () => {
    const messages: ChatMessageType[] = [
      { id: '1', role: 'assistant', content: 'Use quick actions', timestamp: new Date() },
    ];
    renderChatPanel(messages);

    fireEvent.click(screen.getByLabelText('action-resume'));
    expect(mockOpenModal).toHaveBeenCalledWith('resume');
  });

  it('opens mailto and social links for email/linkedin/github actions', () => {
    const openSpy = vi.spyOn(globalThis, 'open').mockImplementation(() => null);
    const locationSpy = vi.spyOn(globalThis, 'location', 'get').mockReturnValue({ href: '' } as Location);
    const messages: ChatMessageType[] = [
      { id: '1', role: 'assistant', content: 'Use quick actions', timestamp: new Date() },
    ];
    renderChatPanel(messages);

    fireEvent.click(screen.getByLabelText('action-email'));
    fireEvent.click(screen.getByLabelText('action-linkedin'));
    fireEvent.click(screen.getByLabelText('action-github'));

    expect(locationSpy).toBeDefined();
    expect(openSpy).toHaveBeenNthCalledWith(1, 'https://www.linkedin.com/in/pp-namias/', '_blank');
    expect(openSpy).toHaveBeenNthCalledWith(2, 'https://github.com/PP-Namias', '_blank');

    openSpy.mockRestore();
    locationSpy.mockRestore();
  });

  it('sends mapped follow-up question from action map', async () => {
    const messages: ChatMessageType[] = [
      { id: '1', role: 'assistant', content: 'Use quick actions', timestamp: new Date() },
    ];
    renderChatPanel(messages);

    fireEvent.click(screen.getByLabelText('action-skills'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"message":"What tech stack do you specialize in?"'),
      });
    });
  });

  it('ignores unknown action keys', () => {
    const messages: ChatMessageType[] = [
      { id: '1', role: 'assistant', content: 'Use quick actions', timestamp: new Date() },
    ];
    renderChatPanel(messages);

    fireEvent.click(screen.getByLabelText('action-unknown'));
    expect(mockOpenModal).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('sends a follow-up when a suggestion chip is clicked', async () => {
    const messages: ChatMessageType[] = [
      { id: '1', role: 'user', content: 'Hello', timestamp: new Date() },
      { id: '2', role: 'assistant', content: 'Hi there!', timestamp: new Date() },
    ];
    renderChatPanel(messages);

    fireEvent.click(screen.getByText('Tell me about your education'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"message":"Tell me about your education"'),
      });
    });
  });

  it('retries the last user message from history when Retry is clicked', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const messages: ChatMessageType[] = [
      { id: '1', role: 'user', content: 'Previous user message', timestamp: new Date() },
      { id: '2', role: 'assistant', content: 'Previous assistant message', timestamp: new Date() },
    ];

    renderChatPanel(messages);

    const input = screen.getByPlaceholderText('Ask about skills, projects...');
    await userEvent.type(input, 'New question');
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText('Failed to connect. Please try again.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Retry'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    expect(mockFetch).toHaveBeenLastCalledWith('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('"message":"Previous user message"'),
    });
  });

  it('does not retry when no user message exists in history', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const messages: ChatMessageType[] = [
      { id: '1', role: 'assistant', content: 'Assistant-only history', timestamp: new Date() },
    ];

    renderChatPanel(messages);

    const input = screen.getByPlaceholderText('Ask about skills, projects...');
    await userEvent.type(input, 'New question');
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText('Failed to connect. Please try again.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Retry'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
