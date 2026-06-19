import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { clearCmsQueryCache } from '@/lib/cms-content.server';
import { invalidateByTag } from '@/lib/cache';
import { SITE_URL } from '@/lib/site-config';

const REVALIDATE_PATHS = ['/', '/blog', '/blog/[slug]', '/projects/[slug]', '/sitemap.xml'] as const;

const SANITY_TYPE_TO_TAGS: Record<string, string[]> = {
  profile: ['cms:profile'],
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
  response.headers.set('Access-Control-Allow-Origin', SITE_URL);
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
    null
  );
}

function isAuthorizedWebhookRequest(request: NextRequest): boolean {
  const expectedSecret = getExpectedSecret();

  if (!expectedSecret) {
    return false;
  }

  const providedSecret = getProvidedSecret(request);
  if (!providedSecret) {
    return false;
  }

  const expectedBuf = Buffer.from(expectedSecret);
  const providedBuf = Buffer.from(providedSecret);

  if (expectedBuf.length !== providedBuf.length) {
    return false;
  }

  return timingSafeEqual(expectedBuf, providedBuf);
}

function revalidateCmsPaths(): void {
  revalidatePath('/', 'page');
  revalidatePath('/blog', 'page');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/projects/[slug]', 'page');
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

  let docType = '';
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
