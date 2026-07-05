'use client'

import React, { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useCmsContent } from '@/hooks/useCmsContent'
import { Project } from '@/types'

const RECENT_LIMIT = 4

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

export function ProjectsSectionRevamped() {
  const { projects } = useCmsContent()
  const reduceMotion = useReducedMotion()

  const recentProjects = useMemo(
    () => sortProjectsByTier(projects).slice(0, RECENT_LIMIT),
    [projects]
  )

  return (
    <motion.section
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Header */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            Recent Projects
          </h2>
        </div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted-light transition-colors hover:text-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 dark:text-text-muted-dark"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2x2 grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {recentProjects.map((project, index) => (
          <RecentCard
            key={project.githubRepo || project.slug || project.title}
            project={project}
            index={index}
            reduceMotion={Boolean(reduceMotion)}
          />
        ))}
      </div>

      {recentProjects.length === 0 && (
        <p className="py-8 text-center text-xs text-text-muted-light dark:text-text-muted-dark">
          No projects yet.
        </p>
      )}
    </motion.section>
  )
}

interface RecentCardProps {
  project: Project
  index: number
  reduceMotion: boolean
}

function RecentCard({ project, index, reduceMotion }: Readonly<RecentCardProps>) {
  const detailHref = project.liveURL || project.repositoryURL || null
  const hasLink = Boolean(detailHref)

  const cardTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        delay: index * 0.05,
      }

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={cardTransition}
      className="group/card relative rounded-xl border border-border-light bg-white p-4 transition-[border-color,box-shadow] duration-300 hover:border-accent-pink/50 hover:shadow-[0_18px_40px_-22px_rgba(236,72,153,0.55)] dark:border-border-dark dark:bg-card-bg-dark"
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

      <h3 className="pr-6 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
        {project.title}
      </h3>

      <p className="mt-1.5 line-clamp-1 text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
        {project.shortDescription || project.description}
      </p>
    </motion.article>
  )
}
