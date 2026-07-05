import useSWR from 'swr'
import { GraphData } from '@/types/graph'

const GRAPH_API_URL = '/api/graph'
const DEDUP_INTERVAL = 60 * 1000

const fetcher = async (url: string): Promise<GraphData> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch graph data')
  }
  return response.json()
}

export function useGraph() {
  const { data, error, isLoading, mutate } = useSWR<GraphData>(GRAPH_API_URL, fetcher, {
    dedupingInterval: DEDUP_INTERVAL,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })

  return {
    graph: data ?? null,
    isLoading,
    isError: error !== undefined,
    error,
    mutate,
  }
}
