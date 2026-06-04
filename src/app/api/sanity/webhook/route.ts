import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { clearCmsQueryCache } from '@/lib/cms-content.server';
import { invalidateByTag } from '@/lib/cache';

const REVALIDATE_PATHS = ['/', '/blog', '/blog/[slug]', '/sitemap.xml'] as const;

const SANITY_TYPE_TO_TAGS: Record<string, string[]> = {
  profile: ['cms:profile'],
  heroSection: ['cms:hero'],
  aboutSection: ['cms:about'],
  techStack: ['cms:technology'],
  experience: ['cms:experience'],
  project: ['cms:project', 'cms:project-list'],
  certification: ['cms:certification'],
  galleryImage: ['cms:gallery'],
  post: ['cms:blog'],
  membership: ['cms:membership'],
  recommendation: ['cms:recommendation'],
  siteSettings: ['cms:settings'],
};

function withCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'content-type, x-sanity-webhook-secret, x-sanity-revalidate-secret');
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
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

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function isAuthorizedWebhookRequest(request: NextRequest): boolean {
  const expectedSecret = getExpectedSecret();

  if (!expectedSecret) {
    return true;
  }

  const providedSecret = getProvidedSecret(request);
  if (!providedSecret) {
    return false;
  }

  return timingSafeEqual(expectedSecret, providedSecret);
}

function revalidateCmsPaths(): void {
  revalidatePath('/', 'page');
  revalidatePath('/blog', 'page');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/sitemap.xml', 'page');
}

const MAX_BODY_SIZE = 1_048_576; // 1MB

export async function POST(request: NextRequest) {
  if (!isAuthorizedWebhookRequest(request)) {
    return withCorsHeaders(NextResponse.json({ error: 'Invalid webhook secret.' }, { status: 401 }));
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > MAX_BODY_SIZE) {
    return withCorsHeaders(
      NextResponse.json({ error: 'Request body too large.' }, { status: 413 })
    );
  }

  // Parse the webhook body to determine which content type changed.
  let body: Record<string, unknown> | null = null;
  try {
    body = await request.clone().json();
  } catch {
    // Non-fatal — proceed without body parsing.
  }

  let docType = ''
  if (body && typeof body._type === 'string') {
    docType = body._type;
  }

  // Invalidate the in-memory cache by content type tags.
  const tags = SANITY_TYPE_TO_TAGS[docType] ?? [];
  for (const tag of tags) {
    try {
      await invalidateByTag(tag);
    } catch {
      // Non-fatal — proceed even if tag invalidation fails.
    }
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
