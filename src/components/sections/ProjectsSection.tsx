'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Code2 } from 'lucide-react';
import { projects } from '@/data/projects';

export function ProjectsSection() {
  const [showAll, setShowAll] = useState(false);
  const featured = projects[0];
  const rest = showAll ? projects.slice(1) : projects.slice(1, 4);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Projects{' '}
        <span className="text-xs font-medium px-1.5 py-0.5 rounded-md bg-accent-pink/10 text-accent-pink ml-2 align-middle">
          {projects.length}
        </span>
      </h2>

      {/* Featured project — large card */}
      {featured?.image && featured.image !== 'placeholder.png' && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark overflow-hidden group shadow-sm">
            <div className="relative h-48 sm:h-56">
              <Image
                src={`/images/projects/${featured.image}`}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-text-primary-light">
                Featured
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark leading-snug">
                  {featured.title}
                </h3>
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark flex-shrink-0">
                  {featured.year}
                </span>
              </div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1.5 line-clamp-3 leading-relaxed">
                {featured.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {featured.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink">
                    {tag}
                  </span>
                ))}
                {featured.tags.length > 5 && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink">
                    +{featured.tags.length - 5}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {featured.repositoryURL && (
                  <a
                    href={featured.repositoryURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View repository"
                    className="inline-flex items-center gap-1 rounded-md border border-border-light dark:border-border-dark px-2.5 py-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink/40 transition-colors"
                  >
                    <Code2 className="h-3.5 w-3.5" /> Code
                  </a>
                )}
                {featured.liveURL && (
                  <a
                    href={featured.liveURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View live project"
                    className="inline-flex items-center gap-1 rounded-md bg-accent-pink text-white px-2.5 py-1 text-xs font-medium hover:bg-accent-pink/90 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Live
                  </a>
                )}
                {featured.processURL && (
                  <a
                    href={featured.processURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View project process"
                    className="inline-flex items-center gap-1 rounded-md border border-border-light dark:border-border-dark px-2.5 py-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink/40 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Process
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Compact list for remaining projects */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {rest.map((project, index) => {
            const url = project.liveURL || project.repositoryURL;
            return (
              <motion.div
                key={project.title}
                layout
                className="group rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-3 hover:border-accent-pink/40 hover:-translate-y-0.5 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  {/* Project thumbnail */}
                  {project.image && project.image !== 'placeholder.png' && (
                    <div className="flex-shrink-0 h-12 w-16 rounded-md overflow-hidden border border-border-light dark:border-border-dark">
                      <Image
                        src={`/images/projects/${project.image}`}
                        alt={project.title}
                        width={64}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate group-hover:text-accent-pink transition-colors"
                        >
                          {project.title}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                          {project.title}
                        </p>
                      )}
                      <span className="text-xs text-text-muted-light dark:text-text-muted-dark flex-shrink-0">
                        {project.year}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {project.repositoryURL && (
                          <a
                            href={project.repositoryURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View repository"
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors"
                          >
                            <Code2 className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {project.liveURL && (
                          <a
                            href={project.liveURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View live project"
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {project.processURL && (
                          <a
                            href={project.processURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View project process"
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {projects.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 mx-auto mt-4 text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
        >
          {showAll ? (
            <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
          ) : (
            <>View all {projects.length} projects <ChevronDown className="h-3.5 w-3.5" /></>
          )}
        </button>
      )}
    </motion.section>
  );
}
