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
  ChatMessage: ({ message }: { message: { content: string; role: string } }) => (
    <div data-testid={`message-${message.role}`}>{message.content}</div>
  ),
}));

// Mock useModal
const mockOpenModal = vi.fn();
vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({ openModal: mockOpenModal, closeModal: vi.fn(), activeModal: null }),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

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
    expect(screen.getByText('What are your top skills?')).toBeInTheDocument();
    expect(screen.getByText('Tell me about your experience')).toBeInTheDocument();
    expect(screen.getByText('What projects have you built?')).toBeInTheDocument();
    expect(screen.getByText('How can I schedule a meeting?')).toBeInTheDocument();
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
    fireEvent.click(screen.getByText('What are your top skills?'));

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
    });

    renderChatPanel();
    const input = screen.getByPlaceholderText('Ask about skills, projects, experience...');
    await userEvent.type(input, 'Hello');
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText('Rate limited')).toBeInTheDocument();
    });
  });

  it('disables send button when input is empty', () => {
    renderChatPanel();
    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).toBeDisabled();
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
});
