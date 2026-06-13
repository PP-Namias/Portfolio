const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://namias.tech'
const DEFAULT_SEO_IMAGE = `${SITE_URL}/og-default.png`

type SanityImage = {
  asset?: {
    url?: string
    metadata?: {
      dimensions?: {
        width?: number
        height?: number
      }
    }
  }
  alt?: string
}

export function getSeoImageUrl(
  image: SanityImage | string | null | undefined,
  options?: {width?: number; height?: number},
): string {
  if (!image) return DEFAULT_SEO_IMAGE

  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `${SITE_URL}${image}`
  }

  const assetUrl = image?.asset?.url
  if (!assetUrl) return DEFAULT_SEO_IMAGE

  return assetUrl
}

export function getSeoImageAlt(
  image: SanityImage | string | null | undefined,
  fallback = 'Jhon Keneth Namias - Full Stack Developer',
): string {
  if (!image) return fallback
  if (typeof image === 'string') return fallback
  return image?.alt || fallback
}

export function getSeoImageDimensions(
  image: SanityImage | null | undefined,
): {width: number; height: number} {
  const dimensions = image?.asset?.metadata?.dimensions
  return {
    width: dimensions?.width || 1200,
    height: dimensions?.height || 630,
  }
}
