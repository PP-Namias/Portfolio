'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useGraph } from '@/hooks/useGraph'
import { useGraphQuery } from '@/hooks/useGraphQuery'
import { GraphControls } from '@/components/graph/GraphControls'
import { GraphNodeDetail } from '@/components/graph/GraphNodeDetail'
import { GraphNode, GraphEdge } from '@/types/graph'

const GraphCanvas = dynamic(
  () => import('@/components/graph/GraphCanvas').then((mod) => mod.GraphCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-950 rounded-lg">
        <div className="text-gray-400">Loading graph...</div>
      </div>
    ),
  }
)

export function ExplorerPage() {
  const { graph, isLoading: graphLoading } = useGraph()
  const { query, updateQuery, results, isLoading: queryLoading } = useGraphQuery()
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [filteredTypes, setFilteredTypes] = useState<GraphNode['type'][]>([])
  const [filteredCommunity, setFilteredCommunity] = useState<number | null>(null)

  const filteredNodes = useMemo(() => {
    if (!graph) return []
    let nodes = graph.nodes
    if (filteredTypes.length > 0) {
      nodes = nodes.filter((n) => filteredTypes.includes(n.type))
    }
    if (filteredCommunity !== null) {
      nodes = nodes.filter((n) => n.community === filteredCommunity)
    }
    return nodes
  }, [graph, filteredTypes, filteredCommunity])

  const filteredEdges = useMemo(() => {
    if (!graph) return []
    const nodeIds = new Set(filteredNodes.map((n) => n.id))
    return graph.edges.filter((e) => nodeIds.has(e.source) || nodeIds.has(e.target))
  }, [graph, filteredNodes])

  const displayNodes = query ? (results?.nodes ?? []) : filteredNodes
  const displayEdges = query ? (results?.edges ?? []) : filteredEdges

  const uniqueNodeTypes = useMemo(() => {
    if (!graph) return []
    return Array.from(new Set(graph.nodes.map((n) => n.type)))
  }, [graph])

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleSearch = useCallback(
    (searchQuery: string) => {
      updateQuery(searchQuery)
    },
    [updateQuery]
  )

  const handleFilterType = useCallback((types: GraphNode['type'][]) => {
    setFilteredTypes(types)
  }, [])

  const handleFilterCommunity = useCallback((communityId: number | null) => {
    setFilteredCommunity(communityId)
  }, [])

  const handleReset = useCallback(() => {
    setFilteredTypes([])
    setFilteredCommunity(null)
    updateQuery('')
  }, [updateQuery])

  const selectedNodeDetail = useMemo(() => {
    if (!selectedNode || !graph) return null
    const incomingEdges = graph.edges.filter((e) => e.target === selectedNode.id)
    const outgoingEdges = graph.edges.filter((e) => e.source === selectedNode.id)
    const relatedIds = new Set<string>()
    for (const edge of incomingEdges) relatedIds.add(edge.source)
    for (const edge of outgoingEdges) relatedIds.add(edge.target)
    const relatedNodes = graph.nodes.filter((n) => relatedIds.has(n.id) && n.id !== selectedNode.id)
    return { incomingEdges, outgoingEdges, relatedNodes }
  }, [selectedNode, graph])

  if (graphLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading graph data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Codebase Explorer</h1>
          <p className="text-gray-400">
            Interactive knowledge graph visualization of the portfolio codebase
          </p>
        </div>

        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <GraphControls
              communities={graph?.communities ?? []}
              nodeTypes={uniqueNodeTypes}
              onSearch={handleSearch}
              onFilterType={handleFilterType}
              onFilterCommunity={handleFilterCommunity}
              onReset={handleReset}
              nodeCount={filteredNodes.length}
              edgeCount={filteredEdges.length}
            />
          </div>

          <div className="flex-1 relative">
            <div className="h-[600px]">
              <GraphCanvas
                nodes={displayNodes}
                edges={displayEdges}
                onNodeClick={handleNodeClick}
                selectedNodeId={selectedNode?.id}
              />
            </div>

            {queryLoading && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                Searching...
              </div>
            )}
          </div>

          {selectedNode && selectedNodeDetail && (
            <div className="w-80 flex-shrink-0">
              <GraphNodeDetail
                node={selectedNode}
                incomingEdges={selectedNodeDetail.incomingEdges}
                outgoingEdges={selectedNodeDetail.outgoingEdges}
                relatedNodes={selectedNodeDetail.relatedNodes}
                onClose={handleCloseDetail}
                onNodeClick={handleNodeClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
