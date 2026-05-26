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

  if (options.folder) {
    return encodeURI(`/images/${options.folder}/${normalized}`);
  }

  return encodeURI(normalized);
}