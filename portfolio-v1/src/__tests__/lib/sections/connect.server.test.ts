import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { profile: 'profile' },
}));

import { fetchConnectData } from '@/lib/sections/connect.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchConnectData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns social links when CMS returns data', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/test' },
        { platform: 'Twitter', url: 'https://twitter.com/test' },
      ],
    });
    const result = await fetchConnectData();
    expect(result.socialLinks).toHaveLength(2);
    expect(result.socialLinks[0].name).toBe('github');
    expect(result.socialLinks[1].link).toBe('https://twitter.com/test');
  });

  it('returns empty array when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchConnectData();
    expect(result.socialLinks).toEqual([]);
  });

  it('deduplicates social links by name', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/a' },
        { platform: 'github', url: 'https://github.com/b' },
      ],
    });
    const result = await fetchConnectData();
    expect(result.socialLinks).toHaveLength(1);
  });

  it('filters out invalid links without platform or url', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/test' },
        { platform: '', url: '' },
        { url: 'https://example.com' },
      ],
    });
    const result = await fetchConnectData();
    expect(result.socialLinks).toHaveLength(1);
  });

  it('uses the icon as the identity when platform is the generic message placeholder', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      socialLinks: [
        {
          _key: 'discord',
          platform: 'message',
          icon: 'discord',
          url: 'https://discord.com/users/683914336376455200',
        },
      ],
    });
    const result = await fetchConnectData();
    expect(result.socialLinks).toHaveLength(1);
    expect(result.socialLinks[0].name).toBe('discord');
    expect(result.socialLinks[0].label).toBe('Discord');
    expect(result.socialLinks[0].icon).toBe('discord');
  });

  it('keeps the generic message label when no specific icon is set', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      socialLinks: [{ platform: 'message', url: 'https://m.me/example' }],
    });
    const result = await fetchConnectData();
    expect(result.socialLinks).toHaveLength(1);
    expect(result.socialLinks[0].name).toBe('message');
    expect(result.socialLinks[0].label).toBe('Message');
  });
});
