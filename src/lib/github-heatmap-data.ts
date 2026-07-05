import type { HeatmapBin, HeatmapColumn } from '@/components/charts/heatmap/heatmap-context'
import { getHeatmapContributionLevel } from '@/components/charts/heatmap/heatmap-utils'

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export function transformToHeatmapData(contributions: ContributionDay[]): HeatmapColumn[] {
  if (contributions.length === 0) return []

  const columns: HeatmapColumn[] = []
  let currentBins: HeatmapBin[] = []
  let weekIndex = 0

  const firstDate = new Date(contributions[0].date + 'T00:00:00')
  const firstDayOfWeek = firstDate.getDay()

  for (let i = 0; i < firstDayOfWeek; i++) {
    currentBins.push({ bin: i, count: 0, date: new Date(0) })
  }

  for (const day of contributions) {
    const date = new Date(day.date + 'T00:00:00')
    const dayOfWeek = date.getDay()
    currentBins.push({ bin: dayOfWeek, count: day.count, date })

    if (currentBins.length === 7) {
      columns.push({ bin: weekIndex, bins: currentBins })
      currentBins = []
      weekIndex++
    }
  }

  if (currentBins.length > 0) {
    while (currentBins.length < 7) {
      currentBins.push({ bin: currentBins.length, count: 0, date: new Date(0) })
    }
    columns.push({ bin: weekIndex, bins: currentBins })
  }

  return columns
}
