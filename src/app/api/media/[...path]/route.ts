import { NextRequest } from 'next/server';
import {
  decodeGatewayTarget,
  getSanityAssetKind,
  isSanityCdnUrl,
  normalizeGatewayQuality,
  normalizeGatewayWidth,
  verifyMediaGatewaySignature,
} from '@/lib/media-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildCacheControl(assetKind: 'image' | 'file' | 'unknown', expiresAt?: number): string {
  if (typeof expiresAt === 'number' && Number.isFinite(expiresAt)) {
    const remainingSeconds = Math.max(60, expiresAt - Math.floor(Date.now() / 1000));
    const maxAge = Math.min(604800, remainingSeconds);

    return `public, max-age=${maxAge}, s-maxage=${Math.max(maxAge, 86400)}, stale-while-revalidate=604800`;
  }

  if (assetKind === 'file') {
    return 'public, max-age=31536000, immutable, stale-while-revalidate=604800';
  }

  return 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800';
}

function buildUpstreamUrl(targetUrl: string, assetKind: 'image' | 'file' | 'unknown', width: number, quality: number): URL {
  const upstreamUrl = new URL(targetUrl);

  if (assetKind === 'image') {
    upstreamUrl.searchParams.set('auto', 'format');
    upstreamUrl.searchParams.set('w', String(width));
    upstreamUrl.searchParams.set('q', String(quality));
  }

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

export async function GET(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path } = await context.params;
  const [namespace, encodedTarget] = path ?? [];

  if (namespace !== 'sanity' || !encodedTarget) {
    return buildError(404, 'Not found');
  }

  const targetUrl = decodeGatewayTarget(encodedTarget);

  if (!isSanityCdnUrl(targetUrl)) {
    return buildError(400, 'Invalid asset target');
  }

  const requestUrl = new URL(request.url);
  const assetKind = getSanityAssetKind(targetUrl);
  const width = normalizeGatewayWidth(requestUrl.searchParams.get('w'));
  const quality = normalizeGatewayQuality(requestUrl.searchParams.get('q'));
  const expiresAtParam = requestUrl.searchParams.get('exp');
  const expiresAt = expiresAtParam ? Number.parseInt(expiresAtParam, 10) : undefined;
  const signature = requestUrl.searchParams.get('sig');

  const secret = process.env.SANITY_MEDIA_GATEWAY_SECRET?.trim();

  let useUnsignedFallback = false;

  if (!secret) {
    useUnsignedFallback = true;
  } else if (!signature) {
    return buildError(401, 'Missing media signature');
  } else {
    const sigResult = verifyMediaGatewaySignature({ targetUrl, width, quality, expiresAt, signature });

    if (!sigResult.valid) {
      console.warn(`[media-gateway] Signature ${sigResult.expired ? 'expired' : 'invalid'} for ${targetUrl}`);
      useUnsignedFallback = true;
    } else if (sigResult.expired && expiresAt) {
      const remainingMs = (expiresAt - Math.floor(Date.now() / 1000)) * 1000;
      if (remainingMs < 3600_000) {
        console.warn(`[media-gateway] Signature expiring soon for ${targetUrl} (${Math.round(remainingMs / 60_000)}m remaining)`);
      }
    }
  }

    const upstreamUrl = buildUpstreamUrl(targetUrl, assetKind, width, quality);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      cache: 'no-store',
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
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

    headers.set('cache-control', useUnsignedFallback ? 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' : buildCacheControl(assetKind, expiresAt));
    headers.set('x-media-asset-kind', assetKind);
    if (useUnsignedFallback) headers.set('x-media-unsigned', 'true');
    headers.set('vary', 'accept');
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
