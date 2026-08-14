import { NextRequest } from 'next/server'
import {
  decodeGatewayTarget,
  getSanityAssetKind,
  isSanityCdnUrl,
  normalizeGatewayQuality,
  normalizeGatewayWidth,
  verifyMediaGatewaySignature,
} from '@/lib/media-gateway'
import { isLegacyEncodedTarget } from '@/lib/media-constants'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function buildCacheControl(assetKind: 'image' | 'file' | 'unknown', expiresAt?: number): string {
  if (typeof expiresAt === 'number' && Number.isFinite(expiresAt)) {
    const remainingSeconds = Math.max(60, expiresAt - Math.floor(Date.now() / 1000))
    const maxAge = Math.min(604800, remainingSeconds)

    return `public, max-age=${maxAge}, s-maxage=${Math.max(maxAge, 86400)}, stale-while-revalidate=604800`
  }

  if (assetKind === 'file') {
    return 'public, max-age=31536000, immutable, stale-while-revalidate=604800'
  }

  return 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
}

const SANITY_CDN_ORIGIN = 'https://cdn.sanity.io'
const SAFE_ASSET_PATH = /^\/[A-Za-z0-9._~/-]+$/

function buildUpstreamUrl(
  parsedTarget: URL,
  assetKind: 'image' | 'file' | 'unknown',
  width: number,
  quality: number
): URL {
  const upstreamUrl = new URL(`${SANITY_CDN_ORIGIN}${parsedTarget.pathname}${parsedTarget.search}`)

  if (assetKind === 'image') {
    upstreamUrl.searchParams.set('auto', 'format')
    upstreamUrl.searchParams.set('w', String(width))
    upstreamUrl.searchParams.set('q', String(quality))
  }

  return upstreamUrl
}

function isSafeSanityTarget(targetUrl: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(targetUrl)
  } catch {
    return false
  }
  return (
    parsed.protocol === 'https:' &&
    parsed.hostname === 'cdn.sanity.io' &&
    !parsed.username &&
    !parsed.password &&
    SAFE_ASSET_PATH.test(parsed.pathname)
  )
}

function buildError(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
    },
  })
}

function buildContentDispositionFilename(segment: string, targetUrl: string): string {
  if (segment.includes('.')) {
    return segment
  }

  const pathname = new URL(targetUrl).pathname
  return pathname.split('/').filter(Boolean).pop() || 'asset'
}

export async function GET(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path } = await context.params
  const [namespace, segment] = path ?? []

  if (namespace !== 'sanity' || !segment) {
    return buildError(404, 'Not found')
  }

  const requestUrl = new URL(request.url)

  let encodedTarget: string | null

  if (isLegacyEncodedTarget(segment)) {
    encodedTarget = segment
  } else {
    encodedTarget = requestUrl.searchParams.get('target')
  }

  if (!encodedTarget) {
    return buildError(400, 'Invalid asset target')
  }

  const targetUrl = decodeGatewayTarget(encodedTarget)

  if (!isSanityCdnUrl(targetUrl) || !isSafeSanityTarget(targetUrl)) {
    return buildError(400, 'Invalid asset target')
  }

  const assetKind = getSanityAssetKind(targetUrl)
  const width = normalizeGatewayWidth(requestUrl.searchParams.get('w'))
  const quality = normalizeGatewayQuality(requestUrl.searchParams.get('q'))
  const expiresAtParam = requestUrl.searchParams.get('exp')
  const expiresAt = expiresAtParam ? Number.parseInt(expiresAtParam, 10) : undefined
  const signature = requestUrl.searchParams.get('sig')

  const secret = process.env.SANITY_MEDIA_GATEWAY_SECRET?.trim()

  const sigResult = verifyMediaGatewaySignature({
    targetUrl,
    width,
    quality,
    expiresAt,
    signature,
  })

  const unsignedPublicImage = assetKind === 'image' && !signature

  if (!unsignedPublicImage && !sigResult.valid) {
    if (!signature) {
      return buildError(401, 'Missing media signature')
    }
    if (!secret) {
      return buildError(501, 'Media gateway secret not configured')
    }
    return buildError(
      sigResult.expired ? 401 : 403,
      sigResult.expired ? 'Media signature expired' : 'Invalid media signature'
    )
  }

  const parsedTarget = new URL(targetUrl)
  const safeLogTarget = targetUrl.replace(/[\r\n\u0000-\u001f\u007f]/g, '')

  if (sigResult.expired && signature && expiresAt) {
    const remainingMs = (expiresAt - Math.floor(Date.now() / 1000)) * 1000
    if (remainingMs < 3600_000) {
      console.warn(
        `[media-gateway] Signature expiring soon for ${safeLogTarget} (${Math.round(remainingMs / 60_000)}m remaining)`
      )
    }
  }

  const upstreamUrl = buildUpstreamUrl(parsedTarget, assetKind, width, quality)

  if (upstreamUrl.hostname !== 'cdn.sanity.io') {
    return buildError(400, 'Invalid asset target')
  }

  const parsedUpstream = new URL(upstreamUrl)

  if (parsedUpstream.hostname !== 'cdn.sanity.io') {
    return buildError(403, 'Forbidden: Invalid media host')
  }

  try {
    const upstreamRequestOptions: RequestInit = {
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    }

    const upstreamResponse = await fetch(upstreamUrl, upstreamRequestOptions)

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      return buildError(upstreamResponse.status === 404 ? 404 : 502, 'Media unavailable')
    }

    const headers = new Headers()
    const contentType = upstreamResponse.headers.get('content-type')
    const contentLength = upstreamResponse.headers.get('content-length')
    const etag = upstreamResponse.headers.get('etag')
    const lastModified = upstreamResponse.headers.get('last-modified')
    const contentDisposition = upstreamResponse.headers.get('content-disposition')

    if (contentType) headers.set('content-type', contentType)
    if (contentLength) headers.set('content-length', contentLength)
    if (etag) headers.set('etag', etag)
    if (lastModified) headers.set('last-modified', lastModified)
    if (contentDisposition) headers.set('content-disposition', contentDisposition)

    headers.set('cache-control', buildCacheControl(assetKind, expiresAt))
    headers.set(
      'content-disposition',
      `inline; filename="${buildContentDispositionFilename(segment, targetUrl)}"`
    )
    headers.set('x-media-asset-kind', assetKind)
    headers.set('vary', 'accept')
    headers.set('cross-origin-resource-policy', 'same-origin')
    headers.set('x-content-type-options', 'nosniff')
    headers.set('x-robots-tag', 'noindex, nofollow')

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers,
    })
  } catch {
    return buildError(502, 'Media unavailable')
  }
}
