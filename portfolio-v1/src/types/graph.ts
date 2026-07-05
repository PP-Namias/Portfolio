export interface GraphNode {
  id: string
  label: string
  type: 'file' | 'function' | 'class' | 'interface' | 'type' | 'variable' | 'module' | 'concept'
  community?: number
  communityName?: string
  filePath?: string
  line?: number
  column?: number
  confidence: 'EXTRACTED' | 'INFERRED' | 'AMBIGUOUS'
  metadata?: Record<string, unknown>
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: 'imports' | 'calls' | 'extends' | 'implements' | 'uses' | 'references' | 'contains'
  confidence: 'EXTRACTED' | 'INFERRED' | 'AMBIGUOUS'
  weight?: number
  metadata?: Record<string, unknown>
}

export interface GraphCommunity {
  id: number
  name: string
  nodeCount: number
  description?: string
}

export interface GraphGodNode {
  nodeId: string
  label: string
  degree: number
  type: GraphNode['type']
}

export interface GraphSurprisingConnection {
  source: string
  target: string
  sourceModule: string
  targetModule: string
  unexpectedness: number
  description?: string
}

export interface GraphSuggestedQuestion {
  question: string
  nodes: string[]
  description?: string
}

export interface GraphReport {
  godNodes: GraphGodNode[]
  surprisingConnections: GraphSurprisingConnection[]
  suggestedQuestions: GraphSuggestedQuestion[]
  confidenceDistribution: {
    extracted: number
    inferred: number
    ambiguous: number
  }
  totalNodes: number
  totalEdges: number
  totalCommunities: number
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  communities: GraphCommunity[]
  report: GraphReport
  metadata: {
    generatedAt: string
    version: string
    corpus: string
  }
}

export interface GraphQueryRequest {
  query: string
  limit?: number
  nodeTypes?: GraphNode['type'][]
  communityId?: number
}

export interface GraphQueryResponse {
  nodes: GraphNode[]
  edges: GraphEdge[]
  query: string
  matchCount: number
}

export interface GraphNodeDetail {
  node: GraphNode
  incomingEdges: GraphEdge[]
  outgoingEdges: GraphEdge[]
  relatedNodes: GraphNode[]
}
