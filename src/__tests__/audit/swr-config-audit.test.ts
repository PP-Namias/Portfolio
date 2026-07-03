import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(__dirname, '../../..')

function read(name: string) {
  return readFileSync(resolve(root, name), 'utf8')
}

describe('Caching Audit — SWR Configuration', () => {
  let swrConfig: string

  beforeAll(() => {
    swrConfig = read('src/lib/swr-config.tsx')
  })

  it('exports SwrConfigProvider component', () => {
    expect(swrConfig).toContain('export function SwrConfigProvider')
  })

  it('has dedupingInterval of 5 seconds', () => {
    expect(swrConfig).toContain('dedupingInterval')
    expect(swrConfig).toContain('5_000')
  })

  it('has revalidateIfStale enabled', () => {
    expect(swrConfig).toContain('revalidateIfStale: true')
  })

  it('has revalidateOnFocus disabled', () => {
    expect(swrConfig).toContain('revalidateOnFocus: false')
  })

  it('has revalidateOnReconnect enabled', () => {
    expect(swrConfig).toContain('revalidateOnReconnect: true')
  })

  it('has errorRetryCount of 2', () => {
    expect(swrConfig).toContain('errorRetryCount: 2')
  })

  it('has errorRetryInterval of 10 seconds', () => {
    expect(swrConfig).toContain('errorRetryInterval: 10_000')
  })

  it('has keepPreviousData enabled', () => {
    expect(swrConfig).toContain('keepPreviousData: true')
  })

  it('is a client component', () => {
    expect(swrConfig).toContain("'use client'")
  })

  it('uses SWRConfig from swr package', () => {
    expect(swrConfig).toContain("from 'swr'")
  })
})

describe('Caching Audit — Service Worker', () => {
  let sw: string

  beforeAll(() => {
    sw = read('public/sw.js')
  })

  it('has cache version documented', () => {
    expect(sw).toContain('CACHE_VERSION')
    const versionMatch = sw.match(/CACHE_VERSION\s*=\s*'([^']+)'/)
    expect(versionMatch).not.toBeNull()
  })

  it('defines static cache name', () => {
    expect(sw).toContain('STATIC_CACHE')
    expect(sw).toContain('portfolio-static-')
  })

  it('defines API cache name', () => {
    expect(sw).toContain('API_CACHE')
    expect(sw).toContain('portfolio-api-')
  })

  it('defines CMS cache name', () => {
    expect(sw).toContain('CMS_CACHE')
    expect(sw).toContain('portfolio-cms-')
  })

  it('pre-caches static assets on install', () => {
    expect(sw).toContain('STATIC_ASSETS')
    expect(sw).toContain("addEventListener('install'")
    expect(sw).toContain('cache.addAll')
  })

  it('cleans up old caches on activate', () => {
    expect(sw).toContain("addEventListener('activate'")
    expect(sw).toContain('caches.delete')
  })

  it('claims clients on activate', () => {
    expect(sw).toContain('self.clients.claim()')
  })

  it('handles navigation requests with network-first', () => {
    expect(sw).toContain("request.mode === 'navigate'")
    expect(sw).toContain('networkFirst')
  })

  it('handles _next/static with network-first', () => {
    expect(sw).toContain('/_next/static/')
    expect(sw).toContain('networkFirst')
  })

  it('handles fonts with cache-first', () => {
    expect(sw).toContain('/fonts/')
    expect(sw).toContain('cacheFirst')
  })

  it('handles API media with network-first', () => {
    expect(sw).toContain('/api/media/')
  })

  it('handles general API with network-first', () => {
    expect(sw).toContain('/api/')
  })

  it('has offline fallback', () => {
    expect(sw).toContain('Offline') || expect(sw).toContain('offline')
  })

  it('has networkFirst function', () => {
    expect(sw).toContain('async function networkFirst')
  })

  it('has cacheFirst function', () => {
    expect(sw).toContain('async function cacheFirst')
  })
})

describe('Caching Audit — Next.js Cache Headers', () => {
  let config: string

  beforeAll(() => {
    config = read('next.config.js')
  })

  it('has immutable cache for _next/static (production)', () => {
    expect(config).toContain('/_next/static/:path*')
    expect(config).toContain('max-age=31536000')
    expect(config).toContain('immutable')
  })

  it('has immutable cache for fonts', () => {
    expect(config).toContain('/fonts/:path*')
    expect(config).toContain('max-age=31536000')
  })

  it('has 1-day cache for favicon', () => {
    expect(config).toContain('/favicon.ico')
    expect(config).toContain('max-age=86400')
  })

  it('has stale-while-revalidate for og-image', () => {
    expect(config).toContain('/og-image.svg')
    expect(config).toContain('stale-while-revalidate=604800')
  })

  it('cache headers only applied in production', () => {
    expect(config).toContain('isDev')
  })
})
