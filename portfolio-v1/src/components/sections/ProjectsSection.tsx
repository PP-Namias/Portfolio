'use client'

import React, { useMemo, useState } from 'react'
import Image from '@/components/ui/OptimizedImage'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useCmsContent } from '@/hooks/useCmsContent'
import { Project } from '@/types'
import { resolveContentImageSrc } from '@/lib/media'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'

const INITIAL_VISIBLE_PROJECTS = 4

function sortProjectsForShowcase(entries: Project[]): Project[] {
  return [...entries].sort((a, b) => {
    const aRank = a.featuredRank ?? Number.MAX_SAFE_INTEGER
    const bRank = b.featuredRank ?? Number.MAX_SAFE_INTEGER

    if (aRank !== bRank) {
      return aRank - bRank
    }

    return b.year - a.year
  })
}

function resolveProjectTarget(project: Project): string | null {
  return project.detailURL || project.liveURL || project.repositoryURL || null
}

function getProjectPreviewSrc(image: string, label?: string): string {
  return resolveContentImageSrc(image, { folder: 'projects', label })
}

interface ProjectShowcaseCardProps {
  project: Project
  index: number
  reduceMotion: boolean
  showAll: boolean
}

function ProjectShowcaseCard({
  project,
  index,
  reduceMotion,
  showAll,
}: Readonly<ProjectShowcaseCardProps>) {
  const target = resolveProjectTarget(project)
  const previewSrc = getProjectPreviewSrc(project.image, project.slug || project.title)
  const hasImagePreview = Boolean(previewSrc)
  const isPriority = index === 0 && !showAll
  const hasLink = Boolean(target)

  const cardTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        delay: index * 0.05,
      }

  return (
    <motion.article
      key={project.githubRepo || project.slug || project.title}
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={cardTransition}
      className="group/card relative"
    >
      <CardContainer containerClassName="py-0" className="w-full">
        <CardBody
          className={`group/card relative w-full overflow-hidden rounded-xl border border-border-light bg-white p-0 transition-[border-color,box-shadow] duration-300 hover:border-accent-pink/50 hover:shadow-[0_18px_40px_-22px_rgba(236,72,153,0.55)] dark:border-border-dark dark:bg-card-bg-dark ${
            hasLink ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          {hasLink && (
            <a
              href={target!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open project link for ${project.title}`}
              className="absolute inset-0 z-30 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/60"
            >
              <span className="sr-only">Open project link for {project.title}</span>
            </a>
          )}

          <CardItem translateZ="40" className="w-full">
            <div className="relative h-44 overflow-hidden border-b border-border-light dark:border-border-dark sm:h-48">
              {hasImagePreview ? (
                <Image
                  src={previewSrc}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  priority={isPriority}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-110 group-focus-within/card:scale-110 motion-reduce:transform-none"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-light text-xs text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark">
                  No preview media available
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

              <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                {project.category || 'Project'}
              </div>

              <div className="absolute right-3 top-3 rounded-full border border-accent-pink/40 bg-black/45 px-2 py-0.5 text-[11px] font-medium text-accent-pink backdrop-blur-sm">
                {target ? 'Open' : 'Preview'}
              </div>
            </div>
          </CardItem>

          <div className="relative p-4">
            <CardItem translateZ="60" className="w-full pr-8">
              <h3 className="text-sm font-semibold leading-snug text-text-primary-light dark:text-text-primary-dark">
                {project.title}
              </h3>
            </CardItem>

            <CardItem
              translateZ="30"
              className="mt-1 flex w-fit flex-wrap items-center gap-1.5 text-[11px] text-text-muted-light dark:text-text-muted-dark"
            >
              <span>{project.year}</span>
              {project.role && (
                <>
                  <span aria-hidden>•</span>
                  <span>{project.role}</span>
                </>
              )}
            </CardItem>

            <CardItem
              translateZ="20"
              as="p"
              className="mt-2 line-clamp-2 w-full text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark"
            >
              {project.description}
            </CardItem>

            <CardItem translateZ="50" className="mt-3 flex w-fit flex-wrap gap-1.5">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-pink/10 px-2 py-0.5 text-[11px] font-medium text-accent-pink"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 4 && (
                <span className="rounded-full bg-accent-pink/10 px-2 py-0.5 text-[11px] font-medium text-accent-pink">
                  +{project.tags.length - 4}
                </span>
              )}
            </CardItem>

            {project.impactMetrics && project.impactMetrics.length > 0 && (
              <CardItem
                translateZ="25"
                className="mt-3 w-full rounded-lg border border-border-light/80 bg-surface-light/70 p-2.5 dark:border-border-dark/80 dark:bg-surface-dark/70"
              >
                <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
                  {project.impactMetrics[0].label}: {project.impactMetrics[0].value}
                </p>
              </CardItem>
            )}
          </div>
        </CardBody>
      </CardContainer>
    </motion.article>
  )
}

export function ProjectsSection() {
  const { projects } = useCmsContent()
  const reduceMotion = useReducedMotion()
  const [showAll, setShowAll] = useState(false)

  const orderedProjects = useMemo(() => sortProjectsForShowcase(projects), [projects])

  const visibleProjects = useMemo(
    () => (showAll ? orderedProjects : orderedProjects.slice(0, INITIAL_VISIBLE_PROJECTS)),
    [orderedProjects, showAll]
  )

  const sectionTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }

  return (
    <motion.section
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={sectionTransition}
    >
      <h2 className="mb-2 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
        Projects
      </h2>

      <p className="mb-4 text-xs text-text-muted-light dark:text-text-muted-dark">
        Hover any card to see the 3D tilt effect.
      </p>

      <div className="space-y-3">
        {visibleProjects.map((project, index) => (
          <ProjectShowcaseCard
            key={project.githubRepo || project.slug || project.title}
            project={project}
            index={index}
            reduceMotion={Boolean(reduceMotion)}
            showAll={showAll}
          />
        ))}
      </div>

      {orderedProjects.length > INITIAL_VISIBLE_PROJECTS && (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
          className="mx-auto mt-4 flex items-center gap-1 rounded-sm text-xs font-medium text-text-muted-light transition-colors hover:text-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 dark:text-text-muted-dark"
        >
          {showAll ? (
            <>
              Show less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              View all projects <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </motion.section>
  )
}
