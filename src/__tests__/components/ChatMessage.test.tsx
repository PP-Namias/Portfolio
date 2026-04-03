import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatMessage } from '@/components/ui/ChatMessage';
import type { ChatMessage as ChatMessageType } from '@/types';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>{children}</div>
    ),
  },
}));

function createMessage(overrides: Partial<ChatMessageType> = {}): ChatMessageType {
  return {
    id: '1',
    role: 'user',
    content: 'Hello there',
    timestamp: new Date('2026-03-02'),
    ...overrides,
  };
}

describe('ChatMessage', () => {
  it('renders message content', () => {
    render(<ChatMessage message={createMessage({ content: 'Test message content' })} />);
    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('renders user message right-aligned with pink bg', () => {
    const { container } = render(
      <ChatMessage message={createMessage({ role: 'user' })} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('justify-end');
    const bubble = wrapper.querySelector('div > div') as HTMLElement;
    expect(bubble.className).toContain('bg-accent-pink');
    expect(bubble.className).toContain('text-white');
    expect(bubble.className).toContain('rounded-br-md');
  });

  it('renders assistant message left-aligned with card bg', () => {
    const { container } = render(
      <ChatMessage message={createMessage({ role: 'assistant' })} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('justify-start');
    const bubble = wrapper.querySelector('div > div') as HTMLElement;
    expect(bubble.className).toContain('dark:bg-card-bg-dark');
    expect(bubble.className).toContain('rounded-bl-md');
  });

  it('preserves whitespace in messages', () => {
    const { container } = render(
      <ChatMessage message={createMessage({ content: 'Line 1\nLine 2' })} />
    );
    const bubble = container.querySelector('.whitespace-pre-wrap');
    expect(bubble).toBeInTheDocument();
    expect(bubble?.textContent).toBe('Line 1\nLine 2');
  });

  it('renders action buttons for assistant messages with action tags', () => {
    const msg = createMessage({
      role: 'assistant',
      content: 'You can book a meeting with Keneth!\n[ACTION:booking]',
    });
    render(<ChatMessage message={msg} onAction={vi.fn()} />);
    expect(screen.getByText('Schedule a Meeting')).toBeInTheDocument();
    expect(screen.getByText(/You can book a meeting/)).toBeInTheDocument();
    // action tag should not appear in the visible text
    expect(screen.queryByText('[ACTION:booking]')).not.toBeInTheDocument();
  });

  it('calls onAction when action button is clicked', async () => {
    const onAction = vi.fn();
    const msg = createMessage({
      role: 'assistant',
      content: 'Check out the resume [ACTION:resume]',
    });
    render(<ChatMessage message={msg} onAction={onAction} />);
    await userEvent.click(screen.getByText('View Resume'));
    expect(onAction).toHaveBeenCalledWith('resume');
  });

  it('renders newly supported social and navigation actions', () => {
    const msg = createMessage({
      role: 'assistant',
      content:
        'Use these actions for quick navigation.\n[ACTION:skills]\n[ACTION:projects]\n[ACTION:linkedin]\n[ACTION:github]',
    });

    render(<ChatMessage message={msg} onAction={vi.fn()} />);

    expect(screen.getByText('Explore Skills')).toBeInTheDocument();
    expect(screen.getByText('View Projects')).toBeInTheDocument();
    expect(screen.getByText('Open LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Open GitHub')).toBeInTheDocument();
    expect(screen.queryByText('[ACTION:linkedin]')).not.toBeInTheDocument();
  });

  it('calls onAction for social action clicks', async () => {
    const onAction = vi.fn();
    const msg = createMessage({
      role: 'assistant',
      content: 'Open Keneth\'s LinkedIn profile.\n[ACTION:linkedin]',
    });

    render(<ChatMessage message={msg} onAction={onAction} />);
    await userEvent.click(screen.getByText('Open LinkedIn'));

    expect(onAction).toHaveBeenCalledWith('linkedin');
  });

  it('does not render action buttons for user messages', () => {
    const msg = createMessage({
      role: 'user',
      content: '[ACTION:booking]',
    });
    render(<ChatMessage message={msg} />);
    expect(screen.queryByText('Schedule a Meeting')).not.toBeInTheDocument();
  });
});
