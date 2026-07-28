import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { project: 'project' },
}));

import { fetchProjectsData } from '@/lib/sections/projects.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchProjectsData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns projects when CMS returns data', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { title: 'Project A', slug: 'proj-a', summary: 'A great project', technologies: ['React'], year: 2026 },
      { title: 'Project B', slug: 'proj-b', summary: 'Another one', technologies: ['Node'], year: 2025 },
    ]);
    const result = await fetchProjectsData();
    expect(result.projects).toHaveLength(2);
    expect(result.projects[0].title).toBe('Project A');
    expect(result.projects[1].tags).toEqual(['Node']);
  });

  it('returns empty array when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchProjectsData();
    expect(result.projects).toEqual([]);
  });

  it('returns empty array when CMS returns empty', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const result = await fetchProjectsData();
    expect(result.projects).toEqual([]);
  });

  it('deduplicates projects by key', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { title: 'Same', slug: 'same-proj' },
      { title: 'Same', slug: 'same-proj' },
    ]);
    const result = await fetchProjectsData();
    expect(result.projects).toHaveLength(1);
  });

  it('handles missing optional fields', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { title: 'Minimal' },
    ]);
    const result = await fetchProjectsData();
    expect(result.projects[0].tags).toEqual([]);
    expect(result.projects[0].gallery).toEqual([]);
  });
});
