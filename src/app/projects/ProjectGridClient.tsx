'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Project } from '@/types'

type TabId = 'all' | 'live' | 'showcase'

const TABS: { id: TabId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live Projects' },
  { id: 'showcase', label: 'Showcase' },
]

function sortProjectsByTier(entries: Project[]): Project[] {
  const tierOrder = { featured: 0, standard: 1, archived: 2 }
  return [...entries].sort((a, b) => {
    const aRank = tierOrder[a.tier ?? 'standard'] ?? 1
    const bRank = tierOrder[b.tier ?? 'standard'] ?? 1
    if (aRank !== bRank) return aRank - bRank
    const aFeatured = a.featuredRank ?? Number.MAX_SAFE_INTEGER
    const bFeatured = b.featuredRank ?? Number.MAX_SAFE_INTEGER
    if (aFeatured !== bFeatured) return aFeatured - bFeatured
    return b.year - a.year
  })
}

interface ProjectGridClientProps {
  projects: Project[]
}

export function ProjectGridClient({ projects }: Readonly<ProjectGridClientProps>) {
  const reduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState<TabId>('all')

  const liveProjects = useMemo(
    () => sortProjectsByTier(projects.filter((p) => Boolean(p.liveURL))),
    [projects]
  )

  const showcaseProjects = useMemo(
    () => sortProjectsByTier(projects.filter((p) => p.showcaseDetail === true && !p.liveURL)),
    [projects]
  )

  const allProjects = useMemo(() => sortProjectsByTier(projects), [projects])

  const activeProjects = useMemo(() => {
    switch (activeTab) {
      case 'live':
        return liveProjects
      case 'showcase':
        return showcaseProjects
      default:
        return allProjects
    }
  }, [activeTab, liveProjects, showcaseProjects, allProjects])

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = TABS.findIndex((t) => t.id === activeTab)
      let nextIndex = currentIndex

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        nextIndex = (currentIndex + 1) % TABS.length
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length
      } else if (e.key === 'Home') {
        e.preventDefault()
        nextIndex = 0
      } else if (e.key === 'End') {
        e.preventDefault()
        nextIndex = TABS.length - 1
      }

      if (nextIndex !== currentIndex) {
        setActiveTab(TABS[nextIndex].id)
      }
    },
    [activeTab]
  )

  return (
    <div>
      {/* Back link + heading */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted-light transition-colors hover:text-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 dark:text-text-muted-dark"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <p
          className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark"
          aria-label="All Projects"
        >
          All Projects
        </p>
      </div>

      {/* Tab bar */}
      <div
        role="tablist"
        tabIndex={0}
        aria-label="Project categories"
        className="relative mb-6 flex gap-1 rounded-lg border border-border-light bg-surface-light p-1 dark:border-border-dark dark:bg-surface-dark"
        onKeyDown={handleTabKeyDown}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-listing-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`relative z-10 flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-text-primary-light dark:text-text-primary-dark'
                : 'text-text-muted-light hover:text-text-secondary-light dark:text-text-muted-dark dark:hover:text-text-secondary-dark'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="listing-tab-indicator"
                className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-card-bg-dark"
                transition={
                  reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 35 }
                }
              />
            )}
            <span className="relative z-10">
              {tab.label}
              <span className="ml-1.5 text-[11px] text-text-muted-light dark:text-text-muted-dark">
                (
                {tab.id === 'all'
                  ? allProjects.length
                  : tab.id === 'live'
                    ? liveProjects.length
                    : showcaseProjects.length}
                )
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div
        id={`tabpanel-listing-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-listing-${activeTab}`}
      >
        <div key={activeTab} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {activeProjects.map((project, index) => (
            <ListingCard
              key={project.githubRepo || project.slug || project.title}
              project={project}
              index={index}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </div>

        {activeProjects.length === 0 && (
          <p className="py-8 text-center text-xs text-text-muted-light dark:text-text-muted-dark">
            {activeTab === 'live'
              ? 'No live projects yet.'
              : activeTab === 'showcase'
                ? 'No showcase projects yet.'
                : 'No projects yet.'}
          </p>
        )}
      </div>
    </div>
  )
}

interface ListingCardProps {
  project: Project
  index: number
  reduceMotion: boolean
}

function ListingCard({ project, index, reduceMotion }: Readonly<ListingCardProps>) {
  const detailHref = project.liveURL || project.repositoryURL || null
  const hasLink = Boolean(detailHref)
  const displayUrl = project.liveURL || project.repositoryURL || ''

  const cardTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        delay: index * 0.04,
      }

  const hostname = displayUrl ? new URL(displayUrl).hostname : ''

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={cardTransition}
      className="group/card relative rounded-xl border border-border-light bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-accent-pink/50 hover:shadow-[0_18px_40px_-22px_rgba(236,72,153,0.55)] dark:border-border-dark dark:bg-card-bg-dark"
    >
      {hasLink && (
        <a
          href={detailHref!}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-30 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/60"
          aria-label={`Open ${project.title}`}
        >
          <span className="sr-only">Open {project.title}</span>
        </a>
      )}

      <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
        {project.title}
      </h2>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
        {project.shortDescription || project.description}
      </p>

      {hostname && (
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-surface-light px-3 py-1.5 text-xs font-medium text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark">
          <span className="truncate max-w-[200px]">{hostname}</span>
        </div>
      )}

      {project.showcaseDetail && !project.liveURL && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-accent-pink">
          <span>View case study</span>
          <span aria-hidden>→</span>
        </div>
      )}
    </motion.article>
  )
}
