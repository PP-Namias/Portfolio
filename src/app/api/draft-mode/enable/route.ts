import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter, getClientIp } from '@/lib/rate-limiter';

const draftModeLimiter = createRateLimiter({
  namespace: 'draft-mode',
  limit: 5,
  windowMs: 900_000,
});

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);

  if (await draftModeLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait and try again.' },
      { status: 429 },
    );
  }

  // TODO: When next-sanity draft mode integration is added,
  // wire this up to the Presentation tool's enable-draft-mode
  // flow. Currently returns a stub so rate limiting is in place
  // before the full implementation.
  const secret = request.nextUrl.searchParams.get('secret');
  if (!secret) {
    return NextResponse.json(
      { error: 'Secret is required.' },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    draftMode: false,
    note: 'Draft mode endpoint stub. Full integration pending Sanity CMS setup.',
  });
}
