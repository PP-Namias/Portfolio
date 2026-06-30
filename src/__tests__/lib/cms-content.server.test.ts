import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('react', () => ({
  cache: (fn: unknown) => fn,
}));

vi.mock('next/headers', () => ({
  draftMode: vi.fn().mockResolvedValue({ isEnabled: false }),
}));

vi.mock('@/lib/cache', () => ({
  getOrFetch: vi.fn().mockImplementation((_key: string, fn: () => Promise<unknown>) => fn()),
}));

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: true,
}));

vi.mock('@/lib/media-gateway', () => ({
  buildMediaGatewayUrl: vi.fn((url: string) => url),
}));

vi.mock('@/lib/cms-content.shared', () => ({
  fallbackCmsContent: {
    seoSettings: { siteTitle: 'Test', siteDescription: '', canonicalUrl: '', ogImageUrl: '', twitterImageUrl: '', noindex: false, nofollow: false },
    profile: { name: '', title: '', email: '', phone: '', location: '', github: '', linkedin: '', summary: '', highlights: { yearsExperience: 0, projectsCompleted: 0, primaryTechnologies: [] }, education: [] },
    siteSettings: { footer: { leadText: '', linkLabel: '', copyright: '', backToPortfolioLabel: '', contactPrompt: '' }, blog: { title: '', description: '', backLabel: '' } },
    hero: { roles: [], availabilityLabel: '', profileImageUrl: '' },
    about: { paragraphs: [] },
    experiences: [],
    projects: [],
    certifications: [],
    galleryImages: [],
    memberships: [],
    recommendations: [],
    socialLinks: [],
    technologies: [],
    techCategories: {},
    blogPosts: [],
  },
  fallbackBlogPosts: [],
  buildTechCategories: vi.fn().mockReturnValue({}),
}));

vi.mock('@/sanity/lib/client', () => ({
  getPublicClient: vi.fn().mockReturnValue({ fetch: vi.fn().mockResolvedValue([]) }),
  getPreviewClient: vi.fn().mockReturnValue({ fetch: vi.fn().mockResolvedValue([]), withConfig: vi.fn().mockReturnThis() }),
}));

describe('cms-content.server helpers', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'test-project');
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production');
    vi.stubEnv('SANITY_API_READ_TOKEN', 'test-token');
  });

  it('exports getCmsQueryCacheStats', async () => {
    const mod = await import('@/lib/cms-content.server');
    expect(typeof mod.getCmsQueryCacheStats).toBe('function');
  });

  it('getCmsQueryCacheStats returns stats object', async () => {
    const { getCmsQueryCacheStats } = await import('@/lib/cms-content.server');
    const stats = getCmsQueryCacheStats();
    expect(stats).toHaveProperty('hits');
    expect(stats).toHaveProperty('misses');
    expect(stats).toHaveProperty('entries');
    expect(typeof stats.hits).toBe('number');
  });

  it('exports resetCmsQueryCacheStats', async () => {
    const mod = await import('@/lib/cms-content.server');
    expect(typeof mod.resetCmsQueryCacheStats).toBe('function');
  });

  it('resetCmsQueryCacheStats resets counters', async () => {
    const { getCmsQueryCacheStats, resetCmsQueryCacheStats } = await import('@/lib/cms-content.server');
    resetCmsQueryCacheStats();
    const stats = getCmsQueryCacheStats();
    expect(stats.hits).toBe(0);
    expect(stats.misses).toBe(0);
  });

  it('exports getCmsContent function', async () => {
    const mod = await import('@/lib/cms-content.server');
    expect(typeof mod.getCmsContent).toBe('function');
  });

  it('getCmsContent returns CmsContent object', async () => {
    const { getCmsContent } = await import('@/lib/cms-content.server');
    const content = await getCmsContent();
    expect(content).toBeDefined();
    expect(content.seoSettings).toBeDefined();
    expect(content.profile).toBeDefined();
    expect(content.hero).toBeDefined();
  });
});
