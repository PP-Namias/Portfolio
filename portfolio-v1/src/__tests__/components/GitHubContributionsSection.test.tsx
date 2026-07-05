import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import React from 'react'

vi.mock('framer-motion', () => {
  const R = require('react')
  const motion = new Proxy(
    {},
    {
      get: (_, tag: string) =>
        R.forwardRef(function MotionTag(
          { children, ...props }: Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) {
          return R.createElement(tag, { ref, ...props }, children)
        }),
    }
  )

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useReducedMotion: () => false,
  }
})

vi.mock('next/image', () => ({
  default: ({
    alt = '',
    src = '',
    ...props
  }: {
    alt?: string
    src?: string
    [key: string]: unknown
    // eslint-disable-next-line @next/next/no-img-element
  }) => <img alt={alt} src={src} {...props} />,
}))

const mockFetch = vi.fn()
const originalFetch = globalThis.fetch

beforeEach(() => {
  globalThis.fetch = mockFetch
  mockFetch.mockReset()
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

const mockApiData = {
  total: { '2025': 100, '2026': 200 },
  contributions: [
    { date: '2026-01-01', count: 5, level: 2 as const },
    { date: '2026-01-02', count: 0, level: 0 as const },
    { date: '2026-01-03', count: 10, level: 3 as const },
    { date: '2026-01-04', count: 2, level: 1 as const },
    { date: '2026-01-05', count: 0, level: 0 as const },
    { date: '2026-01-06', count: 0, level: 0 as const },
    { date: '2026-01-07', count: 1, level: 1 as const },
    { date: '2026-01-08', count: 0, level: 0 as const },
    { date: '2026-01-09', count: 0, level: 0 as const },
    { date: '2026-01-10', count: 0, level: 0 as const },
    { date: '2026-01-11', count: 0, level: 0 as const },
    { date: '2026-01-12', count: 3, level: 1 as const },
    { date: '2026-01-13', count: 0, level: 0 as const },
  ],
}

function renderWithSWR(ui: React.ReactElement) {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{ui}</SWRConfig>
  )
}

describe('GitHubContributionsSection', () => {
  it('renders the heading immediately', async () => {
    mockFetch.mockReturnValue(new Promise(() => {}))

    const { GitHubContributionsSection } =
      await import('@/components/sections/GitHubContributionsSection')
    renderWithSWR(<GitHubContributionsSection />)

    expect(screen.getByText('GitHub Contributions')).toBeInTheDocument()
    expect(screen.getByText('My open source activity over the past year')).toBeInTheDocument()
  })

  it('shows loading spinner while fetching', async () => {
    mockFetch.mockReturnValue(new Promise(() => {}))

    const { GitHubContributionsSection } =
      await import('@/components/sections/GitHubContributionsSection')
    renderWithSWR(<GitHubContributionsSection />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders heatmap and stats when API succeeds', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiData),
    })

    const { GitHubContributionsSection } =
      await import('@/components/sections/GitHubContributionsSection')
    renderWithSWR(<GitHubContributionsSection />)

    await waitFor(() => {
      expect(screen.getByText('300')).toBeInTheDocument()
    })

    expect(screen.getByText('contributions in the last year')).toBeInTheDocument()
    expect(screen.getByText('day current streak')).toBeInTheDocument()
    expect(screen.getByText('day longest streak')).toBeInTheDocument()
    expect(screen.getByText('Less')).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('shows error state when API fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    })

    const { GitHubContributionsSection } =
      await import('@/components/sections/GitHubContributionsSection')
    renderWithSWR(<GitHubContributionsSection />)

    await waitFor(() => {
      expect(screen.getByText('Unable to load contribution data.')).toBeInTheDocument()
    })
  })

  it('shows error state when network error occurs', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const { GitHubContributionsSection } =
      await import('@/components/sections/GitHubContributionsSection')
    renderWithSWR(<GitHubContributionsSection />)

    await waitFor(() => {
      expect(screen.getByText('Unable to load contribution data.')).toBeInTheDocument()
    })
  })

  it('links to GitHub profile', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiData),
    })

    const { GitHubContributionsSection } =
      await import('@/components/sections/GitHubContributionsSection')
    renderWithSWR(<GitHubContributionsSection />)

    await waitFor(() => {
      const links = screen.getAllByRole('link')
      const githubLinks = links.filter(
        (l) => l.getAttribute('href') === 'https://github.com/PP-Namias'
      )
      expect(githubLinks.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('sums yearly total object correctly', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          total: { '2024': 50, '2025': 150, '2026': 100 },
          contributions: mockApiData.contributions,
        }),
    })

    const { GitHubContributionsSection } =
      await import('@/components/sections/GitHubContributionsSection')
    renderWithSWR(<GitHubContributionsSection />)

    await waitFor(() => {
      expect(screen.getByText('300')).toBeInTheDocument()
    })
  })
})
