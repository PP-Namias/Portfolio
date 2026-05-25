import React, {useEffect, useRef, useState} from 'react'
import {useDocumentOperation, type DocumentActionComponent, type DocumentActionProps} from 'sanity'

import {getWebhookTriggerUrl} from '../env'

async function triggerWebsiteRefresh(documentId: string, schemaType: string): Promise<void> {
  const response = await fetch(getWebhookTriggerUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentId,
      schemaType,
      source: 'sanity-studio',
    }),
  })

  if (!response.ok) {
    throw new Error(`Webhook refresh failed with status ${response.status}`)
  }
}

export function createPublishAndRefreshAction(
  originalAction: DocumentActionComponent,
): DocumentActionComponent {
  return function PublishAndRefreshAction(props: DocumentActionProps) {
    const originalResult = originalAction(props)
    const {publish} = useDocumentOperation(props.id, props.type)
    const [isPublishing, setIsPublishing] = useState(false)
    const refreshTriggeredRef = useRef(false)

    useEffect(() => {
      if (!isPublishing || props.draft || refreshTriggeredRef.current) {
        return
      }

      refreshTriggeredRef.current = true

      void triggerWebsiteRefresh(props.id, props.type)
        .catch(() => {
          // Ignore webhook errors so publish still completes.
        })
        .finally(() => {
          setIsPublishing(false)
          props.onComplete?.()
        })
    }, [isPublishing, props.draft, props.id, props.type, props.onComplete])

    if (!originalResult) {
      return null
    }

    return {
      ...originalResult,
      label: isPublishing ? 'Publishing…' : originalResult.label,
      disabled: originalResult.disabled || publish.disabled || isPublishing,
      onHandle: () => {
        refreshTriggeredRef.current = false
        setIsPublishing(true)
        originalResult.onHandle()
      },
    }
  }
}