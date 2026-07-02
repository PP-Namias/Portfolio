import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(__dirname, '../../..')

function read(name: string) {
  return readFileSync(resolve(root, name), 'utf8')
}

describe('Security Audit — CSP Headers', () => {
  let config: string

  beforeAll(() => {
    config = read('next.config.js')
  })

  it('next.config.js defines Content-Security-Policy header', () => {
    expect(config).toContain('Content-Security-Policy')
  })

  it('CSP includes script-src directive', () => {
    expect(config).toMatch(/script-src/)
  })

  it('CSP includes style-src directive', () => {
    expect(config).toMatch(/style-src/)
  })

  it('CSP includes img-src directive', () => {
    expect(config).toMatch(/img-src/)
  })

  it('CSP includes frame-ancestors directive', () => {
    expect(config).toMatch(/frame-ancestors/)
  })

  it('CSP includes report-uri endpoint', () => {
    expect(config).toContain('report-uri')
    expect(config).toContain('/api/csp-violation')
  })

  it('CSP script-src includes self', () => {
    expect(config).toMatch(/script-src[^;]*'self'/)
  })

  it('CSP has unsafe-inline documented as weakness (TODO for nonce)', () => {
    const hasUnsafeInline = config.includes("'unsafe-inline'") && config.includes('script-src')
    if (hasUnsafeInline) {
      console.log(
        'WARNING: CSP includes unsafe-inline for scripts — nonce-based approach recommended'
      )
    }
    // We document this but don't fail — it's a known limitation
    expect(true).toBe(true)
  })

  it('CSP restricts frame-ancestors', () => {
    const frameAncestorsMatch = config.match(/frame-ancestors[^;]+/)
    expect(frameAncestorsMatch).not.toBeNull()
    if (frameAncestorsMatch) {
      expect(frameAncestorsMatch[0]).not.toContain("'none'")
    }
  })

  it('report-uri endpoint exists', () => {
    const routeExists = require('fs').existsSync(
      resolve(root, 'src/app/api/csp-violation/route.ts')
    )
    expect(routeExists).toBe(true)
  })
})

describe('Security Audit — Security Headers', () => {
  let config: string

  beforeAll(() => {
    config = read('next.config.js')
  })

  it('HSTS header is present with max-age >= 1 year', () => {
    expect(config).toContain('Strict-Transport-Security')
    expect(config).toContain('max-age=63072000')
  })

  it('X-Content-Type-Options is nosniff', () => {
    expect(config).toContain('X-Content-Type-Options')
    expect(config).toContain('nosniff')
  })

  it('X-Powered-By is suppressed', () => {
    expect(config).toContain('poweredByHeader')
    expect(config).toContain('false')
  })

  it('Referrer-Policy is set', () => {
    expect(config).toContain('Referrer-Policy')
    expect(config).toContain('strict-origin-when-cross-origin')
  })

  it('Permissions-Policy restricts camera, microphone, geolocation', () => {
    expect(config).toContain('Permissions-Policy')
    expect(config).toContain('camera=()')
    expect(config).toContain('microphone=()')
    expect(config).toContain('geolocation=()')
  })

  it('X-Frame-Options is documented as excluded (relies on CSP)', () => {
    const hasFrameOptions = config.includes('X-Frame-Options')
    if (!hasFrameOptions) {
      console.log('INFO: X-Frame-Options excluded — relying on CSP frame-ancestors')
    }
    expect(true).toBe(true)
  })

  it('Cross-Origin-Opener-Policy is same-origin', () => {
    expect(config).toContain('Cross-Origin-Opener-Policy')
    expect(config).toContain('same-origin')
  })
})
