import {
  DEFAULT_WIDTH,
  DEFAULT_QUALITY,
  MEDIA_ROUTE_PREFIX,
  SANITY_NAMESPACE,
  normalizeGatewayWidth,
  normalizeGatewayQuality,
  isSanityCdnUrl,
  encodeGatewayTarget,
  buildCleanGatewaySegment,
  isLegacyEncodedTarget,
} from './media-constants'

export interface ResolveContentImageSrcOptions {
  folder?: string
  fallback?: string
  label?: string
}

export interface ImageDimensions {
  width: number
  height: number
}

const CDN_DIMENSIONS_RE = /-(\d{1,5})x(\d{1,5})\.(?:jpg|jpeg|png|webp|gif|avif|tiff|bmp)$/i

export function decodeGatewayTarget(encodedTarget: string): string | null {
  try {
    const base64 = encodedTarget.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  } catch {
    return null
  }
}

export function parseImageDimensions(src: string | null | undefined): ImageDimensions | null {
  const trimmed = String(src || '').trim()
  if (!trimmed) return null

  let rawUrl = trimmed
  const gatewayMatch = trimmed.match(
    new RegExp(`^${MEDIA_ROUTE_PREFIX}/${SANITY_NAMESPACE}/([^/?]+)`)
  )
  if (gatewayMatch) {
    const segment = gatewayMatch[1]
    const encoded = isLegacyEncodedTarget(segment)
      ? segment
      : new URL(trimmed, 'https://namias.tech').searchParams.get('target')
    const decoded = encoded ? decodeGatewayTarget(encoded) : null
    if (!decoded) return null
    rawUrl = decoded
  }

  const match = rawUrl.match(CDN_DIMENSIONS_RE)
  if (!match) return null

  const width = Number.parseInt(match[1], 10)
  const height = Number.parseInt(match[2], 10)
  if (!width || !height) return null

  return { width, height }
}

function buildPublicMediaGatewayUrl(rawUrl: string, label?: string): string {
  if (!isSanityCdnUrl(rawUrl)) {
    return ''
  }

  const encodedTarget = encodeGatewayTarget(rawUrl)
  const segment = buildCleanGatewaySegment(encodedTarget, rawUrl, label)
  const width = normalizeGatewayWidth(DEFAULT_WIDTH)
  const quality = normalizeGatewayQuality(DEFAULT_QUALITY)

  const query = new URLSearchParams()

  if (segment !== encodedTarget) {
    query.set('target', encodedTarget)
  }

  query.set('w', String(width))
  query.set('q', String(quality))

  return `${MEDIA_ROUTE_PREFIX}/${SANITY_NAMESPACE}/${segment}?${query.toString()}`
}

declare global {
  // attach a process-lifetime cache to globalThis to avoid re-creating maps
  var __resolveContentImageSrc_cache: Map<string, string> | undefined
}

export function resolveContentImageSrc(
  value: string | null | undefined,
  options: ResolveContentImageSrcOptions = {}
): string {
  const normalized = String(value || '').trim()

  // Simple in-memory memoization to avoid repeated string ops for high-frequency calls
  // across render cycles. Keyed by normalized value + folder + label to keep cache small.
  const cacheKey = `${normalized}::${options.folder || ''}::${options.label || ''}`
  // ensure a process-lifetime cache exists on globalThis
  globalThis.__resolveContentImageSrc_cache ??= new Map<string, string>()
  const cache = globalThis.__resolveContentImageSrc_cache
  if (cache.has(cacheKey)) return cache.get(cacheKey) || ''

  if (!normalized || normalized === 'placeholder.png') {
    const out = options.fallback || ''
    cache.set(cacheKey, out)
    return out
  }

  const gatewayUrl = buildPublicMediaGatewayUrl(normalized, options.label)
  if (gatewayUrl) {
    cache.set(cacheKey, gatewayUrl)
    return gatewayUrl
  }

  if (/^https?:\/\//i.test(normalized)) {
    const out = options.fallback || ''
    cache.set(cacheKey, out)
    return out
  }

  if (normalized.startsWith('/')) {
    const out = encodeURI(normalized)
    cache.set(cacheKey, out)
    return out
  }

  const out = options.fallback || ''
  cache.set(cacheKey, out)
  return out
}
