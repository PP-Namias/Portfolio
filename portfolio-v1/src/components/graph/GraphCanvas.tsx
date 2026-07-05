'use client'

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import * as d3 from 'd3'
import { GraphNode, GraphEdge } from '@/types/graph'

interface GraphCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick?: (node: GraphNode) => void
  selectedNodeId?: string
  className?: string
}

interface SimulationNode extends GraphNode {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  id: string
  type: GraphEdge['type']
  confidence: GraphEdge['confidence']
}

const COMMUNITY_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#10b981',
  '#0ea5e9',
  '#8b5cf6',
]

const NODE_TYPE_RADIUS: Record<GraphNode['type'], number> = {
  file: 8,
  function: 6,
  class: 8,
  interface: 7,
  type: 5,
  variable: 4,
  module: 10,
  concept: 9,
}

export function GraphCanvas({
  nodes,
  edges,
  onNodeClick,
  selectedNodeId,
  className,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const simulationRef = useRef<d3.Simulation<SimulationNode, SimulationLink> | null>(null)

  const communityColorMap = useMemo(() => {
    const map = new Map<number, string>()
    const communities = new Set(
      nodes.map((n) => n.community).filter((c): c is number => c !== undefined)
    )
    Array.from(communities).forEach((id, i) => {
      map.set(id, COMMUNITY_COLORS[i % COMMUNITY_COLORS.length])
    })
    return map
  }, [nodes])

  const simulationNodes = useMemo<SimulationNode[]>(() => nodes.map((n) => ({ ...n })), [nodes])

  const simulationLinks = useMemo<SimulationLink[]>(
    () =>
      edges.map((e) => ({
        ...e,
        source: e.source,
        target: e.target,
      })),
    [edges]
  )

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setDimensions({ width, height })
        }
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current || simulationNodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions

    const g = svg.append('g')

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    const simulation = d3
      .forceSimulation<SimulationNode>(simulationNodes)
      .force(
        'link',
        d3
          .forceLink<SimulationNode, SimulationLink>(simulationLinks)
          .id((d) => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20))

    simulationRef.current = simulation

    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(simulationLinks)
      .enter()
      .append('line')
      .attr('stroke', '#374151')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1)

    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, SimulationNode>('g')
      .data(simulationNodes)
      .enter()
      .append('g')
      .call(
        d3
          .drag<SVGGElement, SimulationNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          })
      )

    node
      .append('circle')
      .attr('r', (d) => NODE_TYPE_RADIUS[d.type])
      .attr('fill', (d) =>
        d.community !== undefined ? (communityColorMap.get(d.community) ?? '#6b7280') : '#6b7280'
      )
      .attr('stroke', (d) => (d.id === selectedNodeId ? '#ffffff' : '#1f2937'))
      .attr('stroke-width', (d) => (d.id === selectedNodeId ? 3 : 1))
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation()
        onNodeClick?.(d)
      })

    node.append('title').text((d) => `${d.label}\n${d.type}\n${d.filePath ?? ''}`)

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimulationNode).x ?? 0)
        .attr('y1', (d) => (d.source as SimulationNode).y ?? 0)
        .attr('x2', (d) => (d.target as SimulationNode).x ?? 0)
        .attr('y2', (d) => (d.target as SimulationNode).y ?? 0)

      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    return () => {
      simulation.stop()
    }
  }, [simulationNodes, simulationLinks, dimensions, communityColorMap, selectedNodeId, onNodeClick])

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className ?? ''}`}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="bg-gray-950 rounded-lg"
        style={{ touchAction: 'manipulation' }}
      />
      {prefersReducedMotion && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-500">
          Reduced motion detected - animations disabled
        </div>
      )}
    </div>
  )
}
