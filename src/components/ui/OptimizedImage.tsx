'use client';

import { useCallback, useState } from 'react';
import Image, { type ImageProps } from 'next/image';

function extractRawSanityUrl(src: string): string | null {
  try {
    const url = new URL(src, window.location.origin);
    const pathSegments = url.pathname.split('/');
    const sanityIndex = pathSegments.indexOf('sanity');
    if (sanityIndex === -1 || !pathSegments[sanityIndex + 1]) return null;
    return Buffer.from(pathSegments[sanityIndex + 1], 'base64url').toString('utf8');
  } catch {
    return null;
  }
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
  const [imgSrc, setImgSrc] = useState<string | ImageProps['src']>(props.src);
  const [hasFallback, setHasFallback] = useState(false);

  const handleError = useCallback(() => {
    if (hasFallback) return;
    const raw = extractRawSanityUrl(String(imgSrc));
    if (raw) {
      setImgSrc(raw);
      setHasFallback(true);
    }
  }, [imgSrc, hasFallback]);

  // eslint-disable-next-line jsx-a11y/alt-text -- alt is forwarded via props
  return <Image {...props} src={imgSrc} quality={props.quality ?? 85} unoptimized onError={handleError} />;
};

export default OptimizedImage;
