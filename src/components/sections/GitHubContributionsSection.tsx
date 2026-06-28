'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const GITHUB_USERNAME = 'PP-Namias'
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`
const FALLBACK_SVG = `https://ghchart.rshah.org/${GITHUB_USERNAME}`

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

const LEVEL_COLORS = [
  'bg-surface-light dark:bg-surface-dark',
  'bg-emerald-200 dark:bg-emerald-900',
  'bg-emerald-400 dark:bg-emerald-700',
  'bg-emerald-500 dark:bg-emerald-500',
  'bg-emerald-700 dark:bg-emerald-300',
]

function getLevelColor(level: number): string {
  return LEVEL_COLORS[Math.min(level, 4)] || LEVEL_COLORS[0]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

function getWeeksFromContributions(contributions: ContributionDay[]): ContributionDay[][] {
  if (contributions.length === 0) return []

  const weeks: ContributionDay[][] = []
  let currentWeek: ContributionDay[] = []

  const firstDate = new Date(contributions[0].date + 'T00:00:00')
  const firstDayOfWeek = firstDate.getDay()

  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: '', count: 0, level: 0 })
  }

  for (const day of contributions) {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: 0, level: 0 })
    }
    weeks.push(currentWeek)
  }

  return weeks
}

function computeStreak(contributions: ContributionDay[]): { current: number; longest: number } {
  let current = 0
  let longest = 0
  let tempStreak = 0

  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i].count > 0) {
      tempStreak++
      if (i === contributions.length - 1 || current > 0) {
        current = tempStreak
      }
    } else {
      longest = Math.max(longest, tempStreak)
      if (i < contributions.length - 1) break
      tempStreak = 0
    }
  }

  longest = Math.max(longest, tempStreak)
  return { current, longest }
}

type FetchState = 'loading' | 'api' | 'fallback' | 'error'

export function GitHubContributionsSection() {
  const [state, setState] = useState<FetchState>('loading')
  const [data, setData] = useState<ContributionData | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const res = await fetch(CONTRIBUTIONS_API, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: ApiResponseBody = await res.json()
        const normalized = normalizeResponse(json)
        if (normalized.contributions.length === 0) throw new Error('Empty data')
        setData(normalized)
        setState('api')
      } catch {
        if (controller.signal.aborted) return
        setState('fallback')
      }
    }

    load()
    return () => controller.abort()
  }, [])

  const weeks = useMemo(() => getWeeksFromContributions(data?.contributions ?? []), [data])
  const streak = useMemo(() => computeStreak(data?.contributions ?? []), [data])

  const monthLabels = useMemo(() => {
    if (weeks.length === 0) return []
    const labels: { label: string; index: number }[] = []
    let lastMonth = -1

    for (let i = 0; i < weeks.length; i++) {
      const firstDayOfWeek = weeks[i].find((d) => d.date)
      if (firstDayOfWeek) {
        const month = new Date(firstDayOfWeek.date + 'T00:00:00').getMonth()
        if (month !== lastMonth) {
          labels.push({
            label: new Date(firstDayOfWeek.date + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short',
            }),
            index: i,
          })
          lastMonth = month
        }
      }
    }
    return labels
  }, [weeks])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      aria-labelledby="github-contributions-heading"
    >
      <div className="mb-4">
        <h2
          id="github-contributions-heading"
          className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark"
        >
          GitHub Contributions
        </h2>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
          My open source activity over the past year
        </p>
      </div>

      {state === 'loading' && (
        <div className="flex items-center justify-center py-12" role="status">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-pink border-t-transparent" />
        </div>
      )}

      {state === 'error' && (
        <div className="py-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
          <p>Unable to load contribution data.</p>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-accent-pink hover:underline"
          >
            View profile on GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {state === 'fallback' && (
        <div className="space-y-4">
          <div className="overflow-x-auto pb-2">
            <Image
              src={FALLBACK_SVG}
              alt={`${GITHUB_USERNAME}'s GitHub contribution chart`}
              width={720}
              height={105}
              unoptimized
              className="h-[105px] min-w-[720px] w-auto"
              loading="lazy"
            />
          </div>
          <div className="flex items-center gap-1 text-[10px] text-text-muted-light dark:text-text-muted-dark">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-[11px] w-[11px] rounded-[2px] ${getLevelColor(level)}`}
              />
            ))}
            <span>More</span>
          </div>
          <div className="pt-2">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent-pink hover:underline"
            >
              View full profile on GitHub
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}

      {state === 'api' && data && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="rounded-lg bg-surface-light dark:bg-surface-dark px-3 py-2">
              <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                {data.total.toLocaleString()}
              </span>{' '}
              <span className="text-text-secondary-light dark:text-text-secondary-dark">
                contributions in the last year
              </span>
            </div>
            <div className="rounded-lg bg-surface-light dark:bg-surface-dark px-3 py-2">
              <span className="font-semibold text-emerald-500">{streak.current}</span>{' '}
              <span className="text-text-secondary-light dark:text-text-secondary-dark">
                day current streak
              </span>
            </div>
            <div className="rounded-lg bg-surface-light dark:bg-surface-dark px-3 py-2">
              <span className="font-semibold text-emerald-500">{streak.longest}</span>{' '}
              <span className="text-text-secondary-light dark:text-text-secondary-dark">
                day longest streak
              </span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="inline-flex flex-col gap-0.5 min-w-[720px]">
              <div className="flex gap-0.5 ml-10">
                {monthLabels.map((m, i) => (
                  <div
                    key={`${m.label}-${i}`}
                    className="text-[10px] text-text-muted-light dark:text-text-muted-dark"
                    style={{ marginLeft: i === 0 ? m.index * 14 : 14, width: 0 }}
                  >
                    {m.label}
                  </div>
                ))}
              </div>

              <div className="flex gap-0.5">
                <div className="flex flex-col justify-between text-[10px] text-text-muted-light dark:text-text-muted-dark pr-1 py-0.5">
                  <span>&nbsp;</span>
                  <span>Mon</span>
                  <span>&nbsp;</span>
                  <span>Wed</span>
                  <span>&nbsp;</span>
                  <span>Fri</span>
                  <span>&nbsp;</span>
                </div>

                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.map((day, di) => (
                      <div
                        key={`${wi}-${di}`}
                        className={`h-[11px] w-[11px] rounded-[2px] ${getLevelColor(day.level)} ${
                          day.date ? 'cursor-default' : ''
                        }`}
                        title={
                          day.date
                            ? `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDate(day.date)}`
                            : ''
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-text-muted-light dark:text-text-muted-dark">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-[11px] w-[11px] rounded-[2px] ${getLevelColor(level)}`}
              />
            ))}
            <span>More</span>
          </div>

          <div className="pt-2">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent-pink hover:underline"
            >
              View full profile on GitHub
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </motion.section>
  )
}
