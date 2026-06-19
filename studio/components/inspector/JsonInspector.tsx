import React, {useMemo, useState} from 'react'
import {useFormValue} from 'sanity'

type Tab = 'raw' | 'fields' | 'meta'

export function JsonInspector() {
  const rawValues = useFormValue([])
  const values = useMemo(() => (rawValues || {}) as Record<string, unknown>, [rawValues])
  const [activeTab, setActiveTab] = useState<Tab>('raw')
  const [copied, setCopied] = useState(false)

  const filteredValues = useMemo(() => {
    const {_createdAt, _updatedAt, _rev, _type, ...rest} = values
    return rest
  }, [values])

  const meta = useMemo(() => ({
    _type: values._type,
    _id: values._id,
    _createdAt: values._createdAt,
    _updatedAt: values._updatedAt,
    _rev: values._rev,
  }), [values])

  const fields = useMemo(() => {
    return Object.keys(filteredValues).map((key) => ({
      name: key,
      type: getFieldType(filteredValues[key]),
      value: filteredValues[key],
    }))
  }, [filteredValues])

  const handleCopy = async () => {
    const text = JSON.stringify(activeTab === 'meta' ? meta : activeTab === 'fields' ? fields : filteredValues, null, 2)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs: {key: Tab; label: string}[] = [
    {key: 'raw', label: 'Raw JSON'},
    {key: 'fields', label: 'Fields'},
    {key: 'meta', label: 'Meta'},
  ]

  return (
    <div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13}}>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.55)', textTransform: 'uppercase', letterSpacing: 0.5}}>
          JSON Inspector
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid rgba(0,0,0,0.1)',
            background: copied ? 'rgba(34,197,94,0.12)' : 'transparent',
            color: copied ? '#166534' : 'rgba(0,0,0,0.6)',
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{display: 'flex', gap: 4}}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === tab.key ? 'rgba(99,102,241,0.12)' : 'transparent',
              color: activeTab === tab.key ? '#4338ca' : 'rgba(0,0,0,0.6)',
              fontWeight: activeTab === tab.key ? 600 : 400,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          padding: 12,
          borderRadius: 10,
          background: '#f8f9fa',
          border: '1px solid rgba(0,0,0,0.06)',
          maxHeight: 400,
          overflow: 'auto',
        }}
      >
        {activeTab === 'raw' && (
          <pre style={{margin: 0, fontSize: 11, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
            {JSON.stringify(filteredValues, null, 2)}
          </pre>
        )}

        {activeTab === 'fields' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            {fields.map((field) => (
              <div key={field.name} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 8, borderRadius: 6, background: '#fff'}}>
                <div>
                  <div style={{fontWeight: 600, color: '#1f1f1f'}}>{field.name}</div>
                  <div style={{fontSize: 11, color: 'rgba(0,0,0,0.5)'}}>{field.type}</div>
                </div>
                <div style={{fontSize: 11, color: 'rgba(0,0,0,0.6)', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all'}}>
                  {formatValue(field.value)}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'meta' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            {Object.entries(meta).map(([key, value]) => (
              <div key={key} style={{display: 'flex', justifyContent: 'space-between', padding: 8, borderRadius: 6, background: '#fff'}}>
                <div style={{fontWeight: 600, color: '#1f1f1f'}}>{key}</div>
                <div style={{fontSize: 11, color: 'rgba(0,0,0,0.6)'}}>{String(value)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getFieldType(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (Array.isArray(value)) return `array[${value.length}]`
  if (typeof value === 'object') return 'object'
  return typeof value
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'string') return value.length > 60 ? `${value.slice(0, 60)}...` : value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return `[${value.length} items]`
  if (typeof value === 'object') return '{...}'
  return String(value)
}
