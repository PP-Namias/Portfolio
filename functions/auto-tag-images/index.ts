/**
 * Sanity Function: auto-tag-images
 *
 * Trigger: sanity.imageAsset.create. Calls an image-tagging service
 * (stubbed here as `tagImage` - replace with a real provider like
 * Google Vision, AWS Rekognition, or an internal CV model) and patches
 * the asset's `metadata.labels` with the detected labels.
 *
 * Trigger: image-asset / create
 * Inputs: {data: {asset: {_id, url}}}
 * Outputs: {ok, assetId, labels}
 */
import {createClient} from '@sanity/client'
import {imageAssetEventHandler} from '@sanity/functions'

async function tagImage(_url: string): Promise<string[]> {
  return ['demo-label']
}

export const handler = imageAssetEventHandler(async ({context, event}) => {
  const assetId = event.data?.asset?._id
  const url = event.data?.asset?.url
  if (!assetId || !url) {
    return {ok: false, reason: 'missing asset id or url'}
  }

  const client = createClient({
    ...context.clientOptions,
    useCdn: false,
    apiVersion: '2026-02-19',
  })

  const labels = await tagImage(url)
  await client
    .patch(assetId)
    .set({metadata: {labels: {en: labels}}})
    .commit()

  return {ok: true, assetId, labels}
})
