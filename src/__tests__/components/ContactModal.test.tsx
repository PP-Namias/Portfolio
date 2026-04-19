import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ContactModal } from '@/components/ui/ContactModal';

vi.mock('framer-motion', () => {
  const R = require('react');
  return {
    motion: {
      div: R.forwardRef(function MockMotionDiv(
        { children, className, onClick, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) {
        return R.createElement('div', { ref, className, onClick, ...props }, children);
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock('@/data/profile', () => ({
  profile: {
    email: 'pp.namias@gmail.com',
  },
}));

vi.mock('@/data/socials', () => ({
  socialLinks: [
    {
      name: 'cal',
      icon: 'calendar',
      label: 'Schedule a Meeting',
      link: 'https://cal.com/pp-namias',
      featured: true,
    },
  ],
}));

describe('ContactModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('location', { href: 'http://localhost/' } as unknown as Location);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders nothing when closed', () => {
    render(<ContactModal open={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Contact Keneth')).not.toBeInTheDocument();
  });

  it('renders form fields and fallback actions when open', () => {
    render(<ContactModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText('Contact Keneth')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@email.com')).toBeInTheDocument();
    expect(screen.getByText('Open email draft')).toBeInTheDocument();
    expect(screen.getByText('Send direct email')).toBeInTheDocument();
    expect(screen.getByText('Book on Cal.com')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', () => {
    render(<ContactModal open={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'PP Namias' },
    });
    fireEvent.change(screen.getByPlaceholderText('name@email.com'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByPlaceholderText('Tell me about your project, scope, timeline, and goals.'), {
      target: { value: 'I want to build an AI-powered business workflow.' },
    });

    fireEvent.click(screen.getByText('Open email draft'));

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('builds mailto draft and reports success for valid submission', () => {
    render(<ContactModal open={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'PP Namias' },
    });
    fireEvent.change(screen.getByPlaceholderText('name@email.com'), {
      target: { value: 'pp.namias@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Automation, full-stack build, consulting...'), {
      target: { value: 'Consulting Inquiry' },
    });
    fireEvent.change(screen.getByPlaceholderText('Tell me about your project, scope, timeline, and goals.'), {
      target: { value: 'Would like to discuss a full-stack automation build for client onboarding.' },
    });

    fireEvent.click(screen.getByText('Open email draft'));

    expect(globalThis.location.href).toContain('mailto:pp.namias@gmail.com');
    expect(screen.getByText(/email draft has been opened/i)).toBeInTheDocument();
  });
});
