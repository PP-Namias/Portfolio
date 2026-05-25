import { NextResponse } from 'next/server';

const fallbackResumeUrl = '/resume.pdf';
const sanityApiVersion = '2021-06-07';

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
    '*[_type == "resume" && isActive == true][0]{"resumeUrl": coalesce(resumeFile.asset->url, resumeUrl, "/resume.pdf"), "isActive": isActive, "fileName": resumeFile.asset->originalFilename}'
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
      return NextResponse.json({ resumeUrl: fallbackResumeUrl, isActive: false });
    }

    const payload = (await response.json()) as {
      result?: { resumeUrl?: string; isActive?: boolean };
    };
    const resumeUrl = payload.result?.resumeUrl?.trim() || fallbackResumeUrl;

    return NextResponse.json({
      resumeUrl,
      isActive: Boolean(payload.result?.isActive),
    });
  } catch {
    return NextResponse.json({ resumeUrl: fallbackResumeUrl, isActive: false });
  }
}