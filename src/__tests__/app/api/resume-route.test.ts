import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/resume/route';
import { buildMediaGatewayUrl } from '@/lib/media-gateway';
import { flush } from '@/lib/cache';

const fetchMock = vi.fn();
const sanityResumeUrl = 'https://cdn.sanity.io/files/nl0qw78w/production/529fd6d835d66c9d239aadd53f63a35932e8ac95.pdf';
const fallbackResumeUrl = '/resume.pdf';

describe('/api/resume route', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as typeof fetch;
    await flush();
  });

  it('falls back when the Sanity project configuration is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '');
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', '');

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toMatchObject({
      resumeUrl: fallbackResumeUrl,
      isActive: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uses the newest active resume when multiple active documents exist', async () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'nl0qw78w');
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production');

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        result: [
          {
            resumeUrl: '/old-resume.pdf',
            isActive: true,
            fileName: 'Old Resume.pdf',
            _id: 'resume-old',
          },
          {
            resumeUrl: '/new-resume.pdf',
            isActive: true,
            fileName: 'New Resume.pdf',
            _id: 'resume-new',
          },
        ],
      }),
    });

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      resumeUrl: '/old-resume.pdf',
      isActive: true,
      activeResumeCount: 2,
      hasMultipleActiveResumes: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('falls back when the Sanity request fails', async () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'nl0qw78w');
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production');

    fetchMock.mockResolvedValue({ ok: false, json: async () => ({}) });

    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({
      resumeUrl: fallbackResumeUrl,
      isActive: false,
      activeResumeCount: 0,
      hasMultipleActiveResumes: false,
    });
  });

  it('falls back when the Sanity request throws', async () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'nl0qw78w');
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production');

    fetchMock.mockRejectedValue(new Error('network down'));

    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({
      resumeUrl: fallbackResumeUrl,
      isActive: false,
      activeResumeCount: 0,
      hasMultipleActiveResumes: false,
    });
  });

  it('rewrites a Sanity resume asset through the gateway', async () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'nl0qw78w');
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production');

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        result: {
          resumeUrl: sanityResumeUrl,
          isActive: true,
          fileName: 'Resume.pdf',
          _id: 'resume-1',
        },
      }),
    });

    const response = await GET();
    const data = await response.json();

    expect(data.resumeUrl).toBe(buildMediaGatewayUrl(sanityResumeUrl, { sign: true }));
  });
});