import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { siteSettings: 'siteSettings' },
}));

vi.mock('@/lib/cms-content.shared', () => ({
  fallbackCmsContent: {
    seoSettings: {
      siteTitle: 'Default Title',
      siteDescription: 'Default Description',
      canonicalUrl: 'https://default.com',
      ogImageUrl: '',
      twitterImageUrl: '',
      noindex: false,
      nofollow: false,
    },
  },
}));

import { fetchSeoData } from '@/lib/sections/seo.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchSeoData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns SEO data when CMS returns siteSettings', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      defaultMetaTitle: 'Custom Title',
      defaultMetaDescription: 'Custom Description',
      canonicalUrl: 'https://custom.com',
      robotsNoindex: true,
      robotsNofollow: true,
    });
    const result = await fetchSeoData();
    expect(result.siteTitle).toBe('Custom Title');
    expect(result.canonicalUrl).toBe('https://custom.com');
    expect(result.noindex).toBe(true);
    expect(result.nofollow).toBe(true);
  });

  it('returns fallback when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchSeoData();
    expect(result.siteTitle).toBe('Default Title');
    expect(result.noindex).toBe(false);
  });

  it('returns fallback when querySanity throws', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));
    const result = await fetchSeoData();
    expect(result.siteTitle).toBe('Default Title');
  });

  it('prefers OG fields over default meta fields', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      defaultMetaTitle: 'Default',
      defaultMetaDescription: 'Default Desc',
      ogTitle: 'OG Title',
      ogDescription: 'OG Desc',
    });
    const result = await fetchSeoData();
    expect(result.siteTitle).toBe('OG Title');
    expect(result.siteDescription).toBe('OG Desc');
  });
});
