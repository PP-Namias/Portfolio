import useSWR from 'swr'

const GITHUB_USERNAME = 'PP-Namias'
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ApiResponseBody {
  total?: Record<string, number> | number
  contributions?: ContributionDay[]
}

interface ContributionData {
  total: number
  contributions: ContributionDay[]
}

function sumTotal(total: ApiResponseBody['total']): number {
  if (typeof total === 'number') return total
  if (total && typeof total === 'object') {
    return Object.values(total).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0)
  }
  return 0
}

function normalizeResponse(json: ApiResponseBody): ContributionData {
  return {
    total: sumTotal(json.total),
    contributions: Array.isArray(json.contributions) ? json.contributions : [],
  }
}

async function fetchContributions(): Promise<ContributionData> {
  const res = await fetch(CONTRIBUTIONS_API)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: ApiResponseBody = await res.json()
  const normalized = normalizeResponse(json)
  if (normalized.contributions.length === 0) throw new Error('Empty data')
  return normalized
}

export function useGitHubContributions() {
  const { data, error, isLoading } = useSWR<ContributionData>(
    'github-contributions',
    fetchContributions,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  )

  return {
    data: data ?? null,
    isLoading,
    isError: !!error,
  }
}
