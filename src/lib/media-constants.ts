export const SANITY_CDN_HOST = 'cdn.sanity.io';
export const SANITY_CDN_ALLOWED_PATH_PREFIXES = ['/images/', '/files/'];
export const MEDIA_ROUTE_PREFIX = '/api/media';
export const SANITY_NAMESPACE = 'sanity';
export const DEFAULT_WIDTH = 1200;
export const DEFAULT_QUALITY = 85;
export const DEFAULT_GATEWAY_EXPIRY_SECONDS = 15 * 60;

export function normalizeInteger(value: unknown, fallback: number, min: number, max: number): number {
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
  const bytes = new TextEncoder().encode(rawUrl);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
