import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import ErrorPage from '@/app/error';

describe('Error page', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, NODE_ENV: 'test' };
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders error message heading', () => {
    render(<ErrorPage error={new Error('Boom')} reset={vi.fn()} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<ErrorPage error={new Error('Boom')} reset={vi.fn()} />);
    expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
  });

  it('renders a Try Again button that calls reset', () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error('Boom')} reset={reset} />);
    fireEvent.click(screen.getByText('Try Again'));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('renders a Go Home link pointing to /', () => {
    render(<ErrorPage error={new Error('Boom')} reset={vi.fn()} />);
    const link = screen.getByText('Go Home').closest('a');
    expect(link).toHaveAttribute('href', '/');
  });

  it('does not log to console in test environment', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    render(<ErrorPage error={new Error('Boom')} reset={vi.fn()} />);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('renders within a main landmark', () => {
    render(<ErrorPage error={new Error('Boom')} reset={vi.fn()} />);
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});
