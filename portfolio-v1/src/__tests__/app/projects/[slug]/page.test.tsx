import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

vi.mock('framer-motion', async () => {
  const R = await import('react')
  return {
    motion: new Proxy(
      {},
      {
        get: (_: unknown, tag: string) =>
          R.forwardRef(function MotionTag(
            { children, ...props }: Record<string, unknown>,
            ref: React.Ref<HTMLElement>
          ) {
            return R.createElement(tag as string, { ref, ...props }, children)
          }),
      }
    ),
    useReducedMotion: () => false,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  }
})

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('@/lib/media', () => ({
  resolveContentImageSrc: (src: string) => src,
}))

vi.mock('@/lib/features', () => ({
  IS_PROJECTS_REVAMP_ENABLED: true,
}))

vi.mock('@/lib/cms-content.server', () => ({
  getProjectBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === 'valid-project') {
      return Promise.resolve({
        title: 'Valid Project',
        slug: 'valid-project',
        description: 'A valid project',
        shortDescription: 'Valid',
        image: '/images/valid.jpg',
        imageAlt: 'Valid project image',
        tags: ['React', 'TypeScript'],
        year: 2025,
        category: 'Web App',
        role: 'Developer',
        status: 'completed',
        tier: 'featured',
        showcaseDetail: true,
        highlights: ['First highlight'],
        liveURL: 'https://example.com',
        repositoryURL: 'https://github.com/test/repo',
      })
    }
    if (slug === 'no-showcase') {
      return Promise.resolve({
        title: 'No Showcase',
        slug: 'no-showcase',
        description: 'Not showcased',
        shortDescription: 'Basic',
        image: '',
        tags: [],
        year: 2024,
        status: 'completed',
        tier: 'standard',
        showcaseDetail: false,
      })
    }
    return Promise.resolve(null)
  }),
  getProjectSlugsForStaticParams: vi.fn().mockResolvedValue([{ slug: 'valid-project' }]),
}))

import ProjectPage, { generateMetadata, generateStaticParams } from '@/app/projects/[slug]/page'
import { notFound } from 'next/navigation'

const mockedNotFound = vi.mocked(notFound)

describe('ProjectPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders ProjectDetailPage with project data', async () => {
    const element = await ProjectPage({ params: Promise.resolve({ slug: 'valid-project' }) })
    render(element)
    expect(screen.getByText('Valid Project')).toBeDefined()
    expect(screen.getByText('First highlight')).toBeDefined()
  })

  it('generateStaticParams returns slugs', async () => {
    const params = await generateStaticParams()
    expect(params).toEqual([{ slug: 'valid-project' }])
  })

  it('generateMetadata returns correct title for existing slug', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'valid-project' }) })
    expect(meta.title).toContain('Valid Project')
  })

  it('generateMetadata returns fallback for missing slug', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'nonexistent' }) })
    expect(meta.title).toBe('Project Not Found | Jhon Keneth Ryan Namias')
  })
})
