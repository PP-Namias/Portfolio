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
      className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2
            id="github-contributions-heading"
            className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark"
          >
            GitHub Contributions
          </h2>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
            Activity over the past year
          </p>
        </div>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark transition-colors hover:text-accent-pink"
        >
          @{GITHUB_USERNAME}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {isLoading && (
        <output className="flex items-center justify-center py-16">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-text-muted-light dark:border-text-muted-dark border-t-transparent" />
        </output>
      )}

      {isError && (
        <div className="py-12 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
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
        <div className="space-y-3">
          <div className="overflow-x-auto">
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
          <div className="flex items-center justify-end gap-1 text-[10px] text-text-muted-light dark:text-text-muted-dark">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="h-[10px] w-[10px] rounded-[2px]"
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
        </div>
      )}

      {!isLoading && !isError && data && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-baseline gap-1.5 rounded-md bg-surface-light dark:bg-surface-dark px-3 py-1.5">
              <span className="font-semibold text-text-primary-light dark:text-text-primary-dark tabular-nums">
                {data.total.toLocaleString()}
              </span>
              <span className="text-text-muted-light dark:text-text-muted-dark">contributions</span>
            </div>
            <div className="flex items-baseline gap-1.5 rounded-md bg-surface-light dark:bg-surface-dark px-3 py-1.5">
              <span className="font-semibold text-emerald-500 tabular-nums">{streak.current}</span>
              <span className="text-text-muted-light dark:text-text-muted-dark">
                current streak
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 rounded-md bg-surface-light dark:bg-surface-dark px-3 py-1.5">
              <span className="font-semibold text-emerald-500 tabular-nums">{streak.longest}</span>
              <span className="text-text-muted-light dark:text-text-muted-dark">
                longest streak
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <HeatmapInteractionProvider>
                <HeatmapInteractionBoundary>
                  <HeatmapChart data={heatmapData} layout="fluid" gap={2}>
                    <HeatmapCells cornerRadius={2} interactive />
                    <HeatmapXAxis />
                    <HeatmapYAxis tickFilter="all" labelFormat="initial" />
                    <HeatmapTooltip />
                  </HeatmapChart>
                  <div className="flex justify-end">
                    <HeatmapLegend lessLabel="Less" moreLabel="More" cellSize={10} gap={2} />
                  </div>
                </HeatmapInteractionBoundary>
              </HeatmapInteractionProvider>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  )
}
