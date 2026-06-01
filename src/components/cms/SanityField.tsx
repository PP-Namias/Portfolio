import type {ComponentType, ReactNode} from 'react'

export type SanityFieldPath = {
  documentId: string
  documentType: string
  fieldPath: string
}

export type SanityFieldContext = SanityFieldPath & {
  editable: boolean
}

export type SanityFieldProps = {
  documentId: string
  documentType: string
  fieldPath: string
  editable?: boolean
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

const PROJECT_ID = 'nl0qw78w'

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
  return `data-sanity="${documentId}.${documentType}.${fieldPath.replace(/\./g, '|')}|${PROJECT_ID}"`
}

export function SanityField({
  documentId,
  documentType,
  fieldPath,
  editable = true,
  children,
  className,
  as: As = 'div',
}: SanityFieldProps) {
  const dataAttr = buildSanityDataAttribute(documentId, documentType, fieldPath)
  const editHref = editable
    ? buildStudioEditHref(documentId, documentType, fieldPath)
    : undefined

  const Component = As as ComponentType<{
    className?: string
    'data-sanity'?: string
    'data-sanity-editable'?: string
    'data-sanity-edit-href'?: string
    children?: ReactNode
  }>

  return (
    <Component
      className={className}
      data-sanity={dataAttr.split('=')[1].replace(/"/g, '')}
      data-sanity-editable={editable ? 'true' : undefined}
      data-sanity-edit-href={editHref}
    >
      {children}
    </Component>
  )
}

export type {SanityFieldContext, SanityFieldPath}
