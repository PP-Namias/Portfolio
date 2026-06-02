export const SANITY_PROJECT_ID = 'nl0qw78w'

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
