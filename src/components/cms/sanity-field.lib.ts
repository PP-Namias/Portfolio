import {SANITY_PROJECT_ID} from '@/lib/site-config'

export function buildStudioEditHref(
  documentId: string,
  documentType: string,
  fieldPath: string,
): string {
  const params = new URLSearchParams({
    doc: `${documentType}:${documentId}`,
    path: fieldPath,
  })
  return `https://namias-cms.sanity.studio/intent/edit?${params.toString()}`
}

export function buildSanityDataAttribute(
  documentId: string,
  documentType: string,
  fieldPath: string,
): string {
  return `data-sanity="${documentId}.${documentType}.${fieldPath.replace(/\./g, '|')}|${SANITY_PROJECT_ID}"`
}
