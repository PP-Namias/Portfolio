'use client'

import { useCallback, useState } from 'react'
import Image, { type ImageProps } from 'next/image'

function extractRawSanityUrl(src: string): string | null {
  try {
    const url = new URL(src, window.location.origin)
    const pathSegments = url.pathname.split('/')
    const sanityIndex = pathSegments.indexOf('sanity')
    if (sanityIndex === -1 || !pathSegments[sanityIndex + 1]) return null
    const segment = pathSegments[sanityIndex + 1]
    const encoded = segment.includes('.') ? url.searchParams.get('target') : segment
    if (!encoded) return null
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
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

function ImagePlaceholder({ className, alt }: { className?: string; alt?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 ${className || ''}`}
      aria-label={alt || 'Image placeholder'}
    >
      <svg
        className="h-8 w-8 text-gray-300 dark:text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    </div>
  )
}

/**
 * Portfolio-wide wrapper around `next/image`.
 *
 * Two reasons we force `unoptimized` globally:
 *
 * 1. **No hydration mismatch.** Every `src` in this project goes through
 *    `resolveContentImageSrc` which produces a media-gateway URL of the
 *    form `/api/media/sanity/<base64url>?w=<n>&q=<n>`. When `next/image`
 *    wraps that in `/_next/image?url=...&w=...&q=...`, the inner `?w=&q=`
 *    get URL-encoded into the `url` parameter. Turbopack's dev server
 *    generates slightly different `srcSet` strings on SSR vs hydration
 *    for these double-encoded URLs, producing a hydration warning on
 *    every image on the page. Bypassing the optimizer eliminates the
 *    `srcSet` generation entirely.
 *
 * 2. **No double encode.** The media gateway already proxies to Sanity
 *    with `auto=format&w=<n>&q=85`, so Sanity returns a WebP/AVIF at
 *    quality 85. If we let `next/image` optimize on top of that, it
 *    re-fetches the already-optimized image and re-encodes it at its
 *    own quality (default 75), which is a second lossy pass and visibly
 *    softer. Going direct to the gateway is both faster and sharper.
 *
 * Components that explicitly need `next/image`'s optimizer (none
 * currently) can override by passing `unoptimized={false}`.
 */
const OptimizedImage = (props: ImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | ImageProps['src']>(props.src)
  const [hasFallback, setHasFallback] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleError = useCallback(() => {
    if (hasFallback) {
      setHasError(true)
      return
    }
    const raw = extractRawSanityUrl(String(imgSrc))
    if (raw) {
      setImgSrc(raw)
      setHasFallback(true)
    } else {
      setHasError(true)
    }
  }, [imgSrc, hasFallback])

  if (hasError) {
    return (
      <ImagePlaceholder
        className={props.className}
        alt={typeof props.alt === 'string' ? props.alt : ''}
      />
    )
  }

  // eslint-disable-next-line jsx-a11y/alt-text -- alt is forwarded via props
  return (
    <Image
      {...props}
      src={imgSrc}
      quality={props.quality ?? 85}
      unoptimized
      onError={handleError}
    />
  )
}

export default OptimizedImage
