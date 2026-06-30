import { describe, it, expect, vi } from 'vitest';

vi.mock('@sanity/client', () => ({
  createClient: vi.fn().mockReturnValue({
    fetch: vi.fn(),
    getDocument: vi.fn(),
    config: {},
  }),
}));

vi.mock('@/lib/site-config', () => ({
  SANITY_PROJECT_ID: 'fallback-project-id',
  SANITY_DATASET: 'production',
}));

describe('sanity client factory', () => {
  it('exports API_VERSION constant', async () => {
    const { API_VERSION } = await import('@/sanity/lib/client');
    expect(API_VERSION).toBe('2026-02-19');
  });

  it('getPublicClient returns a client', async () => {
    const { createClient } = await import('@sanity/client');
    const { getPublicClient } = await import('@/sanity/lib/client');

    const client = getPublicClient();
    expect(client).toBeDefined();
    expect(createClient).toHaveBeenCalled();
  });

  it('getPublicClient config has published perspective and stega false', async () => {
    const { createClient } = await import('@sanity/client');
    const { getPublicClient } = await import('@/sanity/lib/client');

    getPublicClient();
    const callArgs = vi.mocked(createClient).mock.calls[0][0];
    expect(callArgs.perspective).toBe('published');
    expect(callArgs.stega).toBe(false);
  });

  it('getPreviewClient config has previewDrafts perspective and studioUrl', async () => {
    const { createClient } = await import('@sanity/client');
    const { getPreviewClient } = await import('@/sanity/lib/client');

    getPreviewClient();
    const previewCalls = vi.mocked(createClient).mock.calls.filter(
      (call) => call[0].perspective === 'previewDrafts',
    );
    expect(previewCalls.length).toBeGreaterThan(0);
    expect(previewCalls[0][0].stega).toEqual({ studioUrl: '/studio' });
  });

  it('getReadClient config includes read token from env', async () => {
    vi.stubEnv('SANITY_API_READ_TOKEN', 'read-token-123');
    const { createClient } = await import('@sanity/client');
    const { getReadClient } = await import('@/sanity/lib/client');

    getReadClient();
    const readCalls = vi.mocked(createClient).mock.calls.filter(
      (call) => call[0].token === 'read-token-123',
    );
    expect(readCalls.length).toBeGreaterThan(0);
    expect(readCalls[0][0].perspective).toBe('published');
  });

  it('all clients use the correct apiVersion', async () => {
    const { createClient } = await import('@sanity/client');
    const { getPublicClient, getPreviewClient, getReadClient } = await import('@/sanity/lib/client');

    getPublicClient();
    getPreviewClient();
    getReadClient();

    for (const call of vi.mocked(createClient).mock.calls) {
      expect(call[0].apiVersion).toBe('2026-02-19');
    }
  });
});
