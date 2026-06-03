import { NextResponse } from 'next/server';
import { createRateLimiter, getClientIp } from '@/lib/rate-limiter';

const resumeLimiter = createRateLimiter({
  namespace: 'resume',
  limit: 30,
  windowMs: 60_000,
});

export async function GET(request: Request) {
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
