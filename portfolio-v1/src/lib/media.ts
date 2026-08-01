import {
  DEFAULT_WIDTH,
  DEFAULT_QUALITY,
  MEDIA_ROUTE_PREFIX,
  SANITY_NAMESPACE,
  normalizeGatewayWidth,
  normalizeGatewayQuality,
  isSanityCdnUrl,
  encodeGatewayTarget,
} from './media-constants';

export interface ResolveContentImageSrcOptions {
  folder?: string;
  fallback?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

const CDN_DIMENSIONS_RE = /-(\d{1,5})x(\d{1,5})\.(?:jpg|jpeg|png|webp|gif|avif|tiff|bmp)$/i;

export function decodeGatewayTarget(encodedTarget: string): string | null {
  try {
    const base64 = encodedTarget.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function parseImageDimensions(src: string | null | undefined): ImageDimensions | null {
  const trimmed = String(src || '').trim();
  if (!trimmed) return null;

  let rawUrl = trimmed;
  const gatewayMatch = trimmed.match(
    new RegExp(`^${MEDIA_ROUTE_PREFIX}/${SANITY_NAMESPACE}/([A-Za-z0-9_-]+)`)
  );
  if (gatewayMatch) {
    const decoded = decodeGatewayTarget(gatewayMatch[1]);
    if (!decoded) return null;
    rawUrl = decoded;
  }

  const match = rawUrl.match(CDN_DIMENSIONS_RE);
  if (!match) return null;

  const width = Number.parseInt(match[1], 10);
  const height = Number.parseInt(match[2], 10);
  if (!width || !height) return null;

  return { width, height };
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
