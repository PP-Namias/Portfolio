'use client';

import React, { useCallback, useDeferredValue, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Code2 } from 'lucide-react';
import { projects } from '@/data/projects';
import { useModal } from '@/hooks/useModal';

type SortKey = 'featured' | 'newest' | 'oldest' | 'az';

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'az', label: 'A-Z' },
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function getProjectCategory(category?: string): string {
  return category && category.trim().length > 0 ? category : 'Uncategorized';
}

function sortProjects(sortBy: SortKey) {
  return [...projects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.year - a.year;
      case 'oldest':
        return a.year - b.year;
      case 'az':
        return a.title.localeCompare(b.title);
      case 'featured':
      default: {
        const aRank = a.featuredRank ?? Number.MAX_SAFE_INTEGER;
        const bRank = b.featuredRank ?? Number.MAX_SAFE_INTEGER;
        if (aRank !== bRank) return aRank - bRank;
        return b.year - a.year;
      }
    }
  });
}

export function ProjectsSection() {
  const { openModal } = useModal();
  const reduceMotion = useReducedMotion();
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('featured');

  const sectionTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

  const cardTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(projects.map((project) => getProjectCategory(project.category))));
    return ['all', ...categories];
  }, []);

  const tagOptions = useMemo(() => {
    const tags = Array.from(new Set(projects.flatMap((project) => project.tags || [])));
    return ['all', ...tags.sort((a, b) => a.localeCompare(b))];
  }, []);

  const sortedProjects = useMemo(() => sortProjects(sortBy), [sortBy]);

  const filteredAndSortedProjects = useMemo(() => {
    const normalizedQuery = normalize(deferredSearchQuery);

    const filtered = sortedProjects.filter((project) => {
      const projectCategory = getProjectCategory(project.category);

      const matchesSearch =
        normalizedQuery.length === 0 ||
        normalize(project.title).includes(normalizedQuery) ||
        normalize(project.description).includes(normalizedQuery) ||
        project.tags.some((tag) => normalize(tag).includes(normalizedQuery));

      const matchesCategory = selectedCategory === 'all' || projectCategory === selectedCategory;
      const matchesTag = selectedTag === 'all' || project.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });

    return filtered;
  }, [deferredSearchQuery, selectedCategory, selectedTag, sortedProjects]);

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedCategory !== 'all' || selectedTag !== 'all';

  const activeFilterLabels = [
    searchQuery.trim().length > 0 ? `Search: "${searchQuery.trim()}"` : null,
    selectedCategory !== 'all' ? `Category: ${selectedCategory}` : null,
    selectedTag !== 'all' ? `Tag: ${selectedTag}` : null,
  ].filter(Boolean) as string[];

  const sortLabel = SORT_OPTIONS.find((option) => option.value === sortBy)?.label ?? 'Featured';

  const liveAnnouncement = `Showing ${filteredAndSortedProjects.length} of ${projects.length} projects. Sort ${sortLabel}. ${
    activeFilterLabels.length > 0 ? `Active filters: ${activeFilterLabels.join(', ')}.` : 'No active filters.'
  }`;

  const featured = filteredAndSortedProjects[0];
  const rest = useMemo(() => {
    const restSource = filteredAndSortedProjects.slice(1);
    if (hasActiveFilters) {
      return restSource;
    }

    return showAll ? restSource : restSource.slice(0, 3);
  }, [filteredAndSortedProjects, hasActiveFilters, showAll]);

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setSortBy('featured');
    setShowAll(false);
  }, []);

  return (
    <motion.section
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={sectionTransition}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Projects{' '}
        <span className="text-xs font-medium px-1.5 py-0.5 rounded-md bg-accent-pink/10 text-accent-pink ml-2 align-middle">
          {projects.length}
        </span>
      </h2>

      <div className="mb-4 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-3 space-y-3">
        <p className="sr-only" aria-live="polite">
          {liveAnnouncement}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <label className="sm:col-span-2">
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setShowAll(false);
              }}
              placeholder="Search by title, description, or tag"
              className="w-full rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-accent-pink/40 focus-visible:ring-2 focus-visible:ring-accent-pink/50"
              aria-label="Search projects"
            />
          </label>

          <label className="sm:col-span-1">
            <span className="sr-only">Sort projects</span>
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as SortKey);
                setShowAll(false);
              }}
              className="w-full rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-pink/40 focus-visible:ring-2 focus-visible:ring-accent-pink/50"
              aria-label="Sort projects"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categoryOptions.map((category) => {
            const isActive = selectedCategory === category;
            const label = category === 'all' ? 'All categories' : category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setShowAll(false);
                }}
                className={`text-[11px] font-medium px-2 py-1 rounded-full border transition-colors ${
                  isActive
                    ? 'bg-accent-pink text-white border-accent-pink'
                    : 'bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark border-border-light dark:border-border-dark hover:border-accent-pink/40 hover:text-accent-pink'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50`}
                aria-pressed={isActive}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
          <label className="sm:w-56">
            <span className="sr-only">Filter by technology tag</span>
            <select
              value={selectedTag}
              onChange={(event) => {
                setSelectedTag(event.target.value);
                setShowAll(false);
              }}
              className="w-full rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-pink/40 focus-visible:ring-2 focus-visible:ring-accent-pink/50"
              aria-label="Filter by technology tag"
            >
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag === 'all' ? 'All tags' : tag}
                </option>
              ))}
            </select>
          </label>

          <div className="text-[11px] text-text-muted-light dark:text-text-muted-dark" aria-live="polite">
            Showing {filteredAndSortedProjects.length} of {projects.length} projects
          </div>
        </div>

        {(activeFilterLabels.length > 0 || sortBy !== 'featured') && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-border-light dark:border-border-dark pt-2">
            <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
              {activeFilterLabels.length > 0 ? `Active: ${activeFilterLabels.join(' • ')}` : 'Active: none'}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="self-start sm:self-auto text-[11px] font-medium text-accent-pink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 rounded-sm"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {filteredAndSortedProjects.length === 0 && (
        <div className="mb-4 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          No projects match your current filters. Try resetting filters or using a broader search.
        </div>
      )}

      {/* Featured project — large card */}
      {featured?.image && featured.image !== 'placeholder.png' && (
        <motion.div
          className="mb-4"
          initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          whileHover={reduceMotion ? undefined : { y: -2 }}
          viewport={{ once: true }}
          transition={cardTransition}
        >
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark overflow-hidden group shadow-sm">
            <div className="relative h-48 sm:h-56">
              <Image
                src={`/images/projects/${featured.image}`}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover group-hover:scale-105 motion-reduce:transform-none transition-transform duration-300"
                priority={!hasActiveFilters && !showAll}
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
                <button
                  type="button"
                  onClick={() => openModal('project', featured)}
                  className="inline-flex items-center gap-1 rounded-md border border-border-light dark:border-border-dark px-2.5 py-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50"
                  aria-label={`View details for ${featured.title}`}
                >
                  View details
                </button>
                {featured.repositoryURL && (
                  <a
                    href={featured.repositoryURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View repository for ${featured.title}`}
                    className="inline-flex items-center gap-1 rounded-md border border-border-light dark:border-border-dark px-2.5 py-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50"
                  >
                    <Code2 className="h-3.5 w-3.5" /> Code
                  </a>
                )}
                {featured.liveURL && (
                  <a
                    href={featured.liveURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View live project for ${featured.title}`}
                    className="inline-flex items-center gap-1 rounded-md bg-accent-pink text-white px-2.5 py-1 text-xs font-medium hover:bg-accent-pink/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Live
                  </a>
                )}
                {featured.processURL && (
                  <a
                    href={featured.processURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View project process for ${featured.title}`}
                    className="inline-flex items-center gap-1 rounded-md border border-border-light dark:border-border-dark px-2.5 py-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50"
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
                layout="position"
                className="group rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-3 hover:border-accent-pink/40 hover:-translate-y-0.5 transition-all duration-200"
                initial={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        ...cardTransition,
                        delay: index * 0.04,
                      }
                }
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
                        sizes="64px"
                        loading="lazy"
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
                        <button
                          type="button"
                          onClick={() => openModal('project', project)}
                          aria-label={`View details for ${project.title}`}
                          className="text-[11px] font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 rounded-sm"
                        >
                          Details
                        </button>
                        {project.repositoryURL && (
                          <a
                            href={project.repositoryURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View repository for ${project.title}`}
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 rounded-sm"
                          >
                            <Code2 className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {project.liveURL && (
                          <a
                            href={project.liveURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View live project for ${project.title}`}
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 rounded-sm"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {project.processURL && (
                          <a
                            href={project.processURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View project process for ${project.title}`}
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 rounded-sm"
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

      {!hasActiveFilters && filteredAndSortedProjects.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 mx-auto mt-4 text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 rounded-sm"
          aria-expanded={showAll}
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
