import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  SANITY_CDN_HOST,
  DEFAULT_GATEWAY_EXPIRY_SECONDS,
  DEFAULT_WIDTH,
  DEFAULT_QUALITY,
  MEDIA_ROUTE_PREFIX,
  SANITY_NAMESPACE,
  normalizeGatewayWidth,
  normalizeGatewayQuality,
  isSanityCdnUrl,
  encodeGatewayTarget,
} from './media-constants';

export { normalizeGatewayWidth, normalizeGatewayQuality, isSanityCdnUrl, encodeGatewayTarget };

type MediaGatewaySignatureInput = {
  targetUrl: string;
  width?: number;
  quality?: number;
  expiresAt?: number;
};

export function getSanityAssetKind(rawUrl: string): 'image' | 'file' | 'unknown' {
  try {
    const parsed = new URL(rawUrl);

    if (parsed.hostname !== SANITY_CDN_HOST) {
      return 'unknown';
    }

    if (parsed.pathname.startsWith('/files/')) {
      return 'file';
    }

    if (parsed.pathname.startsWith('/images/')) {
      return 'image';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}

export function decodeGatewayTarget(encodedUrl: string): string {
  try {
    return Buffer.from(encodedUrl, 'base64url').toString('utf8');
  } catch {
    return '';
  }
}

function getGatewaySecret(): string | null {
  return process.env.SANITY_MEDIA_GATEWAY_SECRET?.trim() || null;
}

function buildSignaturePayload({ targetUrl, width, quality, expiresAt }: MediaGatewaySignatureInput): string {
  return [targetUrl, width ?? '', quality ?? '', expiresAt ?? ''].join('|');
}

export function createMediaGatewaySignature(input: MediaGatewaySignatureInput): { exp: number; sig: string } | null {
  const secret = getGatewaySecret();

  if (!secret) {
    return null;
  }

  const exp = input.expiresAt ?? Math.floor(Date.now() / 1000) + DEFAULT_GATEWAY_EXPIRY_SECONDS;
  const payload = buildSignaturePayload({ ...input, expiresAt: exp });
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');

  return { exp, sig };
}

export function verifyMediaGatewaySignature(input: MediaGatewaySignatureInput & { signature?: string | null }): boolean {
  const secret = getGatewaySecret();

  if (!secret) {
    return false;
  }

  if (!input.signature || typeof input.expiresAt !== 'number') {
    return false;
  }

  if (input.expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expected = createHmac('sha256', secret)
    .update(buildSignaturePayload(input))
    .digest();
  const provided = Buffer.from(input.signature, 'base64url');

  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}

export function buildMediaGatewayUrl(
  rawUrl: string | null | undefined,
  options: { width?: number; quality?: number; sign?: boolean } = {}
): string {
  const normalized = String(rawUrl || '').trim();

  if (!normalized) {
    return '';
  }

  if (normalized.startsWith('/')) {
    return normalized;
  }

  if (!isSanityCdnUrl(normalized)) {
    return '';
  }

  const encodedTarget = encodeGatewayTarget(normalized);
  const width = normalizeGatewayWidth(options.width ?? DEFAULT_WIDTH);
  const quality = normalizeGatewayQuality(options.quality ?? DEFAULT_QUALITY);
  const signature = options.sign ? createMediaGatewaySignature({ targetUrl: normalized, width, quality }) : null;
  const query = new URLSearchParams();

  query.set('w', String(width));
  query.set('q', String(quality));

  if (signature) {
    query.set('exp', String(signature.exp));
    query.set('sig', signature.sig);
  }

  const queryString = query.toString();
  const querySuffix = queryString ? `?${queryString}` : '';
  return `${MEDIA_ROUTE_PREFIX}/${SANITY_NAMESPACE}/${encodedTarget}${querySuffix}`;
}
