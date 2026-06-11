'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCmsContent } from '@/hooks/useCmsContent';
import { Project } from '@/types';

type TabId = 'live' | 'showcase';

const TABS: { id: TabId; label: string }[] = [
  { id: 'live', label: 'Live Projects' },
  { id: 'showcase', label: 'Showcase' },
];

const INITIAL_VISIBLE = 8;

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

function isLiveProject(project: Project): boolean {
  return Boolean(project.liveURL);
}

function isShowcaseProject(project: Project): boolean {
  return project.showcaseDetail === true && !project.liveURL;
}

export function ProjectsSectionRevamped() {
  const { projects } = useCmsContent();
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<TabId>('live');
  const [showAll, setShowAll] = useState(false);

  const liveProjects = useMemo(
    () => sortProjectsByTier(projects.filter(isLiveProject)),
    [projects]
  );

  const showcaseProjects = useMemo(
    () => sortProjectsByTier(projects.filter(isShowcaseProject)),
    [projects]
  );

  const activeProjects = activeTab === 'live' ? liveProjects : showcaseProjects;
  const visibleProjects = showAll ? activeProjects : activeProjects.slice(0, INITIAL_VISIBLE);
  const hasMore = activeProjects.length > INITIAL_VISIBLE;

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setShowAll(false);
  };

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % TABS.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = TABS.length - 1;
      }

      if (nextIndex !== currentIndex) {
        handleTabChange(TABS[nextIndex].id);
      }
    },
    [activeTab]
  );

  return (
    <motion.section
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="mb-2 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
        Projects{' '}
        <span className="ml-2 inline-flex items-center rounded-md bg-accent-pink/10 px-1.5 py-0.5 align-middle text-xs font-medium text-accent-pink">
          {projects.length}
        </span>
      </h2>

      {/* Tab bar with sliding indicator */}
      <div
        role="tablist"
        aria-label="Project categories"
        className="relative mb-4 flex gap-1 rounded-lg border border-border-light bg-surface-light p-1 dark:border-border-dark dark:bg-surface-dark"
        onKeyDown={handleTabKeyDown}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
            className={`relative z-10 flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-text-primary-light dark:text-text-primary-dark'
                : 'text-text-muted-light hover:text-text-secondary-light dark:text-text-muted-dark dark:hover:text-text-secondary-dark'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="projects-tab-indicator"
                className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-card-bg-dark"
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">
              {tab.label}
              <span className="ml-1.5 text-[11px] text-text-muted-light dark:text-text-muted-dark">
                ({tab.id === 'live' ? liveProjects.length : showcaseProjects.length})
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Project grid with stagger animation */}
      <div id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        <div
          key={activeTab}
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
        >
            {visibleProjects.map((project, index) => (
              <ProjectIndexCard
                key={project.title}
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
              : 'No showcase projects yet.'}
          </p>
        )}
      </div>

      {/* Expand / collapse */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="mx-auto mt-4 flex items-center gap-1 rounded-sm text-xs font-medium text-text-muted-light transition-colors hover:text-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 dark:text-text-muted-dark"
        >
          {showAll ? (
            <>
              Show less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              View all {activeProjects.length} projects <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </motion.section>
  );
}

interface ProjectIndexCardProps {
  project: Project;
  index: number;
  reduceMotion: boolean;
}

function ProjectIndexCard({ project, index, reduceMotion }: Readonly<ProjectIndexCardProps>) {
  const detailHref = project.liveURL || project.repositoryURL || null;
  const hasLink = Boolean(detailHref);

  const cardTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], delay: index * 0.05 };

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

      <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
        {project.title}
      </h3>

      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-text-muted-light dark:text-text-muted-dark">
        <span>{project.year}</span>
        {project.role && (
          <>
            <span aria-hidden>·</span>
            <span>{project.role}</span>
          </>
        )}
        {project.tier && project.tier !== 'standard' && (
          <>
            <span aria-hidden>·</span>
            <span className="capitalize">{project.tier}</span>
          </>
        )}
      </div>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
        {project.shortDescription || project.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
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
      </div>

      {project.showcaseDetail && !project.liveURL && (
        <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-accent-pink">
          <span>View case study</span>
          <span aria-hidden>→</span>
        </div>
      )}
    </motion.article>
  );
}
