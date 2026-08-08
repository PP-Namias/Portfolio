import { cache } from 'react'
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server'
import { buildMediaGatewayUrl } from '@/lib/media-gateway'
import type { GalleryItem } from '@/types'

const maybeCache = <T extends (...args: unknown[]) => Promise<GalleryData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn
}

export type GalleryData = {
  galleryImages: GalleryItem[]
}

async function fetchGalleryDataImpl(): Promise<GalleryData> {
  const galleryDocs = await querySanity<
    Array<{
      title?: string
      mediaType?: string
      tags?: string[]
      capturedAt?: string
      category?: { title?: string }
      image?: { asset?: { originalFilename?: string } }
      mediaPath?: string
      mediaFile?: string
      mediaUrl?: string
      alt?: string
      caption?: string
      credit?: string
      source?: string
      license?: string
    }>
  >(
    '*[_type == "galleryImage"] | order(order asc, capturedAt desc){title,mediaType,tags,capturedAt,"category":category->title,"mediaFile":image.asset->originalFilename,"mediaUrl":image.asset->url,mediaPath,alt,caption,credit,source,license}',
    { tags: CONTENT_TAGS.galleryImage }
  )

  const galleryImages: GalleryItem[] = (galleryDocs ?? []).map((image) => ({
    title: image.title || '',
    mediaType: image.mediaType || 'Image',
    media:
      buildMediaGatewayUrl(image.mediaUrl || image.mediaPath || '', {
        width: 480,
        quality: 85,
        sign: true,
        label: image.title,
      }) || '',
    alt: image.alt || image.title || '',
    caption: image.caption || '',
    credit: image.credit || '',
    source: image.source || '',
    license: image.license || '',
    tags: image.tags || [],
    createdAt: image.capturedAt || '',
  }))

  return { galleryImages }
}

export const fetchGalleryData = maybeCache(fetchGalleryDataImpl)
