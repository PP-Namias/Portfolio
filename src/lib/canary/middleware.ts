import { NextRequest, NextResponse } from 'next/server';

const CANARY_PATHS = [
  '/api/canary/admin',
  '/api/canary/config',
  '/api/canary/test',
  '/api/canary/stats',
  '/wp-admin-canary',
  '/phpmyadmin-canary',
  '/robots-canary.txt',
  '/sitemap-canary.xml',
];

const CANARY_FILE_PATHS = [
  '/.env-canary',
  '/.ssh-canary/',
  '/.aws-canary/',
  '/backups-canary/',
];

export function isCanaryPath(pathname: string): boolean {
  if (CANARY_PATHS.includes(pathname)) {
    return true;
  }

  if (CANARY_FILE_PATHS.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return false;
}

export function handleCanaryRequest(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (!isCanaryPath(pathname)) {
    return null;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Canary] Request to canary path: ${pathname}`);
  }

  const response = NextResponse.next();

  response.headers.set('X-Canary-Path', pathname);
  response.headers.set('X-Canary-Timestamp', new Date().toISOString());

  return response;
}
