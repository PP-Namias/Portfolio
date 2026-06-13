import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  '/api/chat': { limit: 20, windowMs: 60000 },
  '/api/sanity/webhook': { limit: 30, windowMs: 60000 },
  '/api/sanity/live': { limit: 60, windowMs: 60000 },
  '/api/media': { limit: 100, windowMs: 60000 },
};

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

function getRateLimitKey(pathname: string): keyof typeof RATE_LIMITS | null {
  const keys = Object.keys(RATE_LIMITS) as Array<keyof typeof RATE_LIMITS>;
  for (const key of keys) {
    if (pathname.startsWith(key)) {
      return key;
    }
  }
  return null;
}

function isRateLimited(ip: string, routeKey: keyof typeof RATE_LIMITS): boolean {
  const config = RATE_LIMITS[routeKey];
  if (!config) return false;

  const now = Date.now();
  const key = `${routeKey}:${ip}`;
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > config.limit;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const apiRouteKey = getRateLimitKey(pathname);
  if (apiRouteKey) {
    const ip = getClientIp(request);
    if (isRateLimited(ip, apiRouteKey)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }
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
  matcher: ['/api/:path*'],
};
