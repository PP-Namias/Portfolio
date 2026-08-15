import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

vi.mock('next/script', () => ({
  default: ({ src, ...props }: Record<string, unknown>) => <script src={typeof src === 'string' ? src : undefined} {...props} />,
}));

const ORIGINAL_ENV = process.env;

import { Analytics } from '@/components/ui/Analytics';

describe('Analytics', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  it('returns null when website ID is not set', () => {
    delete process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
    const { container } = render(<Analytics />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when script URL is insecure', () => {
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'test-id';
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL = 'http://insecure.example.com/script.js';
    const { container } = render(<Analytics />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when host URL is insecure', () => {
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'test-id';
    process.env.NEXT_PUBLIC_UMAMI_HOST_URL = 'http://insecure.example.com';
    const { container } = render(<Analytics />);
    expect(container.innerHTML).toBe('');
  });

  it('renders a script element with correct attributes when env vars are set', () => {
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'test-id';
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';
    process.env.NEXT_PUBLIC_UMAMI_HOST_URL = 'https://api-gateway.umami.dev';
    process.env.NEXT_PUBLIC_UMAMI_DOMAINS = 'example.com';
    const { container } = render(<Analytics />);
    const script = container.querySelector('script');
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute('src', 'https://cloud.umami.is/script.js');
  });
});
