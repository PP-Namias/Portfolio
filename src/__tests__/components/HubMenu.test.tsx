import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HubMenu } from '@/components/ui/HubMenu';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const R = require('react');
  return {
    motion: {
      button: R.forwardRef(function MockButton(
        { children, className, onClick, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLButtonElement>
      ) {
        return R.createElement('button', { ref, className, onClick, ...props }, children);
      }),
      div: R.forwardRef(function MockDiv(
        { children, className, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) {
        return R.createElement('div', { ref, className, ...props }, children);
      }),
      a: ({ children, className, onClick, href, download, target, rel, ...props }: Record<string, unknown>) =>
        R.createElement('a', { className, onClick, href, download, target, rel, ...props }, children),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock data modules
vi.mock('@/data/socials', () => ({
  socialLinks: [
    { name: 'cal', icon: 'calendar', label: 'Schedule a Meeting', link: 'https://cal.com/pp-namias', featured: true },
    { name: 'github', icon: 'github', label: 'PP-Namias', link: 'https://github.com/PP-Namias' },
    { name: 'email', icon: 'mail', label: 'Gmail', link: 'mailto:pp.namias@gmail.com' },
    { name: 'linkedin', icon: 'linkedin', label: 'LinkedIn', link: 'https://www.linkedin.com/in/pp-namias/' },
    { name: 'x', icon: 'twitter', label: '@PP_Namias', link: 'https://x.com/PP_Namias' },
    { name: 'instagram', icon: 'instagram', label: '@pp_namias', link: 'https://www.instagram.com/pp_namias/' },
  ],
}));

vi.mock('@/data/profile', () => ({
  profile: {
    name: 'Jhon Keneth Ryan Namias',
    email: 'pp.namias@gmail.com',
  },
}));

const mockOpenModal = vi.fn();
vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({
    openModal: mockOpenModal,
    closeModal: vi.fn(),
  }),
}));

describe('HubMenu', () => {
  const mockOnClose = vi.fn();
  const mockOnOpenChat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Quick Actions header', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);
    expect(screen.getByText('Ask AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('View Resume')).toBeInTheDocument();
    expect(screen.getByText('Schedule a Meeting')).toBeInTheDocument();
    expect(screen.getByText('Send Email')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Read Blog')).toBeInTheDocument();
  });

  it('calls onOpenChat when Ask AI is clicked', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);
    fireEvent.click(screen.getByText('Ask AI Assistant'));
    expect(mockOnOpenChat).toHaveBeenCalledTimes(1);
  });

  it('opens resume modal and closes hub when View Resume is clicked', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);
    fireEvent.click(screen.getByText('View Resume'));
    expect(mockOpenModal).toHaveBeenCalledWith('resume');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('opens booking modal and closes hub when Schedule a Meeting is clicked', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);
    fireEvent.click(screen.getByText('Schedule a Meeting'));
    expect(mockOpenModal).toHaveBeenCalledWith('booking');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has email mailto link', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);
    const emailLink = screen.getByText('Send Email').closest('a');
    expect(emailLink).toHaveAttribute('href', 'mailto:pp.namias@gmail.com');
  });

  it('has blog internal link', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);
    const blogLink = screen.getByText('Read Blog').closest('a');
    expect(blogLink).toHaveAttribute('href', '/blog');
  });

  it('expands connect section on click', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);
    fireEvent.click(screen.getByText('Connect'));
    // Social icons should appear
    expect(screen.getByLabelText('PP-Namias')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
  });

  it('has close button that calls onClose', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);
    fireEvent.click(screen.getByLabelText('Close menu'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows Cal.com subtitle for Schedule a Meeting', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);
    expect(screen.getByText('Book on Cal.com')).toBeInTheDocument();
  });
});
