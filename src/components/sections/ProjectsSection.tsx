'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Github, FolderOpen } from 'lucide-react';
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
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen className="h-4 w-4 text-accent-pink" />
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Projects
        </h2>
        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-accent-pink/10 text-accent-pink">
          {projects.length}
        </span>
      </div>

      {/* Featured project — large card */}
      {featured && featured.image && featured.image !== 'placeholder.png' && (
        <motion.div
          className="mb-4 group"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
            <Image
              src={`/images/projects/${featured.image}`}
              alt={featured.title}
              width={800}
              height={400}
              sizes="(max-width: 768px) 100vw, 500px"
              className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-white leading-snug">
                  {featured.title}
                </h3>
                <span className="text-[10px] text-white/60 flex-shrink-0">{featured.year}</span>
              </div>
              <p className="text-xs text-white/70 mt-1 line-clamp-2 leading-relaxed">
                {featured.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex flex-wrap gap-1">
                  {featured.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/15 text-white/90">
                      {tag}
                    </span>
                  ))}
                  {featured.tags.length > 3 && (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/15 text-white/90">
                      +{featured.tags.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  {featured.repositoryURL && (
                    <a href={featured.repositoryURL} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {featured.liveURL && (
                    <a href={featured.liveURL} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Compact list for remaining projects */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {rest.map((project, index) => {
            const url = project.liveURL || project.repositoryURL;
            return (
              <motion.div
                key={project.title}
                layout
                className="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-accent-pink/5 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                {/* Project thumbnail */}
                {project.image && project.image !== 'placeholder.png' && (
                  <div className="flex-shrink-0 h-10 w-14 rounded-md overflow-hidden border border-border-light dark:border-border-dark">
                    <Image
                      src={`/images/projects/${project.image}`}
                      alt={project.title}
                      width={56}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate group-hover:text-accent-pink transition-colors">
                      {project.title}
                    </p>
                    <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark flex-shrink-0">
                      {project.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {project.repositoryURL && (
                        <a href={project.repositoryURL} target="_blank" rel="noopener noreferrer" className="text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors">
                          <Github className="h-3 w-3" />
                        </a>
                      )}
                      {project.liveURL && (
                        <a href={project.liveURL} target="_blank" rel="noopener noreferrer" className="text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
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
