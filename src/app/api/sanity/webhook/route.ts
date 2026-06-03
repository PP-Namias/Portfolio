import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter, getClientIp } from '@/lib/rate-limiter';

const webhookLimiter = createRateLimiter({
  namespace: 'sanity-webhook',
  limit: 5,
  windowMs: 900_000,
});

const PAYLOAD_MAX_BYTES = 102_400;

function getExpectedSecret(): string | null {
  return process.env.SANITY_REVALIDATE_SECRET?.trim() || null;
}

function getProvidedSecret(request: NextRequest): string | null {
  return (
    request.headers.get('x-sanity-webhook-secret')?.trim() ||
    request.headers.get('x-sanity-revalidate-secret')?.trim() ||
    new URL(request.url).searchParams.get('secret')?.trim() ||
    null
  );
}

function isAuthorizedWebhookRequest(request: NextRequest): boolean {
  const expectedSecret = getExpectedSecret();
  if (!expectedSecret) return true;
  return getProvidedSecret(request) === expectedSecret;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (await webhookLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait and try again.' },
      { status: 429 },
    );
  }

  // Validate content-type
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json.' },
      { status: 400 },
    );
  }

  // Check Content-Length header for oversized payload
  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > PAYLOAD_MAX_BYTES) {
    return NextResponse.json(
      { error: 'Payload too large. Maximum 100KB.' },
      { status: 413 },
    );
  }

  // Verify secret before processing
  if (!isAuthorizedWebhookRequest(request)) {
    return NextResponse.json({ error: 'Invalid webhook secret.' }, { status: 401 });
  }

  // Validate body is valid JSON
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Body must be a JSON object.' },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Body must be valid JSON.' },
      { status: 400 },
    );
  }

  // TODO: Wire up full revalidation logic when Sanity CMS
  // integration is complete. Currently acknowledges the webhook.
  return NextResponse.json({
    revalidated: true,
    paths: ['/', '/blog', '/blog/[slug]', '/sitemap.xml'],
  });
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
