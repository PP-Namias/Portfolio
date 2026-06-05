export interface ResolveContentImageSrcOptions {
  folder?: string;
  fallback?: string;
}

const SANITY_CDN_HOST = 'cdn.sanity.io';
const SANITY_CDN_ALLOWED_PATH_PREFIXES = ['/images/', '/files/'];
const MEDIA_ROUTE_PREFIX = '/api/media';
const SANITY_NAMESPACE = 'sanity';
const DEFAULT_WIDTH = 1200;
const DEFAULT_QUALITY = 85;

function normalizeInteger(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

function normalizeGatewayWidth(value: unknown): number {
  return normalizeInteger(value, DEFAULT_WIDTH, 16, 4096);
}

function normalizeGatewayQuality(value: unknown): number {
  return normalizeInteger(value, DEFAULT_QUALITY, 1, 100);
}

function isSanityCdnUrl(rawUrl: string): boolean {
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

function encodeGatewayTarget(rawUrl: string): string {
  const bytes = new TextEncoder().encode(rawUrl);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function buildPublicMediaGatewayUrl(rawUrl: string): string {
  if (!isSanityCdnUrl(rawUrl)) {
    return '';
  }

  const encodedTarget = encodeGatewayTarget(rawUrl);
  const width = normalizeGatewayWidth(DEFAULT_WIDTH);
  const quality = normalizeGatewayQuality(DEFAULT_QUALITY);

  return `${MEDIA_ROUTE_PREFIX}/${SANITY_NAMESPACE}/${encodedTarget}?w=${width}&q=${quality}`;
}

declare global {
  // attach a process-lifetime cache to globalThis to avoid re-creating maps
  var __resolveContentImageSrc_cache: Map<string, string> | undefined;
}

export function resolveContentImageSrc(
  value: string | null | undefined,
  options: ResolveContentImageSrcOptions = {}
): string {
  const normalized = String(value || '').trim();

  // Simple in-memory memoization to avoid repeated string ops for high-frequency calls
  // across render cycles. Keyed by normalized value + folder to keep cache small.
  const cacheKey = `${normalized}::${options.folder || ''}`;
  // ensure a process-lifetime cache exists on globalThis
  globalThis.__resolveContentImageSrc_cache ??= new Map<string, string>();
  const cache = globalThis.__resolveContentImageSrc_cache;
  if (cache.has(cacheKey)) return cache.get(cacheKey) || '';

  if (!normalized || normalized === 'placeholder.png') {
    const out = options.fallback || '';
    cache.set(cacheKey, out);
    return out;
  }

  const gatewayUrl = buildPublicMediaGatewayUrl(normalized);
  if (gatewayUrl) {
    cache.set(cacheKey, gatewayUrl);
    return gatewayUrl;
  }

  if (/^https?:\/\//i.test(normalized)) {
    const out = options.fallback || '';
    cache.set(cacheKey, out);
    return out;
  }

  if (normalized.startsWith('/')) {
    const out = encodeURI(normalized);
    cache.set(cacheKey, out);
    return out;
  }

  const out = options.fallback || '';
  cache.set(cacheKey, out);
  return out;
}