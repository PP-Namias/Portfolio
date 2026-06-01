/**
 * Sanity Function: auto-tag-images
 *
 * Triggers: sanity.imageAsset.create
 *
 * Stub that would call an image-tagging API (Google Vision, Rekognition, or
 * an internal CV model) and patch the asset's metadata.labels with the
 * detected labels. Deployed as a Sanity Function so it runs server-side
 * without a separate Cloudflare Worker.
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'nl0qw78w',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2025-10-21',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

type ImageAssetEvent = {
  data?: {
    asset?: {
      _id?: string
      url?: string
    }
  }
}

async function tagImage(_url: string): Promise<string[]> {
  return ['demo-label']
}

export async function autoTagImages(event: unknown) {
  const ev = event as ImageAssetEvent
  const assetId = ev.data?.asset?._id
  const url = ev.data?.asset?.url
  if (!assetId || !url) {
    return {ok: false, reason: 'missing asset id or url'}
  }

  const labels = await tagImage(url)
  await client
    .patch(assetId)
    .set({metadata: {labels: {en: labels}}})
    .commit()

  return {ok: true, assetId, labels}
}

export default autoTagImages
