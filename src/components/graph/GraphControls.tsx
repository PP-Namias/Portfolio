'use client'

import { useState, useCallback } from 'react'
import { GraphNode, GraphCommunity } from '@/types/graph'

interface GraphControlsProps {
  communities: GraphCommunity[]
  nodeTypes: GraphNode['type'][]
  onSearch: (query: string) => void
  onFilterType: (types: GraphNode['type'][]) => void
  onFilterCommunity: (communityId: number | null) => void
  onReset: () => void
  nodeCount: number
  edgeCount: number
  className?: string
}

const NODE_TYPE_LABELS: Record<GraphNode['type'], string> = {
  file: 'Files',
  function: 'Functions',
  class: 'Classes',
  interface: 'Interfaces',
  type: 'Types',
  variable: 'Variables',
  module: 'Modules',
  concept: 'Concepts',
}

export function GraphControls({
  communities,
  nodeTypes,
  onSearch,
  onFilterType,
  onFilterCommunity,
  onReset,
  nodeCount,
  edgeCount,
  className,
}: GraphControlsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<GraphNode['type'][]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null)

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchQuery(value)
      onSearch(value)
    },
    [onSearch]
  )

  const handleToggleType = useCallback(
    (type: GraphNode['type']) => {
      setSelectedTypes((prev) => {
        const next = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        onFilterType(next)
        return next
      })
    },
    [onFilterType]
  )

  const handleCommunityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value === 'all' ? null : Number(e.target.value)
      setSelectedCommunity(value)
      onFilterCommunity(value)
    },
    [onFilterCommunity]
  )

  const handleReset = useCallback(() => {
    setSearchQuery('')
    setSelectedTypes([])
    setSelectedCommunity(null)
    onReset()
  }, [onReset])

  return (
    <div className={`flex flex-col gap-4 p-4 bg-gray-900 rounded-lg ${className ?? ''}`}>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>{nodeCount} nodes</span>
        <span>{edgeCount} edges</span>
      </div>

      <div>
        <label htmlFor="graph-search" className="block text-sm font-medium text-gray-300 mb-1">
          Search
        </label>
        <input
          id="graph-search"
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search nodes..."
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Node Types</label>
        <div className="flex flex-wrap gap-2">
          {nodeTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleToggleType(type)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedTypes.includes(type)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {NODE_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {communities.length > 0 && (
        <div>
          <label
            htmlFor="community-filter"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Community
          </label>
          <select
            id="community-filter"
            value={selectedCommunity ?? 'all'}
            onChange={handleCommunityChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Communities</option>
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name} ({community.nodeCount})
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleReset}
        className="px-3 py-2 text-sm text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  )
}
