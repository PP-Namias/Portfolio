'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/ui/ProjectCard';

export function ProjectsSection() {
  const [showAll, setShowAll] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, []);

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;
  const displayedProjects = showAll || activeTag ? filtered : filtered.slice(0, 4);

  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Projects ({filtered.length})
        </h2>
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors ${
            !activeTag
              ? 'bg-accent-pink text-white'
              : 'bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20'
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors ${
              activeTag === tag
                ? 'bg-accent-pink text-white'
                : 'bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayedProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
      {!activeTag && projects.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 mx-auto mt-4 text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
        >
          {showAll ? (
            <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
          ) : (
            <>View all projects <ChevronDown className="h-3.5 w-3.5" /></>
          )}
        </button>
      )}
    </motion.section>
  );
}
