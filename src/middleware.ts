import { NextRequest, NextResponse } from 'next/server';
import { checkBot } from '@/lib/bot-blocker';

export function middleware(request: NextRequest) {
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
    '/((?!_next/static|_next/image|favicon.ico|fonts/|og-image.svg).*)',
  ],
};
