import { NextRequest, NextResponse } from 'next/server';
import { checkBot } from '@/lib/bot-blocker';
import { isGlobalRateLimited } from '@/lib/rate-limiter';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent');

  const botResult = checkBot(userAgent, pathname);
  if (botResult.blocked) {
    return new NextResponse(JSON.stringify({
      error: "I'm a teapot",
      message: 'Blocked by bot detection',
      statusCode: 418,
    }), {
      status: 418,
      headers: {
        'Content-Type': 'application/json',
        'X-Blocked-Reason': botResult.reason || 'unknown',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }

  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || '127.0.0.1';

    const isLimited = await isGlobalRateLimited(ip);
    if (isLimited) {
      return new NextResponse(JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Try again later.',
        statusCode: 429,
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
      const contentType = request.headers.get('content-type') || '';
      if (!contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|fonts/|og-image.svg).*)',
  ],
};
