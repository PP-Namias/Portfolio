import { Metadata } from 'next'
import { IS_GRAPHIFY_ENABLED } from '@/lib/features'
import { ExplorerPage } from '@/components/sections/ExplorerPage'

export const metadata: Metadata = {
  title: 'Codebase Explorer | PP Namias',
  description: 'Interactive knowledge graph visualization of the portfolio codebase',
  openGraph: {
    title: 'Codebase Explorer | PP Namias',
    description: 'Interactive knowledge graph visualization of the portfolio codebase',
    type: 'website',
  },
}

export default function Explorer() {
  if (!IS_GRAPHIFY_ENABLED) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Explorer Coming Soon</h1>
          <p className="text-gray-400">This feature is currently under development.</p>
        </div>
      </div>
    )
  }

  return <ExplorerPage />
}
