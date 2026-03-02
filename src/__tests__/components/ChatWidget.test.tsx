import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '@/components/ui/ChatWidget';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, className, onClick, whileHover, whileTap, initial, animate, exit, ...props }: Record<string, unknown>) => (
      <button className={className as string} onClick={onClick as React.MouseEventHandler} {...props}>{children as React.ReactNode}</button>
    ),
    div: ({ children, className, initial, animate, exit, transition, whileInView, viewport, ...props }: Record<string, unknown>) => (
      <div className={className as string} {...props}>{children as React.ReactNode}</div>
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

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ChatWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'AI response here' }),
    });
  });

  it('renders the floating chat button', () => {
    render(<ChatWidget />);
    const btn = screen.getByLabelText('Open chat');
    expect(btn).toBeInTheDocument();
  });

  it('opens the chat panel when button is clicked', async () => {
    render(<ChatWidget />);
    const btn = screen.getByLabelText('Open chat');
    fireEvent.click(btn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText("Keneth's AI")).toBeInTheDocument();
  });

  it('closes the chat panel when close button is clicked', async () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close chat'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the panel on Escape key', async () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders suggested questions when chat is empty', () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    expect(screen.getByText('What tech stack do you use?')).toBeInTheDocument();
    expect(screen.getByText('Tell me about your experience')).toBeInTheDocument();
    expect(screen.getByText('What projects have you built?')).toBeInTheDocument();
    expect(screen.getByText('How can I contact you?')).toBeInTheDocument();
  });

  it('sends a message and displays the response', async () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    const input = screen.getByPlaceholderText('Type a message...');
    await userEvent.type(input, 'Hello');
    fireEvent.click(screen.getByLabelText('Send message'));

    // User message should appear
    await waitFor(() => {
      expect(screen.getByTestId('message-user')).toHaveTextContent('Hello');
    });

    // Bot reply should appear after fetch resolves
    await waitFor(() => {
      expect(screen.getByTestId('message-assistant')).toHaveTextContent('AI response here');
    });

    // Verify fetch was called correctly
    expect(mockFetch).toHaveBeenCalledWith('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('"message":"Hello"'),
    });
  });

  it('sends suggested question on chip click', async () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));
    fireEvent.click(screen.getByText('What tech stack do you use?'));

    await waitFor(() => {
      expect(screen.getByTestId('message-user')).toHaveTextContent('What tech stack do you use?');
    });
  });

  it('shows error state when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    const input = screen.getByPlaceholderText('Type a message...');
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

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    const input = screen.getByPlaceholderText('Type a message...');
    await userEvent.type(input, 'Hello');
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText('Rate limited')).toBeInTheDocument();
    });
  });

  it('disables send button when input is empty', () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).toBeDisabled();
  });

  it('has accessible dialog attributes', () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', "Chat with Keneth's AI");
  });
});
