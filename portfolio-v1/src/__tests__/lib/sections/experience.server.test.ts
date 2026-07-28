import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { experience: 'experience' },
}));

import { fetchExperienceData } from '@/lib/sections/experience.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchExperienceData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns experiences when CMS returns data', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { role: 'Engineer', company: 'Acme', startDate: '2024-01-01', summary: 'Built things' },
      { role: 'Senior', company: 'Beta', startDate: '2025-01-01', summary: 'Led team' },
    ]);
    const result = await fetchExperienceData();
    expect(result.experiences).toHaveLength(2);
    expect(result.experiences[0].position).toBe('Engineer');
    expect(result.experiences[1].company).toBe('Beta');
  });

  it('returns empty array when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchExperienceData();
    expect(result.experiences).toEqual([]);
  });

  it('returns empty array when CMS returns empty', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const result = await fetchExperienceData();
    expect(result.experiences).toEqual([]);
  });

  it('handles missing optional fields', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { role: 'Dev' },
    ]);
    const result = await fetchExperienceData();
    expect(result.experiences[0].technologies).toEqual([]);
    expect(result.experiences[0].endedAt).toBeNull();
    expect(result.experiences[0].relatedProjects).toEqual([]);
  });
});
