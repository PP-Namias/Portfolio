import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { techStack: 'techStack' },
}));

const mockCategories = { Frontend: [{ name: 'React' }], Backend: [{ name: 'Node' }] };

vi.mock('@/lib/cms-content.shared', () => ({
  buildTechCategories: vi.fn(() => mockCategories),
}));

import { fetchTechStackData } from '@/lib/sections/tech-stack.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchTechStackData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns technologies when CMS returns data', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      technologies: [{ name: 'React', category: 'Frontend' }],
    });
    const result = await fetchTechStackData();
    expect(result.technologies).toHaveLength(1);
    expect(result.technologies[0].name).toBe('React');
    expect(result.techCategories).toEqual(mockCategories);
  });

  it('returns empty array when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchTechStackData();
    expect(result.technologies).toEqual([]);
    expect(result.techCategories).toEqual(mockCategories);
  });

  it('returns empty array when technologies field is missing', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({});
    const result = await fetchTechStackData();
    expect(result.technologies).toEqual([]);
  });
});
