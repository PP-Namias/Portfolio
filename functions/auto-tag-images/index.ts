/**
 * Sanity Function: auto-tag-images
 *
 * Trigger: document mutation on `sanity.imageAsset`. Calls an image-tagging
 * service (stubbed here - replace with Google Vision, AWS Rekognition, or an
 * internal CV model) and patches the asset's `metadata.labels` with the
 * detected labels.
 *
 * Trigger: document (sanity.imageAsset) - any mutation
 * Inputs: {data: {asset document fields}}
 * Outputs: {ok, assetId, labels}
 */
import {createClient} from '@sanity/client'
import {documentEventHandler} from '@sanity/functions'

async function tagImage(_url: string): Promise<string[]> {
  return ['demo-label']
}

export const handler = documentEventHandler(async ({context, event}) => {
  const asset = event.data as {_id?: string; url?: string} | undefined
  const assetId = asset?._id
  const url = asset?.url
  if (!assetId || !url) {
    console.warn('auto-tag-images: missing asset id or url')
    return
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

  console.log('auto-tag-images: tagged', assetId, 'with', labels.length, 'labels')
})
