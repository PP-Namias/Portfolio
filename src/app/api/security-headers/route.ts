import { NextResponse } from 'next/server';

interface SecurityHeader {
  name: string;
  value: string | null;
  status: 'present' | 'missing' | 'needs-improvement';
  recommendation?: string;
}

const IDEAL_HEADERS: Array<{
  name: string;
  validator: (value: string, allHeaders: Headers) => { status: SecurityHeader['status']; recommendation?: string };
}> = [
  {
    name: 'Content-Security-Policy',
    validator: (value) => {
      if (!value) return { status: 'missing', recommendation: 'Add Content-Security-Policy header' };
      const hasScriptSrc = value.includes('script-src');
      const hasUnsafeInline = value.includes("'unsafe-inline'");
      if (hasScriptSrc && hasUnsafeInline) {
        return { status: 'needs-improvement', recommendation: 'CSP allows unsafe-inline on script-src. Consider nonce-based approach for production.' };
      }
      return { status: 'present' };
    },
  },
  {
    name: 'Strict-Transport-Security',
    validator: (value) => {
      if (!value) return { status: 'missing', recommendation: 'Add Strict-Transport-Security header' };
      const hasPreload = value.includes('preload');
      const maxAge = Number(value.match(/max-age=(\d+)/)?.[1] || 0);
      if (maxAge < 31536000) {
        return { status: 'needs-improvement', recommendation: `HSTS max-age is ${maxAge}s, should be >= 31536000s (1 year)` };
      }
      if (!hasPreload) {
        return { status: 'needs-improvement', recommendation: 'HSTS missing preload directive' };
      }
      return { status: 'present' };
    },
  },
  {
    name: 'X-Content-Type-Options',
    validator: (value) => {
      if (!value) return { status: 'missing', recommendation: 'Add X-Content-Type-Options: nosniff' };
      return value === 'nosniff' ? { status: 'present' } : { status: 'needs-improvement', recommendation: `Expected 'nosniff', got '${value}'` };
    },
  },
  {
    name: 'X-Frame-Options',
    validator: (value, allHeaders) => {
      if (value && (value === 'DENY' || value === 'SAMEORIGIN')) return { status: 'present' };
      const csp = allHeaders.get('Content-Security-Policy') || '';
      if (csp.includes('frame-ancestors')) return { status: 'present' };
      return { status: 'missing', recommendation: 'Add X-Frame-Options: DENY or CSP frame-ancestors directive' };
    },
  },
  {
    name: 'Referrer-Policy',
    validator: (value) => {
      if (!value) return { status: 'missing', recommendation: 'Add Referrer-Policy header' };
      const secure = ['no-referrer', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin'];
      return secure.includes(value) ? { status: 'present' } : { status: 'needs-improvement', recommendation: `Consider stricter policy: 'strict-origin-when-cross-origin'` };
    },
  },
  {
    name: 'Permissions-Policy',
    validator: (value) => {
      if (!value) return { status: 'missing', recommendation: 'Add Permissions-Policy header to restrict browser features' };
      return { status: 'present' };
    },
  },
  {
    name: 'Cross-Origin-Opener-Policy',
    validator: (value) => {
      if (!value) return { status: 'missing', recommendation: 'Add Cross-Origin-Opener-Policy: same-origin' };
      return ['same-origin', 'same-origin-allow-popups'].includes(value) ? { status: 'present' } : { status: 'needs-improvement', recommendation: `Expected 'same-origin', got '${value}'` };
    },
  },
];

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://namias.tech';

  try {
    const response = await fetch(url, { method: 'HEAD', cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    const headers: SecurityHeader[] = IDEAL_HEADERS.map(({ name, validator }) => {
      const value = response.headers.get(name);
      const result = value ? validator(value, response.headers) : { status: 'missing' as const, recommendation: `Add ${name} header` };
      return { name, value, ...result };
    });

    const present = headers.filter((h) => h.status === 'present').length;
    const missing = headers.filter((h) => h.status === 'missing').length;
    const needsImprovement = headers.filter((h) => h.status === 'needs-improvement').length;

    return NextResponse.json({
      url,
      timestamp: new Date().toISOString(),
      score: Math.round((present / IDEAL_HEADERS.length) * 100),
      summary: `${present}/${IDEAL_HEADERS.length} headers passing`,
      counts: { present, missing, needsImprovement },
      headers,
    });
  } catch (error) {
    return NextResponse.json({
      url,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Failed to fetch headers',
      headers: IDEAL_HEADERS.map(({ name }) => ({
        name,
        value: null,
        status: 'missing' as const,
        recommendation: 'Unable to verify — fetch failed',
      })),
    }, { status: 502 });
  }
}
