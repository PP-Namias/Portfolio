import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { certification: 'certification' },
}));

import { fetchCertificationsData } from '@/lib/sections/certifications.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchCertificationsData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns certifications when CMS returns data', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { title: 'Cert A', issuer: 'Org A', issuedAt: '2025-01-01' },
      { title: 'Cert B', issuer: 'Org B', issuedAt: '2025-06-01' },
    ]);
    const result = await fetchCertificationsData();
    expect(result.certifications).toHaveLength(2);
    expect(result.certifications[0].title).toBe('Cert A');
    expect(result.certifications[1].issuer).toBe('Org B');
  });

  it('returns empty array when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchCertificationsData();
    expect(result.certifications).toEqual([]);
  });

  it('returns empty array when CMS returns empty array', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const result = await fetchCertificationsData();
    expect(result.certifications).toEqual([]);
  });

  it('handles missing optional fields', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { title: 'Minimal' },
    ]);
    const result = await fetchCertificationsData();
    expect(result.certifications[0].tags).toEqual([]);
    expect(result.certifications[0].issuer).toBe('');
  });
});
