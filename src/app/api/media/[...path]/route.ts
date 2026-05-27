import { NextRequest } from 'next/server';
import {
  decodeGatewayTarget,
  isSanityCdnUrl,
  normalizeGatewayQuality,
  normalizeGatewayWidth,
  verifyMediaGatewaySignature,
} from '@/lib/media-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildCacheControl(expiresAt?: number): string {
  if (typeof expiresAt === 'number' && Number.isFinite(expiresAt)) {
    const remainingSeconds = Math.max(60, expiresAt - Math.floor(Date.now() / 1000));
    const maxAge = Math.min(3600, remainingSeconds);

    return `public, max-age=${maxAge}, s-maxage=${Math.max(maxAge, 3600)}, stale-while-revalidate=604800`;
  }

  return 'public, max-age=31536000, immutable, stale-while-revalidate=604800';
}

function buildUpstreamUrl(targetUrl: string, width: number, quality: number): URL {
  const upstreamUrl = new URL(targetUrl);
  upstreamUrl.searchParams.set('auto', 'format');
  upstreamUrl.searchParams.set('w', String(width));
  upstreamUrl.searchParams.set('q', String(quality));
  return upstreamUrl;
}

function buildError(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

export async function GET(request: NextRequest, context: { params: { path?: string[] } }) {
  const [namespace, encodedTarget] = context.params.path ?? [];

  if (namespace !== 'sanity' || !encodedTarget) {
    return buildError(404, 'Not found');
  }

  const targetUrl = decodeGatewayTarget(encodedTarget);

  if (!isSanityCdnUrl(targetUrl)) {
    return buildError(400, 'Invalid asset target');
  }

  const requestUrl = new URL(request.url);
  const width = normalizeGatewayWidth(requestUrl.searchParams.get('w'));
  const quality = normalizeGatewayQuality(requestUrl.searchParams.get('q'));
  const expiresAtParam = requestUrl.searchParams.get('exp');
  const expiresAt = expiresAtParam ? Number.parseInt(expiresAtParam, 10) : undefined;
  const signature = requestUrl.searchParams.get('sig');

  if (!verifyMediaGatewaySignature({ targetUrl, width, quality, expiresAt, signature })) {
    return buildError(401, 'Invalid media signature');
  }

  const upstreamUrl = buildUpstreamUrl(targetUrl, width, quality);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      cache: 'no-store',
      redirect: 'follow',
    });

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      return buildError(upstreamResponse.status === 404 ? 404 : 502, 'Media unavailable');
    }

    const headers = new Headers();
    const contentType = upstreamResponse.headers.get('content-type');
    const contentLength = upstreamResponse.headers.get('content-length');
    const etag = upstreamResponse.headers.get('etag');
    const lastModified = upstreamResponse.headers.get('last-modified');
    const contentDisposition = upstreamResponse.headers.get('content-disposition');

    if (contentType) headers.set('content-type', contentType);
    if (contentLength) headers.set('content-length', contentLength);
    if (etag) headers.set('etag', etag);
    if (lastModified) headers.set('last-modified', lastModified);
    if (contentDisposition) headers.set('content-disposition', contentDisposition);

    headers.set('cache-control', buildCacheControl(expiresAt));
    headers.set('cross-origin-resource-policy', 'same-origin');
    headers.set('x-content-type-options', 'nosniff');
    headers.set('x-robots-tag', 'noindex, nofollow');

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers,
    });
  } catch {
    return buildError(502, 'Media unavailable');
  }
}
