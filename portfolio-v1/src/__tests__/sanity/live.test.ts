import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn().mockResolvedValue([]);

vi.mock('@sanity/client', () => ({
  createClient: vi.fn().mockReturnValue({
    fetch: mockFetch,
  }),
}));

vi.mock('@/lib/site-config', () => ({
  SANITY_PROJECT_ID: 'test-project-id',
  SANITY_DATASET: 'test-dataset',
}));

describe('sanity live defineLive', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('returns sanityFetch, SanityLive, and browserToken', async () => {
    const { defineLive } = await import('@/sanity/lib/live');
    const result = defineLive({});

    expect(result).toHaveProperty('sanityFetch');
    expect(result).toHaveProperty('SanityLive');
    expect(result).toHaveProperty('browserToken');
  });

  it('sanityFetch calls the cached client fetch', async () => {
    const { defineLive } = await import('@/sanity/lib/live');
    const { sanityFetch } = defineLive({});

    await sanityFetch('*[_type == "project"]');

    expect(mockFetch).toHaveBeenCalledWith('*[_type == "project"]', {});
  });

  it('sanityFetch passes params to client fetch', async () => {
    const { defineLive } = await import('@/sanity/lib/live');
    const { sanityFetch } = defineLive({});

    await sanityFetch('*[_type == "project"][slug == $slug]', { slug: 'test' });

    expect(mockFetch).toHaveBeenCalledWith('*[_type == "project"][slug == $slug]', { slug: 'test' });
  });

  it('SanityLive renders null', async () => {
    const { defineLive } = await import('@/sanity/lib/live');
    const { SanityLive } = defineLive({});

    expect(SanityLive()).toBeNull();
  });

  it('browserToken is passed through from options', async () => {
    const { defineLive } = await import('@/sanity/lib/live');
    const { browserToken } = defineLive({ browserToken: 'my-browser-token' });

    expect(browserToken).toBe('my-browser-token');
  });

  it('browserToken is undefined when not provided', async () => {
    const { defineLive } = await import('@/sanity/lib/live');
    const { browserToken } = defineLive({});

    expect(browserToken).toBeUndefined();
  });

  it('exports API_VERSION constant', async () => {
    const { API_VERSION } = await import('@/sanity/lib/live');
    expect(API_VERSION).toBe('2026-02-19');
  });

  it('createClient is called with correct default config', async () => {
    const { createClient } = await import('@sanity/client');
    const { defineLive } = await import('@/sanity/lib/live');

    defineLive({});

    expect(createClient).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'test-project-id',
        dataset: 'test-dataset',
        apiVersion: '2026-02-19',
        useCdn: true,
        perspective: 'published',
      }),
    );
  });

  it('sanityFetch defaults params to empty object', async () => {
    const { defineLive } = await import('@/sanity/lib/live');
    const { sanityFetch } = defineLive({});

    await sanityFetch('*[]');

    expect(mockFetch).toHaveBeenCalledWith('*[]', {});
  });
});
