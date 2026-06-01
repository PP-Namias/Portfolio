import React, {useState} from 'react'
import {useDocumentOperation, type DocumentActionComponent, type DocumentActionProps} from 'sanity'

import {getStudioEnvSnapshot, getWebhookTriggerUrl} from '../env'

const REVALIDATE_PATHS = ['/', '/blog', '/blog/[slug]', '/sitemap.xml', '/projects', '/projects/[slug]']

function ConfirmDialog({paths, documentId, documentType, onCancel, onConfirm}: {
  paths: string[]
  documentId: string
  documentType: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: '100%',
          background: '#0e0e10',
          color: '#fff',
          borderRadius: 14,
          padding: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        <h2 style={{fontSize: 20, fontWeight: 700, margin: 0, color: '#ff63a5'}}>Publish &amp; revalidate</h2>
        <p style={{marginTop: 8, color: 'rgba(255,255,255,0.7)', fontSize: 14}}>
          Publishing <code style={{background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4}}>{documentType}#{documentId}</code>{' '}
          will trigger a revalidation of the marketing site on these routes:
        </p>
        <ul style={{marginTop: 12, paddingLeft: 18, fontSize: 13, color: 'rgba(255,255,255,0.85)'}}>
          {paths.map((p) => (
            <li key={p} style={{padding: '2px 0'}}>
              <code style={{background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4}}>{p}</code>
            </li>
          ))}
        </ul>
        <p style={{marginTop: 12, color: 'rgba(255,255,255,0.55)', fontSize: 12}}>
          The webhook will be sent to <code>{getStudioEnvSnapshot().siteUrl}/api/sanity/webhook</code>.
        </p>
        <div style={{display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end'}}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(90deg, #ff63a5, #6366f1)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Publish &amp; revalidate
          </button>
        </div>
      </div>
    </div>
  )
}

export const publishAndRevalidateAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {id, type, draft, published, onComplete} = props
  const {publish} = useDocumentOperation(id, type)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  if (published) {
    return {
      label: isPublishing ? 'Revalidating…' : 'Publish & revalidate',
      icon: () => '↻',
      onHandle: () => setShowConfirm(true),
    }
  }

  const draftPublishAt = (draft as {publishAt?: string} | undefined)?.publishAt
  const isScheduledInFuture =
    typeof draftPublishAt === 'string' && new Date(draftPublishAt).getTime() > Date.now()

  return {
    label: isPublishing ? 'Publishing…' : 'Publish & revalidate',
    disabled: Boolean(publish.disabled) || isPublishing || isScheduledInFuture,
    icon: () => '↻',
    onHandle: () => {
      setShowConfirm(true)
      onComplete?.()
    },
  }
}

export const PublishAndRevalidateDialog = ({
  documentId,
  documentType,
  onResolved,
}: {
  documentId: string
  documentType: string
  onResolved: () => void
}) => {
  const [showConfirm, setShowConfirm] = useState(true)

  const handleConfirm = async () => {
    setShowConfirm(false)
    try {
      await fetch(getWebhookTriggerUrl(), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({documentId, documentType, source: 'sanity-studio'}),
      })
    } catch {
      // Swallow - webhook errors should not block the demo.
    } finally {
      onResolved()
    }
  }

  if (!showConfirm) {
    return null
  }

  return (
    <ConfirmDialog
      paths={REVALIDATE_PATHS as string[]}
      documentId={documentId}
      documentType={documentType}
      onCancel={() => {
        setShowConfirm(false)
        onResolved()
      }}
      onConfirm={handleConfirm}
    />
  )
}

export {REVALIDATE_PATHS}
