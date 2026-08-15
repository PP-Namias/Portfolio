import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import NotFound from '@/app/not-found';

describe('NotFound page', () => {
  it('renders 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders page not found message', () => {
    render(<NotFound />);
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders a description explaining the page is missing', () => {
    render(<NotFound />);
    expect(screen.getByText(/does not exist or has been moved/i)).toBeInTheDocument();
  });

  it('includes a link back to the home page', () => {
    render(<NotFound />);
    const link = screen.getByText(/Back to home/i).closest('a');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders within a main landmark', () => {
    render(<NotFound />);
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});
