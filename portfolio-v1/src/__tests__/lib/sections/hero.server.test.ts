import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { profile: 'profile' },
}));

import { fetchHeroData } from '@/lib/sections/hero.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchHeroData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns hero data when CMS returns profile', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      fullName: 'John Doe',
      title: 'Engineer',
      email: 'john@test.com',
      location: 'PH',
      heroRoles: ['Developer', 'Designer'],
      availabilityLabel: 'Available',
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/john' },
      ],
    });
    const result = await fetchHeroData();
    expect(result.profile.name).toBe('John Doe');
    expect(result.hero.roles).toEqual(['Developer', 'Designer']);
    expect(result.socialLinks).toHaveLength(1);
  });

  it('returns empty data when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchHeroData();
    expect(result.profile.name).toBe('');
    expect(result.hero.roles).toEqual([]);
    expect(result.socialLinks).toEqual([]);
  });

  it('deduplicates social links', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/a' },
        { platform: 'github', url: 'https://github.com/b' },
      ],
    });
    const result = await fetchHeroData();
    expect(result.socialLinks).toHaveLength(1);
  });

  it('handles missing fields gracefully', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({});
    const result = await fetchHeroData();
    expect(result.profile.name).toBe('');
    expect(result.hero.roles).toEqual([]);
  });
});
