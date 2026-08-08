'use client'

import Image from '@/components/ui/OptimizedImage'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, FileText } from 'lucide-react'
import { Project } from '@/types'
import { resolveContentImageSrc } from '@/lib/media'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/site-config'
import { PERSON_ENTITY_ID, PERSON_NAME } from '@/lib/jsonld'

interface ProjectDetailPageProps {
  project: Project
}

export function ProjectDetailPage({ project }: Readonly<ProjectDetailPageProps>) {
  const reduceMotion = useReducedMotion()
  const heroSrc = resolveContentImageSrc(project.image, {
    folder: 'projects',
    label: project.slug || project.title,
  })

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.description,
          dateCreated: `${project.year}`,
          author: { '@type': 'Person', '@id': PERSON_ENTITY_ID, name: PERSON_NAME },
          keywords: project.tags.join(', '),
          image: heroSrc
            ? {
                '@type': 'ImageObject',
                url: heroSrc,
                width: 1200,
                height: 630,
                alt: project.imageAlt || project.title,
              }
            : undefined,
          ...(project.repositoryURL ? { codeRepository: project.repositoryURL } : {}),
          ...(project.liveURL ? { url: project.liveURL } : {}),
        }}
      />

      <main>
        <motion.article
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
          }
          className="mx-auto max-w-3xl px-4 sm:px-6 pt-8 pb-16"
        >
          {/* Back link */}
          <Link
            href="/#projects"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-text-muted-light transition-colors hover:text-accent-pink dark:text-text-muted-dark"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Portfolio
          </Link>

          {/* Hero image */}
          {heroSrc && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-xl border border-border-light dark:border-border-dark">
              <Image
                src={heroSrc}
                alt={project.imageAlt || project.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Title and metadata */}
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {project.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted-light dark:text-text-muted-dark">
            <span className="rounded-md bg-accent-pink/10 px-2 py-0.5 font-medium text-accent-pink">
              {project.year}
            </span>
            {project.category && (
              <span className="rounded-md bg-surface-light px-2 py-0.5 dark:bg-surface-dark">
                {project.category}
              </span>
            )}
            {project.role && (
              <span className="rounded-md bg-surface-light px-2 py-0.5 dark:bg-surface-dark">
                {project.role}
              </span>
            )}
            {project.status && (
              <span className="rounded-md bg-surface-light px-2 py-0.5 capitalize dark:bg-surface-dark">
                {project.status.replace(/-/g, ' ')}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
            {project.description}
          </p>

          {/* Challenge / Solution / Result */}
          {(project.challenge || project.solution || project.result) && (
            <div className="mt-8 space-y-6">
              {project.challenge && (
                <section>
                  <h2 className="mb-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Challenge
                  </h2>
                  <p className="text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                    {project.challenge}
                  </p>
                </section>
              )}
              {project.solution && (
                <section>
                  <h2 className="mb-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Solution
                  </h2>
                  <p className="text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                    {project.solution}
                  </p>
                </section>
              )}
              {project.result && (
                <section>
                  <h2 className="mb-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Result
                  </h2>
                  <p className="text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                    {project.result}
                  </p>
                </section>
              )}
            </div>
          )}

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                Highlights
              </h2>
              <ul className="space-y-2">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-pink" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tech stack */}
          {project.tags.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent-pink/10 px-3 py-1 text-xs font-medium text-accent-pink"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                Gallery
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.gallery.map((item, index) => (
                  <div
                    key={item.image || index}
                    className="relative aspect-video overflow-hidden rounded-lg border border-border-light dark:border-border-dark"
                  >
                    <Image
                      src={resolveContentImageSrc(item.image, {
                        folder: 'projects',
                        label: item.alt || item.caption || project.title,
                      })}
                      alt={item.alt || item.caption || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover"
                    />

                    <JsonLd
                      data={{
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                          {
                            '@type': 'ListItem',
                            position: 2,
                            name: 'Projects',
                            item: `${SITE_URL}/projects`,
                          },
                          { '@type': 'ListItem', position: 3, name: project.title },
                        ],
                      }}
                    />
                    {item.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 px-3 py-1.5 text-[11px] text-white">
                        {item.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Action links */}
          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveURL && (
              <a
                href={project.liveURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent-pink px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live Demo
              </a>
            )}
            {project.repositoryURL && (
              <a
                href={project.repositoryURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-light px-4 py-2 text-xs font-medium text-text-primary-light transition-colors hover:bg-surface-light dark:border-border-dark dark:text-text-primary-dark dark:hover:bg-surface-dark"
              >
                <Github className="h-3.5 w-3.5" />
                Source Code
              </a>
            )}
            {project.processURL && (
              <a
                href={project.processURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-light px-4 py-2 text-xs font-medium text-text-primary-light transition-colors hover:bg-surface-light dark:border-border-dark dark:text-text-primary-dark dark:hover:bg-surface-dark"
              >
                <FileText className="h-3.5 w-3.5" />
                Process Notes
              </a>
            )}
          </div>
        </motion.article>
      </main>
    </>
  )
}
