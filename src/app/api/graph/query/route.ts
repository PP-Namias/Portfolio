import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import {
  GraphData,
  GraphNode,
  GraphEdge,
  GraphQueryRequest,
  GraphQueryResponse,
} from '@/types/graph'

const GRAPH_PATH = join(process.cwd(), 'graphify-out', 'graph.json')

async function loadGraph(): Promise<GraphData | null> {
  try {
    const data = await readFile(GRAPH_PATH, 'utf-8')
    return JSON.parse(data) as GraphData
  } catch {
    return null
  }
}

function searchNodes(nodes: GraphNode[], query: string): GraphNode[] {
  const lowerQuery = query.toLowerCase()
  return nodes.filter(
    (node) =>
      node.label.toLowerCase().includes(lowerQuery) ||
      node.filePath?.toLowerCase().includes(lowerQuery) ||
      node.type.toLowerCase().includes(lowerQuery)
  )
}

function getConnectedEdges(edges: GraphEdge[], nodeIds: Set<string>): GraphEdge[] {
  return edges.filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target))
}

function getRelatedNodes(
  nodes: GraphNode[],
  edges: GraphEdge[],
  nodeIds: Set<string>
): GraphNode[] {
  const relatedIds = new Set<string>()
  for (const edge of edges) {
    if (nodeIds.has(edge.source)) relatedIds.add(edge.target)
    if (nodeIds.has(edge.target)) relatedIds.add(edge.source)
  }
  return nodes.filter((node) => relatedIds.has(node.id) && !nodeIds.has(node.id))
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GraphQueryRequest
    const { query, limit = 50, nodeTypes, communityId } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const graph = await loadGraph()
    if (!graph) {
      return NextResponse.json(
        { nodes: [], edges: [], query, matchCount: 0 } satisfies GraphQueryResponse,
        { status: 200 }
      )
    }

    let matchingNodes = searchNodes(graph.nodes, query)

    if (nodeTypes && nodeTypes.length > 0) {
      matchingNodes = matchingNodes.filter((node) => nodeTypes.includes(node.type))
    }

    if (communityId !== undefined) {
      matchingNodes = matchingNodes.filter((node) => node.community === communityId)
    }

    matchingNodes = matchingNodes.slice(0, limit)

    const nodeIds = new Set(matchingNodes.map((node) => node.id))
    const connectedEdges = getConnectedEdges(graph.edges, nodeIds)

    return NextResponse.json({
      nodes: matchingNodes,
      edges: connectedEdges,
      query,
      matchCount: matchingNodes.length,
    } satisfies GraphQueryResponse)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export const dynamic = 'force-dynamic'
