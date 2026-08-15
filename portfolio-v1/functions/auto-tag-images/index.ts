import {createClient} from '@sanity/client'
import {documentEventHandler} from '@sanity/functions'

function extractTagsFromUrl(url: string): string[] {
  const filename = url.split('/').pop()?.split('?')[0]?.toLowerCase() ?? ''
  const parts = filename.replace(/[_-]/g, ' ').replace(/\.\w+$/, '').split(/\s+/)
  return parts.filter((p) => p.length > 2).slice(0, 5)
}

export const handler = documentEventHandler(async ({context, event}) => {
  const asset = event.data as {_id?: string; url?: string} | undefined
  const assetId = asset?._id
  const url = asset?.url
  if (!assetId || !url) return

  const client = createClient({
    ...context.clientOptions,
    useCdn: false,
    apiVersion: '2026-02-19',
  })

  const labels = extractTagsFromUrl(url)
  await client.patch(assetId).set({metadata: {labels: {en: labels}}}).commit()
})
