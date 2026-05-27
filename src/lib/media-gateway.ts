import { createHmac, timingSafeEqual } from 'node:crypto';

const SANITY_CDN_HOST = 'cdn.sanity.io';
const SANITY_CDN_ALLOWED_PATH_PREFIXES = ['/images/', '/files/'];
const MEDIA_ROUTE_PREFIX = '/api/media';
const SANITY_NAMESPACE = 'sanity';
const DEFAULT_GATEWAY_EXPIRY_SECONDS = 15 * 60;
const DEFAULT_WIDTH = 1200;
const DEFAULT_QUALITY = 75;

type MediaGatewaySignatureInput = {
  targetUrl: string;
  width?: number;
  quality?: number;
  expiresAt?: number;
};

function normalizeInteger(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

export function normalizeGatewayWidth(value: unknown): number {
  return normalizeInteger(value, DEFAULT_WIDTH, 16, 4096);
}

export function normalizeGatewayQuality(value: unknown): number {
  return normalizeInteger(value, DEFAULT_QUALITY, 1, 100);
}

export function isSanityCdnUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname === SANITY_CDN_HOST &&
      SANITY_CDN_ALLOWED_PATH_PREFIXES.some((prefix) => parsed.pathname.startsWith(prefix)) &&
      !parsed.search &&
      !parsed.hash
    );
  } catch {
    return false;
  }
}

export function encodeGatewayTarget(rawUrl: string): string {
  return Buffer.from(rawUrl, 'utf8').toString('base64url');
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
    return true;
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
  const width = typeof options.width === 'number' ? normalizeGatewayWidth(options.width) : undefined;
  const quality = typeof options.quality === 'number' ? normalizeGatewayQuality(options.quality) : undefined;
  const signature = options.sign ? createMediaGatewaySignature({ targetUrl: normalized, width, quality }) : null;
  const query = new URLSearchParams();

  if (typeof width === 'number') {
    query.set('w', String(width));
  }

  if (typeof quality === 'number') {
    query.set('q', String(quality));
  }

  if (signature) {
    query.set('exp', String(signature.exp));
    query.set('sig', signature.sig);
  }

  const queryString = query.toString();
  const querySuffix = queryString ? `?${queryString}` : '';
  return `${MEDIA_ROUTE_PREFIX}/${SANITY_NAMESPACE}/${encodedTarget}${querySuffix}`;
}
