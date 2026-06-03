import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter, getClientIp } from '@/lib/rate-limiter';

const mediaLimiter = createRateLimiter({
  namespace: 'media',
  limit: 100,
  windowMs: 60_000,
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const ip = getClientIp(request);

  if (await mediaLimiter.isRateLimited(ip)) {
    return new Response('Too many requests. Please wait a moment and try again.', {
      status: 429,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex, nofollow' },
    });
  }

  // TODO: Implement Sanity media gateway proxy when the full
  // media pipeline is integrated. For now, returns 501.
  const { path } = await context.params;
  return new Response(`Media gateway not yet implemented. Path: ${path?.join('/')}`, {
    status: 501,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex, nofollow' },
  });
}

export async function POST() {
  return new Response('Method not allowed. Media endpoint only supports GET.', {
    status: 405,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
