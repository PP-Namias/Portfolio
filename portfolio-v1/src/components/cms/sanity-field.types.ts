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
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}
