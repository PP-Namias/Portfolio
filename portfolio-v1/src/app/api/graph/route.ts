import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { GraphData } from '@/types/graph'

const GRAPH_PATH = join(process.cwd(), 'graphify-out', 'graph.json')
const CACHE_TTL = 300 * 1000

let cachedGraph: GraphData | null = null
let cacheTimestamp = 0

async function loadGraph(): Promise<GraphData | null> {
  const now = Date.now()
  if (cachedGraph && now - cacheTimestamp < CACHE_TTL) {
    return cachedGraph
  }

  try {
    const data = await readFile(GRAPH_PATH, 'utf-8')
    const graph = JSON.parse(data) as GraphData
    cachedGraph = graph
    cacheTimestamp = now
    return graph
  } catch {
    return null
  }
}

export async function GET() {
  const graph = await loadGraph()

  if (!graph) {
    return NextResponse.json(
      {
        nodes: [],
        edges: [],
        communities: [],
        report: {
          godNodes: [],
          surprisingConnections: [],
          suggestedQuestions: [],
          confidenceDistribution: { extracted: 0, inferred: 0, ambiguous: 0 },
          totalNodes: 0,
          totalEdges: 0,
          totalCommunities: 0,
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '0.0.0',
          corpus: 'empty',
        },
      } satisfies GraphData,
      { status: 200 }
    )
  }

  return NextResponse.json(graph)
}

export const dynamic = 'force-dynamic'
