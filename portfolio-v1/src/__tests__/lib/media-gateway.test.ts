import { beforeEach, describe, expect, it } from 'vitest'
import {
  buildMediaGatewayUrl,
  decodeGatewayTarget,
  encodeGatewayTarget,
  isSanityCdnUrl,
  verifyMediaGatewaySignature,
} from '@/lib/media-gateway'

describe('media gateway helpers', () => {
  beforeEach(() => {
    delete process.env.SANITY_MEDIA_GATEWAY_SECRET
  })

  it('encodes and decodes sanity asset targets safely', () => {
    const target = 'https://cdn.sanity.io/images/project/production/image-800x600.jpg?w=800'
    const encoded = encodeGatewayTarget(target)

    expect(decodeGatewayTarget(encoded)).toBe(target)
    expect(isSanityCdnUrl(target)).toBe(false)
    expect(
      isSanityCdnUrl('https://cdn.sanity.io/images/project/production/image-800x600.jpg')
    ).toBe(true)
  })

  it('builds a same-origin gateway url for sanity assets', () => {
    process.env.SANITY_MEDIA_GATEWAY_SECRET = 'unit-test-media-secret'

    const url = buildMediaGatewayUrl(
      'https://cdn.sanity.io/images/project/production/image-800x600.jpg',
      {
        width: 320,
        quality: 70,
        sign: true,
      }
    )

    expect(url).toContain('/api/media/sanity/')
    expect(url).toContain('w=320')
    expect(url).toContain('q=70')
    expect(url).toContain('exp=')
    expect(url).toContain('sig=')
  })

  it('builds a clean labeled url with the encoded target in the query', () => {
    process.env.SANITY_MEDIA_GATEWAY_SECRET = 'unit-test-media-secret'

    const raw =
      'https://cdn.sanity.io/images/project/production/f34107054bdd53ab63d9a801d5bc329bf40b2672-1200x630.svg'
    const url = buildMediaGatewayUrl(raw, {
      width: 320,
      quality: 70,
      sign: true,
      label: 'Hack for Gov 2025',
    })

    expect(url).toContain('/api/media/sanity/hack-for-gov-2025.svg')
    expect(url).toMatch(/\/api\/media\/sanity\/hack-for-gov-2025\.svg\?target=/)

    const target = new URL(url, 'http://localhost').searchParams.get('target')
    expect(decodeGatewayTarget(target ?? '')).toBe(raw)
  })

  it('returns an empty string for unsupported remote urls', () => {
    expect(buildMediaGatewayUrl('https://example.com/image.jpg')).toBe('')
  })
})

describe('verifyMediaGatewaySignature', () => {
  const secret = 'test-gateway-secret'

  beforeEach(() => {
    process.env.SANITY_MEDIA_GATEWAY_SECRET = secret
  })

  it('returns valid for a freshly created signature', () => {
    const targetUrl = 'https://cdn.sanity.io/images/proj/prod/img.jpg'
    const now = Math.floor(Date.now() / 1000)
    const sig = buildMediaGatewayUrl(targetUrl, { width: 320, quality: 85, sign: true })
    const exp = Number.parseInt(new URL(sig, 'http://localhost').searchParams.get('exp') ?? '0', 10)
    const sigParam = new URL(sig, 'http://localhost').searchParams.get('sig')

    const result = verifyMediaGatewaySignature({
      targetUrl,
      width: 320,
      quality: 85,
      expiresAt: exp,
      signature: sigParam,
    })

    expect(result.valid).toBe(true)
    expect(result.expired).toBe(false)
  })

  it('returns expired=true for a signature past TTL but within grace period', () => {
    const targetUrl = 'https://cdn.sanity.io/images/proj/prod/img.jpg'
    const pastExpiry = Math.floor(Date.now() / 1000) - 1800

    const result = verifyMediaGatewaySignature({
      targetUrl,
      width: 320,
      quality: 85,
      expiresAt: pastExpiry,
      signature: 'fake-sig',
    })

    expect(result.valid).toBe(false)
    expect(result.expired).toBe(true)
  })

  it('returns expired=true for a signature far past TTL', () => {
    const targetUrl = 'https://cdn.sanity.io/images/proj/prod/img.jpg'
    const farPast = Math.floor(Date.now() / 1000) - 7200

    const result = verifyMediaGatewaySignature({
      targetUrl,
      width: 320,
      quality: 85,
      expiresAt: farPast,
      signature: 'fake-sig',
    })

    expect(result.valid).toBe(false)
    expect(result.expired).toBe(true)
  })

  it('returns false when secret is missing', () => {
    delete process.env.SANITY_MEDIA_GATEWAY_SECRET
    const result = verifyMediaGatewaySignature({
      targetUrl: 'https://cdn.sanity.io/images/proj/prod/img.jpg',
      expiresAt: 9999999999,
      signature: 'sig',
    })

    expect(result.valid).toBe(false)
    expect(result.expired).toBe(false)
  })
})
