'use client'

import { useCallback, useEffect } from 'react'
import { GraphNode, GraphEdge } from '@/types/graph'

interface GraphNodeDetailProps {
  node: GraphNode
  incomingEdges: GraphEdge[]
  outgoingEdges: GraphEdge[]
  relatedNodes: GraphNode[]
  onClose: () => void
  onNodeClick?: (node: GraphNode) => void
  className?: string
}

const CONFIDENCE_STYLES: Record<GraphNode['confidence'], string> = {
  EXTRACTED: 'bg-green-900 text-green-300',
  INFERRED: 'bg-yellow-900 text-yellow-300',
  AMBIGUOUS: 'bg-red-900 text-red-300',
}

const NODE_TYPE_LABELS: Record<GraphNode['type'], string> = {
  file: 'File',
  function: 'Function',
  class: 'Class',
  interface: 'Interface',
  type: 'Type',
  variable: 'Variable',
  module: 'Module',
  concept: 'Concept',
}

export function GraphNodeDetail({
  node,
  incomingEdges,
  outgoingEdges,
  relatedNodes,
  onClose,
  onNodeClick,
  className,
}: GraphNodeDetailProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div
      className={`bg-gray-900 border border-gray-700 rounded-lg p-4 ${className ?? ''}`}
      role="dialog"
      aria-label={`Node details: ${node.label}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{node.label}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-400">{NODE_TYPE_LABELS[node.type]}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${CONFIDENCE_STYLES[node.confidence]}`}>
              {node.confidence}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Close details"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {node.filePath && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-1">File Path</h4>
          <p className="text-sm text-gray-400 font-mono break-all">{node.filePath}</p>
        </div>
      )}

      {node.community !== undefined && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-1">Community</h4>
          <p className="text-sm text-gray-400">
            {node.communityName ?? `Community ${node.community}`}
          </p>
        </div>
      )}

      {outgoingEdges.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Outgoing Connections ({outgoingEdges.length})
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {outgoingEdges.map((edge) => (
              <div key={edge.id} className="text-xs text-gray-400 flex items-center gap-1">
                <span className="text-blue-400">→</span>
                <span>{edge.target}</span>
                <span className="text-gray-500">({edge.type})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {incomingEdges.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Incoming Connections ({incomingEdges.length})
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {incomingEdges.map((edge) => (
              <div key={edge.id} className="text-xs text-gray-400 flex items-center gap-1">
                <span className="text-green-400">←</span>
                <span>{edge.source}</span>
                <span className="text-gray-500">({edge.type})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {relatedNodes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Related Nodes ({relatedNodes.length})
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {relatedNodes.map((relatedNode) => (
              <button
                key={relatedNode.id}
                onClick={() => onNodeClick?.(relatedNode)}
                className="block text-xs text-blue-400 hover:text-blue-300 transition-colors text-left"
              >
                {relatedNode.label} ({NODE_TYPE_LABELS[relatedNode.type]})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
