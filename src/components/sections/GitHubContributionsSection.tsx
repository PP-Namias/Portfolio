'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useGitHubContributions } from '@/hooks/useGitHubContributions'
import { transformToHeatmapData } from '@/lib/github-heatmap-data'
import {
  HeatmapCells,
  HeatmapChart,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
} from '@/components/charts/heatmap'

const GITHUB_USERNAME = 'PP-Namias'
const FALLBACK_SVG = `https://ghchart.rshah.org/${GITHUB_USERNAME}`

function computeStreak(
  contributions: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[]
): { current: number; longest: number } {
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

export function GitHubContributionsSection() {
  const { data, isLoading, isError } = useGitHubContributions()

  const heatmapData = useMemo(() => transformToHeatmapData(data?.contributions ?? []), [data])
  const streak = useMemo(() => computeStreak(data?.contributions ?? []), [data])

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

      {isLoading && (
        <output className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-pink border-t-transparent" />
        </output>
      )}

      {isError && (
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

      {!isLoading && !isError && !data && (
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
                className="h-[11px] w-[11px] rounded-[2px]"
                style={{
                  backgroundColor:
                    level === 0
                      ? 'var(--chart-scale-01)'
                      : level === 1
                        ? 'var(--chart-scale-02)'
                        : level === 2
                          ? 'var(--chart-scale-03)'
                          : level === 3
                            ? 'var(--chart-scale-04)'
                            : 'var(--chart-scale-05)',
                }}
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

      {!isLoading && !isError && data && (
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
            <div className="min-w-[720px]">
              <HeatmapInteractionProvider>
                <HeatmapInteractionBoundary>
                  <HeatmapChart data={heatmapData} layout="fluid" gap={2}>
                    <HeatmapCells cornerRadius={2} interactive />
                    <HeatmapXAxis />
                    <HeatmapYAxis tickFilter="all" labelFormat="initial" />
                    <HeatmapTooltip />
                  </HeatmapChart>
                  <HeatmapLegend lessLabel="Less" moreLabel="More" cellSize={11} gap={2} />
                </HeatmapInteractionBoundary>
              </HeatmapInteractionProvider>
            </div>
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
