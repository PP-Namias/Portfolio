import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
