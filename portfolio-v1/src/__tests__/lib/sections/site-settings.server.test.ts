import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { siteSettings: 'siteSettings' },
}));

import { fetchSiteSettingsData } from '@/lib/sections/site-settings.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchSiteSettingsData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns site settings when CMS returns data', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      siteName: 'My Site',
      ownerName: 'John',
      contactEmail: 'john@test.com',
      footer: {
        leadText: 'Get in touch',
        copyright: '2026 John',
      },
      blog: {
        title: 'Blog',
        description: 'My blog',
      },
    });
    const result = await fetchSiteSettingsData();
    expect(result.siteName).toBe('My Site');
    expect(result.ownerName).toBe('John');
    expect(result.footer.leadText).toBe('Get in touch');
    expect(result.blog.title).toBe('Blog');
  });

  it('returns empty strings when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchSiteSettingsData();
    expect(result.siteName).toBe('');
    expect(result.ownerName).toBe('');
    expect(result.footer.leadText).toBe('');
    expect(result.footer.backToPortfolioLabel).toBe('Back to Portfolio');
    expect(result.blog.title).toBe('Blog');
    expect(result.blog.description).toBe('Thoughts on AI, software engineering, cloud development, and more.');
  });

  it('handles partial data with fallbacks', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      siteName: 'Partial Site',
    });
    const result = await fetchSiteSettingsData();
    expect(result.siteName).toBe('Partial Site');
    expect(result.ownerName).toBe('');
    expect(result.footer.leadText).toBe('');
    expect(result.blog.title).toBe('Blog');
  });
});
