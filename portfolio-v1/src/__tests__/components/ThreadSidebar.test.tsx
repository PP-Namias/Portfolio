import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('framer-motion', () => {
  const R = require('react');
  const motion = new Proxy({}, {
    get: (_, tag: string) => R.forwardRef(function MotionTag({ children, ...props }: Record<string, unknown>, ref: React.Ref<HTMLElement>) {
      return R.createElement(tag, { ref, ...props }, children);
    }),
  });
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

import { ThreadSidebar } from '@/components/ui/ThreadSidebar';

const mockThreads = [
  { id: '1', title: 'Thread A', createdAt: '2026-01-01', updatedAt: '2026-01-02', messageCount: 3 },
  { id: '2', title: 'Thread B', createdAt: '2026-01-03', updatedAt: '2026-01-04', messageCount: 5 },
];

function createMockFetch(overrides?: Partial<typeof globalThis.fetch>) {
  return vi.fn().mockImplementation(overrides?.mockImplementation || ((url: string) => {
    if (url === '/api/chat/threads') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ threads: mockThreads }) });
    }
    if (url.startsWith('/api/chat/threads/')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  }));
}

describe('ThreadSidebar', () => {
  const defaultProps = {
    isOpen: true,
    currentThreadId: null,
    onSelectThread: vi.fn(),
    onNewThread: vi.fn(),
    onDeleteThread: vi.fn(),
    onRenameThread: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = createMockFetch();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ThreadSidebar {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows loading state', async () => {
    globalThis.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));
    render(<ThreadSidebar {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByLabelText('New conversation')).toBeInTheDocument();
    });
  });

  it('shows empty state when no threads', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ threads: [] }) });
    render(<ThreadSidebar {...defaultProps} />);
    expect(await screen.findByText(/No conversations yet/i)).toBeInTheDocument();
  });

  it('renders thread list', async () => {
    render(<ThreadSidebar {...defaultProps} />);
    expect(await screen.findByText('Thread A')).toBeInTheDocument();
    expect(screen.getByText('Thread B')).toBeInTheDocument();
  });

  it('shows message count for each thread', async () => {
    render(<ThreadSidebar {...defaultProps} />);
    expect(await screen.findByText('3 messages')).toBeInTheDocument();
    expect(screen.getByText('5 messages')).toBeInTheDocument();
  });

  it('calls onSelectThread when clicking a thread', async () => {
    const onSelectThread = vi.fn();
    render(<ThreadSidebar {...defaultProps} onSelectThread={onSelectThread} />);
    const threadA = await screen.findByText('Thread A');
    fireEvent.click(threadA);
    expect(onSelectThread).toHaveBeenCalledWith('1');
  });

  it('calls API and dispatches onNewThread on create', async () => {
    globalThis.fetch = createMockFetch();
    globalThis.fetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      if (options?.method === 'POST') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ thread: mockThreads[0] }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ threads: mockThreads }) });
    });
    const onNewThread = vi.fn();
    const onSelectThread = vi.fn();
    render(<ThreadSidebar {...defaultProps} onNewThread={onNewThread} onSelectThread={onSelectThread} />);
    await screen.findByText('Thread A');
    fireEvent.click(screen.getByLabelText('New conversation'));
    await waitFor(() => {
      expect(onNewThread).toHaveBeenCalled();
      expect(onSelectThread).toHaveBeenCalledWith('1');
    });
  });

  it('shows error state on fetch failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    render(<ThreadSidebar {...defaultProps} />);
    expect(await screen.findByText(/Network error loading conversations/i)).toBeInTheDocument();
  });

  it('delete button shows confirmation then deletes', async () => {
    globalThis.fetch = createMockFetch();
    const onDeleteThread = vi.fn();
    render(<ThreadSidebar {...defaultProps} onDeleteThread={onDeleteThread} />);
    await screen.findByText('Thread A');
    const deleteButtons = screen.getAllByLabelText('Delete thread');
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByLabelText('Confirm delete')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Confirm delete'));
    await waitFor(() => {
      expect(onDeleteThread).toHaveBeenCalledWith('1');
    });
  });
});
