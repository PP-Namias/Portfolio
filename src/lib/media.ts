export interface ResolveContentImageSrcOptions {
  folder?: string;
  fallback?: string;
}

export function resolveContentImageSrc(
  value: string | null | undefined,
  options: ResolveContentImageSrcOptions = {}
): string {
  const normalized = String(value || '').trim();

  if (!normalized || normalized === 'placeholder.png') {
    return options.fallback || '';
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  if (normalized.startsWith('/')) {
    return encodeURI(normalized);
  }

  // Do not synthesize local `/images/*` runtime paths for short filenames.
  // Prefer explicit absolute URLs (Sanity CDN) or caller-provided fallbacks.
  // Returning an empty string signals "no runtime media available" so
  // callers can decide how to render placeholders or omit media.
  return options.fallback || '';
}