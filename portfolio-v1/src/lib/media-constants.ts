export const SANITY_CDN_HOST = 'cdn.sanity.io'
export const SANITY_CDN_ALLOWED_PATH_PREFIXES = ['/images/', '/files/']
export const MEDIA_ROUTE_PREFIX = '/api/media'
export const SANITY_NAMESPACE = 'sanity'
export const DEFAULT_WIDTH = 1200
export const DEFAULT_QUALITY = 85
export const DEFAULT_GATEWAY_EXPIRY_SECONDS = 7 * 24 * 60 * 60
export const SIGNATURE_GRACE_PERIOD_SECONDS = 60 * 60

export function normalizeInteger(
  value: unknown,
  fallback: number,
  min: number,
  max: number
): number {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value)

  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.min(max, Math.max(min, Math.trunc(parsed)))
}

export function normalizeGatewayWidth(value: unknown): number {
  return normalizeInteger(value, DEFAULT_WIDTH, 16, 4096)
}

export function normalizeGatewayQuality(value: unknown): number {
  return normalizeInteger(value, DEFAULT_QUALITY, 1, 100)
}

export function isSanityCdnUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl)
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname === SANITY_CDN_HOST &&
      SANITY_CDN_ALLOWED_PATH_PREFIXES.some((prefix) => parsed.pathname.startsWith(prefix)) &&
      !parsed.search &&
      !parsed.hash
    )
  } catch {
    return false
  }
}

export function encodeGatewayTarget(rawUrl: string): string {
  const bytes = new TextEncoder().encode(rawUrl)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  const base64 = btoa(binary)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function slugifyMediaLabel(label: string): string {
  const slug = String(label || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 64)
    .replace(/-+$/g, '')

  return slug || 'portfolio-image'
}

export function getAssetFileExtension(rawUrl: string): string {
  const match = String(rawUrl || '').match(/\.([a-z0-9]+)$/i)
  return match ? match[1].toLowerCase() : 'img'
}

export function isLegacyEncodedTarget(segment: string): boolean {
  return !segment.includes('.')
}

export function buildCleanGatewaySegment(
  encodedTarget: string,
  rawUrl: string,
  label?: string | null
): string {
  if (!label || !String(label).trim()) {
    return encodedTarget
  }

  return `${slugifyMediaLabel(label)}.${getAssetFileExtension(rawUrl)}`
}
