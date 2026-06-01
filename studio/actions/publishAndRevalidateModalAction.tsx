import {type DocumentActionComponent, type DocumentActionProps} from 'sanity'

import {PublishAndRevalidateDialog} from './publishAndRevalidateAction'

const Action: DocumentActionComponent = (props: DocumentActionProps) => {
  if (typeof window === 'undefined') {
    return null
  }
  return {
    label: 'Publish & revalidate (modal)',
    icon: () => '↻',
    onHandle: () => {
      const root = document.createElement('div')
      root.id = 'sanity-publish-revalidate-root'
      document.body.appendChild(root)

      const cleanup = () => {
        root.remove()
      }

      import('react-dom/client').then(({createRoot}) => {
        createRoot(root).render(
          <PublishAndRevalidateDialog
            documentId={props.id}
            documentType={props.type}
            onResolved={cleanup}
          />,
        )
      })
    },
  }
}

export const publishAndRevalidateModalAction = Action
