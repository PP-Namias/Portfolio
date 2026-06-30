import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

vi.mock('next/script', () => ({
  default: React.forwardRef(function MockScript(props: Record<string, string>, _ref: unknown) {
    return React.createElement('script', { 'data-testid': 'analytics-script', ...props });
  }),
}));

describe('Analytics', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('returns null when UMAMI_WEBSITE_ID is not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', '');
    const { Analytics } = await import('@/components/ui/Analytics');
    const { container } = render(React.createElement(Analytics));
    expect(container.firstChild).toBeNull();
  });

  it('renders script when UMAMI_WEBSITE_ID is set', async () => {
    vi.stubEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', 'test-id');
    const { Analytics } = await import('@/components/ui/Analytics');
    const { container } = render(React.createElement(Analytics));
    const script = container.querySelector('[data-testid="analytics-script"]');
    expect(script).not.toBeNull();
  });

  it('sets correct data attributes', async () => {
    vi.stubEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', 'test-id');
    const { Analytics } = await import('@/components/ui/Analytics');
    const { container } = render(React.createElement(Analytics));
    const script = container.querySelector('[data-testid="analytics-script"]');
    expect(script?.getAttribute('data-website-id')).toBe('test-id');
    expect(script?.getAttribute('data-host-url')).toBe('https://api-gateway.umami.dev');
  });

  it('returns null for non-secure script URL', async () => {
    vi.stubEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', 'test-id');
    vi.stubEnv('NEXT_PUBLIC_UMAMI_SCRIPT_URL', 'http://insecure.com/script.js');
    const { Analytics } = await import('@/components/ui/Analytics');
    const { container } = render(React.createElement(Analytics));
    expect(container.firstChild).toBeNull();
  });

  it('uses custom script URL when provided', async () => {
    vi.stubEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', 'test-id');
    vi.stubEnv('NEXT_PUBLIC_UMAMI_SCRIPT_URL', 'https://custom.com/script.js');
    const { Analytics } = await import('@/components/ui/Analytics');
    const { container } = render(React.createElement(Analytics));
    const script = container.querySelector('[data-testid="analytics-script"]');
    expect(script?.getAttribute('src')).toBe('https://custom.com/script.js');
  });
});
