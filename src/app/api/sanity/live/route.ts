import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createRateLimiter, getClientIp } from '@/lib/rate-limiter';

const liveLimiter = createRateLimiter({
  namespace: 'sanity-live',
  limit: 5,
  windowMs: 900_000,
});

const MAX_PAYLOAD_BYTES = 1_024;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nl0qw78w';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

function withCors(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export async function GET(request: NextRequest) {
  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > 0) {
    return withCors(
      NextResponse.json(
        { error: 'GET requests must not include a body.' },
        { status: 400 },
      ),
    );
  }

  const ip = getClientIp(request);

  if (await liveLimiter.isRateLimited(ip)) {
    return withCors(
      NextResponse.json(
        { error: 'Too many requests. Please wait and try again.' },
        { status: 429 },
      ),
    );
  }

  if (request.nextUrl.searchParams.get('enable') === '1') {
    return withCors(
      NextResponse.json({
        ok: true,
        enabled: false,
        env: { projectId, dataset },
        revalidatePaths: ['/', '/blog', '/blog/[slug]', '/sitemap.xml'],
      }),
    );
  }

  return withCors(
    NextResponse.json({
      ok: false,
      error: 'Pass ?enable=1 to test the draft-mode connection.',
    }),
  );
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}
