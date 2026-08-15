import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { aboutSection: 'aboutSection' },
}));

import { fetchAboutData } from '@/lib/sections/about.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchAboutData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns paragraphs from portable text content', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      aboutContent: [
        { children: [{ text: 'Paragraph 1' }] },
        { children: [{ text: 'Paragraph 2' }] },
      ],
    });
    const result = await fetchAboutData();
    expect(result.paragraphs).toEqual(['Paragraph 1', 'Paragraph 2']);
  });

  it('returns paragraphs from legacy field', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({
      aboutParagraphs: ['Legacy para 1', 'Legacy para 2'],
    });
    const result = await fetchAboutData();
    expect(result.paragraphs).toEqual(['Legacy para 1', 'Legacy para 2']);
  });

  it('returns empty paragraphs when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchAboutData();
    expect(result.paragraphs).toEqual([]);
  });

  it('returns empty paragraphs when both content types are empty', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue({});
    const result = await fetchAboutData();
    expect(result.paragraphs).toEqual([]);
  });
});
