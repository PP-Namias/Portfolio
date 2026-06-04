import { buildMediaGatewayUrl } from '@/lib/media-gateway';
import { getOrFetch } from '@/lib/cache';
import { NextResponse } from 'next/server';

const fallbackResumeUrl = '/resume.pdf';
const sanityApiVersion = '2021-06-07';
const RESUME_CACHE_TTL_MS = Number(process.env.CACHE_TTL_DEFAULT) || 300_000;
const RESUME_CACHE_STALE_MS = Number(process.env.CACHE_TTL_STALE) || 60_000;

type ResumeQueryResult = {
  resumeUrl?: string;
  isActive?: boolean;
  fileName?: string;
  _id?: string;
};

function getSanityAuthHeaders() {
  const token = process.env.SANITY_API_READ_TOKEN?.trim();

  return token ? ({ Authorization: `Bearer ${token}` } as const) : undefined;
}

function buildResumeQueryUrl() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();

  if (!projectId || !dataset) {
    return null;
  }

  const query = encodeURIComponent(
    '*[_type == "resume" && isActive == true] | order(_updatedAt desc){"resumeUrl": coalesce(resumeFile.asset->url, resumeUrl, "/resume.pdf"), "isActive": isActive, "fileName": resumeFile.asset->originalFilename, "_id": _id}'
  );

  return `https://${projectId}.api.sanity.io/v${sanityApiVersion}/data/query/${dataset}?query=${query}`;
}

async function fetchResumeFromSanity(): Promise<{ resumeUrl: string; isActive: boolean; activeResumeCount: number; hasMultipleActiveResumes: boolean }> {
  const queryUrl = buildResumeQueryUrl();

  if (!queryUrl) {
    return { resumeUrl: fallbackResumeUrl, isActive: false, activeResumeCount: 0, hasMultipleActiveResumes: false };
  }

  const response = await fetch(queryUrl, {
    headers: getSanityAuthHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    return { resumeUrl: fallbackResumeUrl, isActive: false, activeResumeCount: 0, hasMultipleActiveResumes: false };
  }

  const payload = (await response.json()) as {
    result?: ResumeQueryResult | ResumeQueryResult[];
  };
  const activeResumes = Array.isArray(payload.result)
    ? payload.result
    : payload.result
      ? [payload.result]
      : [];
  const selectedResume = activeResumes.find((resume) => typeof resume.resumeUrl === 'string' && resume.resumeUrl.trim().length > 0) ?? activeResumes[0];
  const resumeUrl = buildMediaGatewayUrl(selectedResume?.resumeUrl?.trim() || '', { sign: true }) || fallbackResumeUrl;

  return {
    resumeUrl,
    isActive: activeResumes.length > 0,
    activeResumeCount: activeResumes.length,
    hasMultipleActiveResumes: activeResumes.length > 1,
  };
}

export async function GET() {
  try {
    const result = await getOrFetch('sanity:resume', () => fetchResumeFromSanity(), {
      ttlMs: RESUME_CACHE_TTL_MS,
      staleMs: RESUME_CACHE_STALE_MS,
      tags: ['cms:resume'],
    });

    const response = NextResponse.json(result.data);
    response.headers.set('Cache-Control', `public, max-age=${Math.floor(RESUME_CACHE_TTL_MS / 1000)}, stale-while-revalidate=${Math.floor(RESUME_CACHE_STALE_MS / 1000)}`);
    return response;
  } catch {
    return NextResponse.json({ resumeUrl: fallbackResumeUrl, isActive: false, activeResumeCount: 0, hasMultipleActiveResumes: false });
  }
}