import { useState, useCallback, useRef } from 'react'
import useSWR from 'swr'
import { GraphQueryRequest, GraphQueryResponse } from '@/types/graph'

const GRAPH_QUERY_URL = '/api/graph/query'
const DEBOUNCE_MS = 300
const DEDUP_INTERVAL = 30 * 1000

const fetcher = async (url: string, options?: RequestInit): Promise<GraphQueryResponse> => {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error('Failed to query graph')
  }
  return response.json()
}

export function useGraphQuery() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data, error, isLoading, mutate } = useSWR<GraphQueryResponse>(
    debouncedQuery ? [GRAPH_QUERY_URL, { query: debouncedQuery }] : null,
    ([url, body]: [string, GraphQueryRequest]) =>
      fetcher(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    {
      dedupingInterval: DEDUP_INTERVAL,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(newQuery)
    }, DEBOUNCE_MS)
  }, [])

  const clearQuery = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
  }, [])

  return {
    query,
    updateQuery,
    clearQuery,
    results: data ?? null,
    isLoading,
    isError: error !== undefined,
    error,
    mutate,
  }
}
