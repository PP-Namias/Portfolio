import React from 'react'

import {formatDuration} from '../../utils/text'

type ListItemPropsLike = {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  media?: React.ReactNode
  status?: unknown
  featured?: boolean
  startDate?: unknown
  endDate?: unknown
}

export function ProjectListItem(props: ListItemPropsLike & Record<string, any>) {
  const {title, subtitle, media, status, featured} = props
  const statusColor: Record<string, string> = {
    completed: '#22c55e',
    'in-progress': '#f59e0b',
    prototype: '#6366f1',
    draft: '#9ca3af',
    archived: '#6b7280',
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 10,
        background: featured ? 'linear-gradient(90deg, rgba(255,99,165,0.08), rgba(99,102,241,0.08))' : 'transparent',
      }}
    >
      {media ? (
        <div style={{width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0}}>{media}</div>
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #ff63a5, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {(String(title ?? 'P')).charAt(0).toUpperCase()}
        </div>
      )}
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {title as React.ReactNode}
        </div>
        <div style={{fontSize: 12, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {subtitle as React.ReactNode}
        </div>
      </div>
      {status ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: statusColor[String(status)] || 'rgba(255,255,255,0.6)',
            padding: '2px 8px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          {String(status)}
        </span>
      ) : null}
    </div>
  )
}

export function ExperienceListItem(props: ListItemPropsLike & Record<string, any>) {
  const {title, subtitle, status, startDate, endDate} = props
  const duration = formatDuration(startDate as unknown, endDate as unknown)

  return (
    <div style={{padding: '10px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12}}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'rgba(99,102,241,0.15)',
          color: '#6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {(String(title ?? 'X')).charAt(0).toUpperCase()}
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {title as React.ReactNode}
        </div>
        <div style={{fontSize: 12, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {subtitle as React.ReactNode}
        </div>
      </div>
      {duration ? (
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 999,
            background: 'rgba(99,102,241,0.12)',
            color: '#6366f1',
          }}
        >
          {duration}
        </span>
      ) : null}
      {status ? (
        <span style={{fontSize: 10, color: 'rgba(255,255,255,0.5)'}}>
          {String(status).toUpperCase()}
        </span>
      ) : null}
    </div>
  )
}

export function PostListItem(props: ListItemPropsLike & Record<string, any>) {
  const {title, subtitle, status, media} = props

  return (
    <div style={{padding: '10px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12}}>
      {media ? (
        <div style={{width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0}}>{media}</div>
      ) : (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #22c55e)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          ✎
        </div>
      )}
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {title as React.ReactNode}
        </div>
        <div style={{fontSize: 12, color: 'rgba(255,255,255,0.55)'}}>{subtitle as React.ReactNode}</div>
      </div>
      {status ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: status === 'published' ? '#22c55e' : '#9ca3af',
          }}
        >
          {String(status)}
        </span>
      ) : null}
    </div>
  )
}
