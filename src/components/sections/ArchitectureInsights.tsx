'use client'

import { useGraph } from '@/hooks/useGraph'
import { motion } from 'framer-motion'

export function ArchitectureInsights() {
  const { graph, isLoading } = useGraph()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!graph || !graph.report) {
    return null
  }

  const { report } = graph

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          className="p-4 bg-gray-800 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Nodes</h3>
          <p className="text-2xl font-bold text-white">{report.totalNodes}</p>
        </motion.div>

        <motion.div
          className="p-4 bg-gray-800 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Edges</h3>
          <p className="text-2xl font-bold text-white">{report.totalEdges}</p>
        </motion.div>

        <motion.div
          className="p-4 bg-gray-800 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Communities</h3>
          <p className="text-2xl font-bold text-white">{report.totalCommunities}</p>
        </motion.div>
      </div>

      {report.godNodes.length > 0 && (
        <motion.div
          className="p-4 bg-gray-800 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-3">Key Concepts (God Nodes)</h3>
          <div className="space-y-2">
            {report.godNodes.slice(0, 5).map((node) => (
              <div key={node.nodeId} className="flex items-center justify-between">
                <span className="text-sm text-white">{node.label}</span>
                <span className="text-xs text-gray-400">{node.degree} connections</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {report.suggestedQuestions.length > 0 && (
        <motion.div
          className="p-4 bg-gray-800 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-3">Suggested Questions</h3>
          <div className="space-y-2">
            {report.suggestedQuestions.slice(0, 4).map((q, i) => (
              <div key={i} className="text-sm text-gray-300">
                {q.question}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>Extracted: {report.confidenceDistribution.extracted}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>Inferred: {report.confidenceDistribution.inferred}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>Ambiguous: {report.confidenceDistribution.ambiguous}</span>
        </div>
      </div>
    </div>
  )
}
