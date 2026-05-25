import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_PATHS = ['/', '/blog', '/blog/[slug]', '/sitemap.xml'] as const;

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
    return NextResponse.json({ error: 'Invalid webhook secret.' }, { status: 401 });
  }

  revalidateCmsPaths();

  return NextResponse.json({
    revalidated: true,
    paths: REVALIDATE_PATHS,
  });
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
