'use client'

import React from 'react'
import Image from '@/components/ui/OptimizedImage'
import { resolveContentImageSrc } from '@/lib/media'

export interface GalleryImage {
  url: string
  alt: string
  caption: string
  credit: string
}

interface CollageGalleryProps {
  images: GalleryImage[]
  layout: '2col' | '3col'
}

const gridCols: Record<string, string> = {
  '2col': 'grid-cols-1 sm:grid-cols-2',
  '3col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}

export default function CollageGallery({ images, layout }: CollageGalleryProps) {
  if (images.length === 0) return null

  return (
    <div className={`grid ${gridCols[layout] || gridCols['2col']} gap-3 my-6`}>
      {images.map((img) => {
        const src = img.url.includes('cdn.sanity.io')
          ? resolveContentImageSrc(img.url, { folder: 'blog', label: img.alt })
          : img.url

        return (
          <figure key={img.url} className="space-y-1.5">
            <div className="overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <Image
                src={src}
                alt={img.alt || ''}
                width={600}
                height={400}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            {(img.caption || img.credit) && (
              <figcaption className="text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed px-1">
                {img.caption && <span>{img.caption}</span>}
                {img.credit && (
                  <span>
                    {' '}
                    — <em>{img.credit}</em>
                  </span>
                )}
              </figcaption>
            )}
          </figure>
        )
      })}
    </div>
  )
}
