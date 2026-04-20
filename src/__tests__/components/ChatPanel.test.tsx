import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatPanel } from '@/components/ui/ChatPanel';
import type { ChatMessage as ChatMessageType } from '@/types';

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

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const mockOnBack = vi.fn();
const mockOnClose = vi.fn();

function renderChatPanel(messages: ChatMessageType[] = []) {
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
    expect(screen.getByText("Keneth's AI")).toBeInTheDocument();
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

  it('renders suggested questions when chat is empty', () => {
    renderChatPanel();
    expect(screen.getByText('About Keneth')).toBeInTheDocument();
    expect(screen.getByText('Skills & Tech')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Schedule Call')).toBeInTheDocument();
  });

  it('sends a message and calls fetch', async () => {
    renderChatPanel();

    const input = screen.getByPlaceholderText('Ask about skills, projects, experience...');
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

  it('sends suggested question on chip click', async () => {
    renderChatPanel();
    fireEvent.click(screen.getByText('About Keneth'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
        method: 'POST',
      }));
    });
  });

  it('shows error state when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderChatPanel();
    const input = screen.getByPlaceholderText('Ask about skills, projects, experience...');
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
    const input = screen.getByPlaceholderText('Ask about skills, projects, experience...');
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
    const input = screen.getByPlaceholderText('Ask about skills, projects, experience...');
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
    const input = screen.getByPlaceholderText('Ask about skills, projects, experience...');
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

    const form = screen.getByPlaceholderText('Ask about skills, projects, experience...').closest('form');
    expect(form).toBeTruthy();

    fireEvent.submit(form as HTMLFormElement);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('shows clear chat button when messages exist', () => {
    const messages: ChatMessageType[] = [
      { id: '1', role: 'user', content: 'Hello', timestamp: new Date() },
      { id: '2', role: 'assistant', content: 'Hi there!', timestamp: new Date() },
    ];
    renderChatPanel(messages);
    expect(screen.getByLabelText('Clear chat history')).toBeInTheDocument();
  });

  it('does not show clear chat button when chat is empty', () => {
    renderChatPanel();
    expect(screen.queryByLabelText('Clear chat history')).not.toBeInTheDocument();
  });

  it('calls setMessages to clear when clear button is clicked', () => {
    const messages: ChatMessageType[] = [
      { id: '1', role: 'user', content: 'Hello', timestamp: new Date() },
      { id: '2', role: 'assistant', content: 'Hi!', timestamp: new Date() },
    ];
    const { setMessages } = renderChatPanel(messages);
    fireEvent.click(screen.getByLabelText('Clear chat history'));
    expect(setMessages).toHaveBeenCalledWith([]);
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

  it('opens contact page and social links for email/linkedin/github actions', () => {
    const openSpy = vi.spyOn(globalThis, 'open').mockImplementation(() => null);
    const messages: ChatMessageType[] = [
      { id: '1', role: 'assistant', content: 'Use quick actions', timestamp: new Date() },
    ];
    renderChatPanel(messages);

    fireEvent.click(screen.getByLabelText('action-email'));
    fireEvent.click(screen.getByLabelText('action-linkedin'));
    fireEvent.click(screen.getByLabelText('action-github'));

    expect(openSpy).toHaveBeenNthCalledWith(1, '/contact', '_self');
    expect(openSpy).toHaveBeenNthCalledWith(2, 'https://www.linkedin.com/in/pp-namias/', '_blank');
    expect(openSpy).toHaveBeenNthCalledWith(3, 'https://github.com/PP-Namias', '_blank');

    openSpy.mockRestore();
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

    const input = screen.getByPlaceholderText('Ask about skills, projects, experience...');
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

    const input = screen.getByPlaceholderText('Ask about skills, projects, experience...');
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
