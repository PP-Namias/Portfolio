import {type DocumentActionComponent, type DocumentActionProps} from 'sanity'

export const openInPresentationAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const {id, type} = props
  const target = `/studio/presentation;id=${encodeURIComponent(id)};type=${encodeURIComponent(type)};`

  return {
    label: 'Open in Presentation',
    icon: () => '◰',
    tooltip: 'Open the Presentation tool with this document selected',
    onHandle: () => {
      if (typeof window !== 'undefined') {
        window.location.assign(target)
      }
    },
  }
}
