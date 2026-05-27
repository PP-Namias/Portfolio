export interface ResolveContentImageSrcOptions {
  folder?: string;
  fallback?: string;
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

  if (/^https?:\/\//i.test(normalized)) {
    cache.set(cacheKey, normalized);
    return normalized;
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