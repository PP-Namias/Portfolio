import type {ComponentType} from 'react'
import {buildSanityDataAttribute, buildStudioEditHref} from './sanity-field.lib'
import type {SanityFieldProps} from './sanity-field.types'

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

  const Component = As as unknown as ComponentType<{
    className?: string
    'data-sanity'?: string
    'data-sanity-editable'?: string
    'data-sanity-edit-href'?: string
    children?: React.ReactNode
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
