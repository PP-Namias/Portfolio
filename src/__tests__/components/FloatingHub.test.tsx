import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { FloatingHub } from '@/components/ui/FloatingHub';

// Mock framer-motion — must define forwardRef inside factory since vi.mock is hoisted
vi.mock('framer-motion', () => {
  const R = require('react');
  const MockButton = R.forwardRef(function MockMotionButton(
    { children, className, onClick, whileHover, whileTap, ...props }: Record<string, unknown>,
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
    motion: {
      button: MockButton,
      div: MockDiv,
      a: ({ children, className, onClick, href, download, target, rel, ...props }: Record<string, unknown>) =>
        R.createElement('a', { className, onClick, href, download, target, rel, ...props }, children),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock ChatMessage
vi.mock('@/components/ui/ChatMessage', () => ({
  ChatMessage: ({ message }: { message: { content: string; role: string } }) => (
    <div data-testid={`message-${message.role}`}>{message.content}</div>
  ),
}));

// Mock data modules
vi.mock('@/data/socials', () => ({
  socialLinks: [
    { name: 'calendly', icon: 'calendar', label: 'Schedule a Meeting', link: 'https://calendly.com/pp-namias/15-minute-meeting', featured: true },
    { name: 'github', icon: 'github', label: 'PP-Namias', link: 'https://github.com/PP-Namias' },
    { name: 'email', icon: 'mail', label: 'Gmail', link: 'mailto:pp.namias@gmail.com' },
    { name: 'linkedin', icon: 'linkedin', label: 'LinkedIn', link: 'https://www.linkedin.com/in/pp-namias/' },
    { name: 'x', icon: 'twitter', label: '@PP_Namias', link: 'https://x.com/PP_Namias' },
    { name: 'instagram', icon: 'instagram', label: '@pp_namias', link: 'https://www.instagram.com/pp_namias/' },
  ],
}));

vi.mock('@/data/profile', () => ({
  profile: {
    name: 'Jhon Keneth Namias',
    email: 'pp.namias@gmail.com',
  },
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('FloatingHub', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'AI response here' }),
    });
  });

  it('renders the floating action button when closed', () => {
    render(<FloatingHub />);
    expect(screen.getByLabelText('Open quick actions')).toBeInTheDocument();
  });

  it('opens hub menu when FAB is clicked', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('displays all 6 hub menu items', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));

    expect(screen.getByText('Ask AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Download Resume')).toBeInTheDocument();
    expect(screen.getByText('Schedule a Meeting')).toBeInTheDocument();
    expect(screen.getByText('Send Email')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Read Blog')).toBeInTheDocument();
  });

  it('opens chat panel when "Ask AI Assistant" is clicked', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    fireEvent.click(screen.getByText('Ask AI Assistant'));

    expect(screen.getByText("Keneth's AI")).toBeInTheDocument();
    expect(screen.getByLabelText('Back to menu')).toBeInTheDocument();
  });

  it('has download link for resume', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));

    const resumeLink = screen.getByText('Download Resume').closest('a');
    expect(resumeLink).toHaveAttribute('href', '/resume.pdf');
    expect(resumeLink).toHaveAttribute('download');
  });

  it('has external link for Calendly', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));

    const calendlyLink = screen.getByText('Schedule a Meeting').closest('a');
    expect(calendlyLink).toHaveAttribute('href', 'https://calendly.com/pp-namias/15-minute-meeting');
    expect(calendlyLink).toHaveAttribute('target', '_blank');
    expect(calendlyLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has mailto link for email', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));

    const mailLink = screen.getByText('Send Email').closest('a');
    expect(mailLink).toHaveAttribute('href', 'mailto:pp.namias@gmail.com');
  });

  it('has link to blog', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));

    const blogLink = screen.getByText('Read Blog').closest('a');
    expect(blogLink).toHaveAttribute('href', '/blog');
  });

  it('expands Connect section to show social icons', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    fireEvent.click(screen.getByText('Connect'));

    expect(screen.getByLabelText('PP-Namias')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('@PP_Namias')).toBeInTheDocument();
  });

  it('back button in chat returns to menu', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    fireEvent.click(screen.getByText('Ask AI Assistant'));

    expect(screen.getByText("Keneth's AI")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Back to menu'));
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('close button closes entire hub from menu', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close menu'));
    expect(screen.getByLabelText('Open quick actions')).toBeInTheDocument();
  });

  it('close button closes entire hub from chat', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    fireEvent.click(screen.getByText('Ask AI Assistant'));

    fireEvent.click(screen.getByLabelText('Close chat'));
    expect(screen.getByLabelText('Open quick actions')).toBeInTheDocument();
  });

  it('Escape key goes from chat → menu → closed', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    fireEvent.click(screen.getByText('Ask AI Assistant'));

    // chat → menu
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();

    // menu → closed
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByLabelText('Open quick actions')).toBeInTheDocument();
  });

  it('chat messages persist when switching panels', async () => {
    render(<FloatingHub />);

    // Open chat
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    fireEvent.click(screen.getByText('Ask AI Assistant'));

    // Send a message
    const input = screen.getByPlaceholderText('Type a message...');
    await userEvent.type(input, 'Hello');
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByTestId('message-user')).toHaveTextContent('Hello');
    });

    await waitFor(() => {
      expect(screen.getByTestId('message-assistant')).toHaveTextContent('AI response here');
    });

    // Go back to menu
    fireEvent.click(screen.getByLabelText('Back to menu'));
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();

    // Go back to chat — messages should still be there
    fireEvent.click(screen.getByText('Ask AI Assistant'));
    expect(screen.getByTestId('message-user')).toHaveTextContent('Hello');
    expect(screen.getByTestId('message-assistant')).toHaveTextContent('AI response here');
  });

  it('has accessible dialog attributes', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Quick Actions');
  });

  it('chat panel has correct aria-label', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    fireEvent.click(screen.getByText('Ask AI Assistant'));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', "Chat with Keneth's AI");
  });

  it('shows pulse ring initially and hides after first click', () => {
    sessionStorage.clear();
    render(<FloatingHub />);

    // Pulse ring visible
    expect(screen.getByTestId('pulse-ring')).toBeInTheDocument();

    // Click FAB
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();

    // Close menu
    fireEvent.click(screen.getByLabelText('Close menu'));

    // Pulse ring should be gone
    expect(screen.queryByTestId('pulse-ring')).not.toBeInTheDocument();
  });

  it('hides pulse ring when sessionStorage flag is set', () => {
    sessionStorage.setItem('hub_interacted', '1');
    render(<FloatingHub />);
    expect(screen.queryByTestId('pulse-ring')).not.toBeInTheDocument();
  });

  it('panel has tabIndex for programmatic focus', () => {
    render(<FloatingHub />);
    fireEvent.click(screen.getByLabelText('Open quick actions'));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('tabindex', '-1');
  });
});
