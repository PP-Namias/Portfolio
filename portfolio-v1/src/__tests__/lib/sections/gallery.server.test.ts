import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { galleryImage: 'galleryImage' },
}));

import { fetchGalleryData } from '@/lib/sections/gallery.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchGalleryData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns gallery images when CMS returns data', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { title: 'Photo 1', mediaUrl: 'https://cdn.sanity.io/images/proj/img1.jpg', capturedAt: '2025-01-01' },
      { title: 'Photo 2', mediaUrl: 'https://cdn.sanity.io/images/proj/img2.jpg', capturedAt: '2025-06-01' },
    ]);
    const result = await fetchGalleryData();
    expect(result.galleryImages).toHaveLength(2);
    expect(result.galleryImages[0].title).toBe('Photo 1');
  });

  it('returns empty array when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchGalleryData();
    expect(result.galleryImages).toEqual([]);
  });

  it('returns empty array when CMS returns empty', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const result = await fetchGalleryData();
    expect(result.galleryImages).toEqual([]);
  });

  it('handles missing optional fields', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { title: 'Minimal' },
    ]);
    const result = await fetchGalleryData();
    expect(result.galleryImages[0].tags).toEqual([]);
    expect(result.galleryImages[0].mediaType).toBe('Image');
  });
});
