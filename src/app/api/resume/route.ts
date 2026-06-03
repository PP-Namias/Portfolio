import { NextResponse } from 'next/server';
import { createRateLimiter, getClientIp } from '@/lib/rate-limiter';

const resumeLimiter = createRateLimiter({
  namespace: 'resume',
  limit: 30,
  windowMs: 60_000,
});

const MAX_PAYLOAD_BYTES = 1_024;

export async function GET(request: Request) {
  // Reject any request with a body
  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > 0) {
    return NextResponse.json({ error: 'GET requests must not include a body.' }, { status: 400 });
  }

  const ip = getClientIp(request);

  if (await resumeLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 },
    );
  }

  // TODO: Integrate with Sanity CMS resume query when ready.
  // Currently returns the static fallback path.
  return NextResponse.json({ resumeUrl: '/resume.pdf', isActive: false });
}
