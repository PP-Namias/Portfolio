'use client';

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useCmsContent } from '@/hooks/useCmsContent';
import { Project } from '@/types';

const RECENT_LIMIT = 4;

function sortProjectsByTier(entries: Project[]): Project[] {
  const tierOrder = { featured: 0, standard: 1, archived: 2 };
  return [...entries].sort((a, b) => {
    const aRank = tierOrder[a.tier ?? 'standard'] ?? 1;
    const bRank = tierOrder[b.tier ?? 'standard'] ?? 1;
    if (aRank !== bRank) return aRank - bRank;
    const aFeatured = a.featuredRank ?? Number.MAX_SAFE_INTEGER;
    const bFeatured = b.featuredRank ?? Number.MAX_SAFE_INTEGER;
    if (aFeatured !== bFeatured) return aFeatured - bFeatured;
    return b.year - a.year;
  });
}

export function ProjectsSectionRevamped() {
  const { projects } = useCmsContent();
  const reduceMotion = useReducedMotion();

  const recentProjects = useMemo(
    () => sortProjectsByTier(projects).slice(0, RECENT_LIMIT),
    [projects]
  );

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
          <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
            {projects.length} total &middot; showing latest {recentProjects.length}
          </p>
        </div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted-light transition-colors hover:text-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 dark:text-text-muted-dark"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2×2 grid */}
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
  );
}

interface RecentCardProps {
  project: Project;
  index: number;
  reduceMotion: boolean;
}

function RecentCard({ project, index, reduceMotion }: Readonly<RecentCardProps>) {
  const detailHref = project.liveURL || project.repositoryURL || null;
  const hasLink = Boolean(detailHref);
  const displayUrl = project.liveURL || project.repositoryURL || '';

  const cardTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], delay: index * 0.05 };

  const hostname = displayUrl ? new URL(displayUrl).hostname : '';
  const isFeatured = project.tier === 'featured';

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={cardTransition}
      className="group/card relative flex flex-col rounded-xl border border-border-light bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-accent-pink/50 hover:shadow-[0_18px_40px_-22px_rgba(236,72,153,0.55)] dark:border-border-dark dark:bg-card-bg-dark"
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

      {/* Top row: title + external icon */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
          {project.title}
        </h3>
        {hasLink && (
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted-light opacity-0 transition-opacity group-hover/card:opacity-100 dark:text-text-muted-dark" />
        )}
      </div>

      {/* Description */}
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
        {project.shortDescription || project.description}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-surface-light px-2 py-0.5 text-[11px] font-medium text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-surface-light px-2 py-0.5 text-[11px] font-medium text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Bottom row: hostname + badges */}
      <div className="mt-4 flex items-center justify-between gap-2">
        {hostname ? (
          <div className="inline-flex items-center gap-1.5 rounded-md bg-surface-light px-3 py-1.5 text-xs font-medium text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark">
            <span className="truncate max-w-[180px]">{hostname}</span>
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1.5">
          {isFeatured && (
            <span className="inline-flex items-center rounded-md bg-accent-pink/10 px-2 py-0.5 text-[11px] font-semibold text-accent-pink">
              Featured
            </span>
          )}
          {project.showcaseDetail && !project.liveURL && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-pink">
              Case study <span aria-hidden>&rarr;</span>
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
