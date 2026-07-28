import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreateClient = vi.fn();
vi.mock('@sanity/client', () => ({
  createClient: (...args: unknown[]) => {
    mockCreateClient(...args);
    return { fetch: vi.fn() };
  },
}));

vi.mock('@/lib/site-config', () => ({
  SANITY_PROJECT_ID: 'mock-project-id',
  SANITY_DATASET: 'mock-dataset',
}));

describe('Sanity client configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_SANITY_DATASET;
    delete process.env.SANITY_API_READ_TOKEN;
  });

  it('getPublicClient creates client with project ID from site-config fallback', async () => {
    process.env.NODE_ENV = 'test';
    const { getPublicClient } = await import('@/sanity/lib/client');
    getPublicClient();
    expect(mockCreateClient).toHaveBeenCalled();
    const callArgs = mockCreateClient.mock.calls[0][0];
    expect(callArgs.projectId).toBe('mock-project-id');
    expect(callArgs.dataset).toBe('mock-dataset');
  });

  it('getPublicClient uses CDN in production', async () => {
    process.env.NODE_ENV = 'production';
    const { getPublicClient } = await import('@/sanity/lib/client');
    getPublicClient();
    expect(mockCreateClient.mock.calls[0][0].useCdn).toBe(true);
  });

  it('getPreviewClient uses previewDrafts perspective', async () => {
    process.env.NODE_ENV = 'test';
    const { getPreviewClient } = await import('@/sanity/lib/client');
    getPreviewClient();
    const previewCall = mockCreateClient.mock.calls.find((c: unknown[]) => c[0].perspective === 'previewDrafts');
    expect(previewCall).toBeDefined();
  });

  it('getPreviewClient has stega enabled', async () => {
    process.env.NODE_ENV = 'test';
    const { getPreviewClient } = await import('@/sanity/lib/client');
    getPreviewClient();
    const previewCall = mockCreateClient.mock.calls.find((c: unknown[]) => c[0].stega);
    expect(previewCall).toBeDefined();
    expect(previewCall[0].stega).toEqual({ studioUrl: '/studio' });
  });

  it('getReadClient uses SANITY_API_READ_TOKEN when provided', async () => {
    process.env.SANITY_API_READ_TOKEN = 'mock-read-token';
    const { getReadClient } = await import('@/sanity/lib/client');
    getReadClient();
    const readCall = mockCreateClient.mock.calls.find((c: unknown[]) => c[0].token === 'mock-read-token');
    expect(readCall).toBeDefined();
  });

  it('getReadClient uses published perspective', async () => {
    process.env.SANITY_API_READ_TOKEN = 'mock-read-token';
    const { getReadClient } = await import('@/sanity/lib/client');
    getReadClient();
    const readCall = mockCreateClient.mock.calls.find((c: unknown[]) => c[0].perspective === 'published' && c[0].token);
    expect(readCall).toBeDefined();
  });

  it('defineLive creates live client with correct config', async () => {
    const { defineLive } = await import('@/sanity/lib/live');
    defineLive({
      client: { projectId: 'live-proj', dataset: 'live-ds' },
      serverToken: 'live-token',
      browserToken: 'browser-token',
    });
    const liveCall = mockCreateClient.mock.calls.find((c: unknown[]) => c[0].token === 'live-token');
    expect(liveCall).toBeDefined();
    expect(liveCall[0].projectId).toBe('live-proj');
    expect(liveCall[0].dataset).toBe('live-ds');
  });

  it('defineLive returns sanityFetch, SanityLive, and browserToken', async () => {
    const { defineLive } = await import('@/sanity/lib/live');
    const result = defineLive({ client: {}, browserToken: 'browser-token' });
    expect(result).toHaveProperty('sanityFetch');
    expect(result).toHaveProperty('SanityLive');
    expect(result).toHaveProperty('browserToken');
    expect(result.browserToken).toBe('browser-token');
  });
});
