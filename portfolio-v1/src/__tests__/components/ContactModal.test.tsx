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
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</> };
});

vi.mock('@/components/ui/Modal', () => ({
  Modal: ({ open, children, onClose }: { open: boolean; children: React.ReactNode; onClose: () => void }) =>
    open ? <div data-testid="mock-modal">{children}</div> : null,
}));

vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({ openModal: vi.fn(), closeModal: vi.fn() }),
}));

vi.mock('@/hooks/useCmsContent', () => ({
  useCmsContent: () => ({
    profile: { name: 'Jhon Keneth Ryan Namias', title: 'Full Stack Engineer', email: 'pp.namias@gmail.com' },
    hero: { profileImageUrl: 'https://cdn.example.com/profile.jpg' },
    socialLinks: [],
    experiences: [],
  }),
}));

vi.mock('@/lib/constants', () => ({
  DISCORD_PROFILE_URL: 'https://discord.com/users/683914336376455200',
}));

import { ContactModal } from '@/components/ui/ContactModal';

describe('ContactModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
    vi.spyOn(globalThis, 'open').mockReturnValue(null);
  });

  it('renders form fields and send button when open', () => {
    render(<ContactModal open={true} onClose={onClose} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByText('Open email draft')).toBeInTheDocument();
  });

  it('shows validation errors for empty form on submit', () => {
    render(<ContactModal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Open email draft'));
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a short subject.')).toBeInTheDocument();
    expect(screen.getByText(/Please add a bit more detail/)).toBeInTheDocument();
  });

  it('shows validation error for invalid email format', () => {
    render(<ContactModal open={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'notanemail' } });
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'This is a test message with enough chars' } });
    fireEvent.click(screen.getByText('Open email draft'));
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('opens mailto link on valid submission', () => {
    render(<ContactModal open={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Hello there' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'This is a test message with enough characters for the validation.' } });
    fireEvent.click(screen.getByText('Open email draft'));
    expect(globalThis.open).toHaveBeenCalled();
    expect(screen.getByText(/Email draft opened/)).toBeInTheDocument();
  });

  it('copies draft to clipboard', async () => {
    render(<ContactModal open={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Test message for clipboard with enough characters.' } });
    fireEvent.click(screen.getByText('Copy draft'));
    await waitFor(() => {
      expect(screen.getByText(/Draft copied to clipboard/)).toBeInTheDocument();
    });
  });

  it('has a close button', () => {
    render(<ContactModal open={true} onClose={onClose} />);
    const closeBtn = screen.getByLabelText('Close');
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('topic presets fill subject and message', () => {
    render(<ContactModal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Project Collaboration'));
    const subject = screen.getByLabelText('Subject') as HTMLInputElement;
    expect(subject.value).toBe('Project collaboration inquiry');
  });

  it('renders Discord and Book a Call action buttons', () => {
    render(<ContactModal open={true} onClose={onClose} />);
    expect(screen.getByText('Discord')).toBeInTheDocument();
    expect(screen.getByText('Book a Call')).toBeInTheDocument();
  });

  it('persists draft to localStorage on form change', async () => {
    render(<ContactModal open={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    await waitFor(() => {
      const saved = globalThis.localStorage.getItem('contact-modal-draft-v1');
      expect(saved).toBeTruthy();
    });
    const saved = JSON.parse(globalThis.localStorage.getItem('contact-modal-draft-v1')!);
    expect(saved.name).toBe('John');
  });

  it('restores draft from localStorage on mount', () => {
    const draft = { name: 'John', email: 'john@test.com', topic: '', subject: 'Test', message: 'Hello there, this is a test message for draft restore.' };
    globalThis.localStorage.setItem('contact-modal-draft-v1', JSON.stringify(draft));
    render(<ContactModal open={true} onClose={onClose} />);
    const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
    expect(nameInput.value).toBe('John');
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    expect(emailInput.value).toBe('john@test.com');
  });

  it('clear draft button resets form fields', () => {
    render(<ContactModal open={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'A longer message that meets the minimum character requirement for validation.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Clear draft' }));
    const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
    expect(nameInput.value).toBe('');
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    expect(emailInput.value).toBe('');
  });

  it('sets aria-invalid on fields with validation errors', () => {
    render(<ContactModal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Open email draft'));
    const nameField = screen.getByLabelText('Name');
    expect(nameField.getAttribute('aria-invalid')).toBe('true');
  });

  it('handles clipboard copy failure gracefully', async () => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard denied')) },
      writable: true,
      configurable: true,
    });
    render(<ContactModal open={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Test message with enough characters to pass validation.' } });
    fireEvent.click(screen.getByText('Copy draft'));
    await waitFor(() => {
      expect(screen.getByText(/Couldn't copy/)).toBeInTheDocument();
    });
  });
});
