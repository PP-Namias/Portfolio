import { NextResponse } from 'next/server';

const fallbackResumeUrl = 'https://cdn.sanity.io/files/nl0qw78w/production/529fd6d835d66c9d239aadd53f63a35932e8ac95.pdf';
const sanityApiVersion = '2021-06-07';

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

export async function GET() {
  const queryUrl = buildResumeQueryUrl();

  if (!queryUrl) {
    return NextResponse.json({ resumeUrl: fallbackResumeUrl, isActive: false });
  }

  try {
    const response = await fetch(queryUrl, {
      headers: getSanityAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ resumeUrl: fallbackResumeUrl, isActive: false, activeResumeCount: 0, hasMultipleActiveResumes: false });
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
    const resumeUrl = selectedResume?.resumeUrl?.trim() || fallbackResumeUrl;

    return NextResponse.json({
      resumeUrl,
      isActive: activeResumes.length > 0,
      activeResumeCount: activeResumes.length,
      hasMultipleActiveResumes: activeResumes.length > 1,
    });
  } catch {
    return NextResponse.json({ resumeUrl: fallbackResumeUrl, isActive: false, activeResumeCount: 0, hasMultipleActiveResumes: false });
  }
}