'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { projects } from '@/data/projects';
import { Project } from '@/types';

const INITIAL_VISIBLE_PROJECTS = 4;

function sortProjectsForShowcase(entries: Project[]): Project[] {
  return [...entries].sort((a, b) => {
    const aRank = a.featuredRank ?? Number.MAX_SAFE_INTEGER;
    const bRank = b.featuredRank ?? Number.MAX_SAFE_INTEGER;

    if (aRank !== bRank) {
      return aRank - bRank;
    }

    return b.year - a.year;
  });
}

function resolveProjectTarget(project: Project): string | null {
  return project.detailURL || project.liveURL || project.repositoryURL || null;
}

function renderProjectPreviewMedia(project: Project, isPriority: boolean) {
  const hasImagePreview = Boolean(project.image && project.image !== 'placeholder.png');

  if (hasImagePreview) {
    return (
      <Image
        src={`/images/projects/${project.image}`}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 700px"
        priority={isPriority}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 group-focus-within:scale-108 motion-reduce:transform-none"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-light text-xs text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark">
      No preview media available
    </div>
  );
}

interface ProjectInteractionLayerProps {
  target: string | null;
  title: string;
}

function ProjectInteractionLayer({ target, title }: Readonly<ProjectInteractionLayerProps>) {
  if (!target) {
    return <div aria-hidden className="absolute inset-0 z-30 rounded-xl" />;
  }

  return (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open project link for ${title}`}
      className="absolute inset-0 z-30 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/60"
    >
      <span className="sr-only">Open project link for {title}</span>
    </a>
  );
}

interface ProjectShowcaseCardProps {
  project: Project;
  index: number;
  reduceMotion: boolean;
  showAll: boolean;
}

function ProjectShowcaseCard({
  project,
  index,
  reduceMotion,
  showAll,
}: Readonly<ProjectShowcaseCardProps>) {
  const target = resolveProjectTarget(project);
  const previewMedia = renderProjectPreviewMedia(project, index === 0 && !showAll);

  const cardTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], delay: index * 0.05 };

  return (
    <motion.article
      key={project.title}
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      viewport={{ once: true }}
      transition={cardTransition}
      className={`group relative overflow-hidden rounded-xl border border-border-light bg-white dark:border-border-dark dark:bg-card-bg-dark ${
        target
          ? 'cursor-pointer transition-[border-color,box-shadow,transform] duration-300 hover:border-accent-pink/50 hover:shadow-[0_12px_30px_-18px_rgba(236,72,153,0.55)]'
          : 'cursor-default'
      }`}
    >
      <ProjectInteractionLayer target={target} title={project.title} />

      <div className="relative h-44 overflow-hidden border-b border-border-light dark:border-border-dark sm:h-48">
        {previewMedia}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          {project.category || 'Project'}
        </div>

        <div className="absolute right-3 top-3 rounded-full border border-accent-pink/40 bg-black/45 px-2 py-0.5 text-[11px] font-medium text-accent-pink backdrop-blur-sm">
          {target ? 'Open' : 'Preview'}
        </div>
      </div>

      <div className="relative p-4">
        <div className="pr-8">
          <h3 className="text-sm font-semibold leading-snug text-text-primary-light dark:text-text-primary-dark">
            {project.title}
          </h3>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-text-muted-light dark:text-text-muted-dark">
          <span>{project.year}</span>
          {project.role && (
            <>
              <span aria-hidden>•</span>
              <span>{project.role}</span>
            </>
          )}
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-accent-pink/10 px-2 py-0.5 text-[11px] font-medium text-accent-pink">
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="rounded-full bg-accent-pink/10 px-2 py-0.5 text-[11px] font-medium text-accent-pink">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {project.impactMetrics && project.impactMetrics.length > 0 && (
          <div className="mt-3 rounded-lg border border-border-light/80 bg-surface-light/70 p-2.5 dark:border-border-dark/80 dark:bg-surface-dark/70">
            <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
              {project.impactMetrics[0].label}: {project.impactMetrics[0].value}
            </p>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function ProjectsSection() {
  const reduceMotion = useReducedMotion();
  const [showAll, setShowAll] = useState(false);

  const orderedProjects = useMemo(() => sortProjectsForShowcase(projects), []);

  const visibleProjects = useMemo(
    () => (showAll ? orderedProjects : orderedProjects.slice(0, INITIAL_VISIBLE_PROJECTS)),
    [orderedProjects, showAll]
  );

  const sectionTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

  return (
    <motion.section
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={sectionTransition}
    >
      <h2 className="mb-2 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
        Projects{' '}
        <span className="ml-2 inline-flex items-center rounded-md bg-accent-pink/10 px-1.5 py-0.5 align-middle text-xs font-medium text-accent-pink">
          {projects.length}
        </span>
      </h2>

      <p className="mb-4 text-xs text-text-muted-light dark:text-text-muted-dark">Minimalist showcase of selected projects.</p>

      <div className="space-y-3">
        {visibleProjects.map((project, index) => (
          <ProjectShowcaseCard
            key={project.title}
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
          className="mx-auto mt-4 flex items-center gap-1 rounded-sm text-xs font-medium text-text-muted-light transition-colors hover:text-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 dark:text-text-muted-dark"
          aria-expanded={showAll}
        >
          {showAll ? (
            <>
              Show less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              View all {orderedProjects.length} projects <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </motion.section>
  );
}
