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
