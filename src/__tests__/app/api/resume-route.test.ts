import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/resume/route';

const fetchMock = vi.fn();

describe('/api/resume route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as typeof fetch;
  });

  it('falls back when the Sanity project configuration is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '');
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', '');

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      resumeUrl: '/resume.pdf',
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
      resumeUrl: '/resume.pdf',
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
      resumeUrl: '/resume.pdf',
      isActive: false,
      activeResumeCount: 0,
      hasMultipleActiveResumes: false,
    });
  });
});