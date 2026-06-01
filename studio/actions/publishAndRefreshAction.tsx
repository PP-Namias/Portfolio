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
    const {id, type, draft, onComplete} = props
    const {publish} = useDocumentOperation(id, type)
    const [isPublishing, setIsPublishing] = useState(false)
    const refreshTriggeredRef = useRef(false)

    useEffect(() => {
      if (!isPublishing || draft || refreshTriggeredRef.current) {
        return
      }

      refreshTriggeredRef.current = true

      void triggerWebsiteRefresh(id, type)
        .catch(() => {
          // Ignore webhook errors so publish still completes.
        })
        .finally(() => {
          setIsPublishing(false)
          onComplete?.()
        })
    }, [draft, id, isPublishing, onComplete, type])

    if (!originalResult) {
      return null
    }

    const originalDisabled = Boolean(originalResult.disabled)
    const publishDisabled = Boolean(publish.disabled)

    return {
      ...originalResult,
      label: isPublishing ? 'Publishing…' : originalResult.label,
      disabled: originalDisabled || publishDisabled || isPublishing,
      onHandle: () => {
        refreshTriggeredRef.current = false
        setIsPublishing(true)
        originalResult.onHandle?.()
      },
    }
  }
}
