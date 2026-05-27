import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { clearCmsQueryCache } from '@/lib/cms-content.server';

const REVALIDATE_PATHS = ['/', '/blog', '/blog/[slug]', '/sitemap.xml'] as const;

function withCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'content-type, x-sanity-webhook-secret, x-sanity-revalidate-secret');
  return response;
}

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

  if (!expectedSecret) {
    return true;
  }

  return getProvidedSecret(request) === expectedSecret;
}

function revalidateCmsPaths(): void {
  revalidatePath('/', 'page');
  revalidatePath('/blog', 'page');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/sitemap.xml', 'page');
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedWebhookRequest(request)) {
    return withCorsHeaders(NextResponse.json({ error: 'Invalid webhook secret.' }, { status: 401 }));
  }

  // Clear any in-process query dedupe caches so subsequent requests
  // fetch fresh content from Sanity immediately after a webhook.
  try {
    clearCmsQueryCache();
  } catch (err) {
    // Non-fatal — proceed to revalidate paths even if clearing fails.
    // eslint-disable-next-line no-console
    console.warn('Failed to clear CMS query cache', err);
  }

  revalidateCmsPaths();

  return withCorsHeaders(NextResponse.json({
    revalidated: true,
    paths: REVALIDATE_PATHS,
  }));
}

export async function GET() {
  return withCorsHeaders(NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }));
}

export async function OPTIONS() {
  return withCorsHeaders(new NextResponse(null, { status: 204 }));
}
