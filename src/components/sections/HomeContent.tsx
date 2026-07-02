'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { TechStackSection } from '@/components/sections/TechStackSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ProjectsSectionRevamped } from '@/components/sections/ProjectsSectionRevamped'
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import { ConnectSection } from '@/components/sections/ConnectSection'
import dynamic from 'next/dynamic'

const GallerySection = dynamic(() => import('./GallerySection').then((mod) => mod.GallerySection))
const BlogSection = dynamic(() => import('./BlogSection').then((mod) => mod.BlogSection))
const CertificationsSection = dynamic(() =>
  import('./CertificationsSection').then((mod) => mod.CertificationsSection)
)
const GitHubContributionsSection = dynamic(() =>
  import('./GitHubContributionsSection').then((mod) => mod.GitHubContributionsSection)
)
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { SectionErrorBoundary } from '@/components/ui/ErrorBoundary'
import { IS_GITHUB_CHART_VISIBLE, IS_PROJECTS_REVAMP_ENABLED } from '@/lib/features'

type StickySide = 'left' | 'right' | null

export function HomeContent() {
  const leftColumnRef = useRef<HTMLDivElement | null>(null)
  const rightColumnRef = useRef<HTMLDivElement | null>(null)
  const [stickySide, setStickySide] = useState<StickySide>('right')

  useEffect(() => {
    const updateStickySide = () => {
      if (window.innerWidth < 1024) {
        setStickySide(null)
        return
      }

      const leftHeight = leftColumnRef.current?.getBoundingClientRect().height ?? 0
      const rightHeight = rightColumnRef.current?.getBoundingClientRect().height ?? 0

      if (!leftHeight || !rightHeight) {
        return
      }

      const equalHeightThreshold = 24
      if (Math.abs(leftHeight - rightHeight) <= equalHeightThreshold) {
        setStickySide(null)
        return
      }

      setStickySide(leftHeight < rightHeight ? 'left' : 'right')
    }

    updateStickySide()

    const observer = new ResizeObserver(() => {
      updateStickySide()
    })

    if (leftColumnRef.current) {
      observer.observe(leftColumnRef.current)
    }

    if (rightColumnRef.current) {
      observer.observe(rightColumnRef.current)
    }

    window.addEventListener('resize', updateStickySide)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateStickySide)
    }
  }, [])

  const leftColumnClass = useMemo(
    () =>
      [
        'order-1 lg:order-none lg:col-start-1 lg:self-start',
        stickySide === 'left' ? 'lg:sticky lg:top-4' : '',
      ]
        .filter(Boolean)
        .join(' '),
    [stickySide]
  )

  const rightColumnClass = useMemo(
    () =>
      [
        'order-2 lg:order-none lg:col-start-2 lg:self-start',
        stickySide === 'right' ? 'lg:sticky lg:top-4' : '',
      ]
        .filter(Boolean)
        .join(' '),
    [stickySide]
  )

  return (
    <main id="main-content" className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12">
      <header>
        <Card className="mb-4">
          <HeroSection />
        </Card>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[62%_1fr] lg:items-start gap-4 mt-4">
        <div className={leftColumnClass}>
          <div ref={leftColumnRef} className="space-y-4">
            <Card>
              <AboutSection />
            </Card>
            <Card>
              <TechStackSection />
            </Card>
            <Card id="projects">
              {IS_PROJECTS_REVAMP_ENABLED ? <ProjectsSectionRevamped /> : <ProjectsSection />}
            </Card>
          </div>
        </div>
        <div className={rightColumnClass}>
          <div ref={rightColumnRef} className="space-y-4">
            <Card>
              <ExperienceTimeline />
            </Card>
            <Card>
              <ConnectSection />
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <Card>
          <SectionErrorBoundary name="BlogSection">
            <BlogSection />
          </SectionErrorBoundary>
        </Card>
        <Card>
          <SectionErrorBoundary name="CertificationsSection">
            <CertificationsSection />
          </SectionErrorBoundary>
        </Card>
      </div>

      {IS_GITHUB_CHART_VISIBLE && (
        <Card className="mt-4">
          <SectionErrorBoundary name="GitHubContributionsSection">
            <GitHubContributionsSection />
          </SectionErrorBoundary>
        </Card>
      )}

      <Card className="mt-4">
        <SectionErrorBoundary name="GallerySection">
          <GallerySection />
        </SectionErrorBoundary>
      </Card>

      <Footer />
    </main>
  )
}
