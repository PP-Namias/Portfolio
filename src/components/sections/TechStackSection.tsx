'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { techCategories } from '@/data/techStack';
import { Technology } from '@/types';

// Map JSON logo slugs to Simple Icons slugs where they differ
const LOGO_SLUG_MAP: Record<string, string> = {
  sharp: 'csharp',
  css: 'css3',
  nextjs: 'nextdotjs',
  sklearn: 'scikitlearn',
  photoshop: 'adobephotoshop',
};

function getLogoUrl(logo: string): string {
  const slug = LOGO_SLUG_MAP[logo] || logo;
  return `https://cdn.simpleicons.org/${encodeURIComponent(slug)}`;
}

function getSkillLevel(proficiency: number): { label: string; color: string } {
  if (proficiency >= 90) return { label: 'Expert', color: 'text-accent-pink' };
  if (proficiency >= 75) return { label: 'Advanced', color: 'text-accent-pink/80' };
  if (proficiency >= 60) return { label: 'Intermediate', color: 'text-text-muted-light dark:text-text-muted-dark' };
  return { label: 'Beginner', color: 'text-text-muted-light dark:text-text-muted-dark' };
}

const categories = Object.keys(techCategories);
const allTechCount = Object.values(techCategories).flat().length;

function TechItem({ tech, index }: { tech: Technology; index: number }) {
  const level = getSkillLevel(tech.proficiency);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className="group flex items-center gap-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-2.5 hover:border-accent-pink/40 dark:hover:border-accent-pink/40 transition-colors"
    >
      {/* Logo */}
      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-white dark:bg-card-bg-dark border border-border-light dark:border-border-dark flex items-center justify-center">
        {tech.logo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={getLogoUrl(tech.logo)}
            alt=""
            width={18}
            height={18}
            className="opacity-60 group-hover:opacity-90 dark:invert transition-opacity"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark">
            {tech.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Name + proficiency bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark truncate">
            {tech.name}
          </span>
          <span className={`text-[10px] font-medium flex-shrink-0 ${level.color}`}>
            {tech.proficiency}%
          </span>
        </div>
        <div className="h-1 rounded-full bg-border-light dark:bg-border-dark overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent-pink to-accent-pink-hover-dark"
            initial={{ width: 0 }}
            whileInView={{ width: `${tech.proficiency}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.03, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function TechStackSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = activeCategory
    ? { [activeCategory]: techCategories[activeCategory] }
    : techCategories;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Tech Stack{' '}
          <span className="text-sm font-normal text-text-muted-light dark:text-text-muted-dark">
            ({allTechCount})
          </span>
        </h2>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
            activeCategory === null
              ? 'bg-accent-pink text-white'
              : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink hover:border-accent-pink/40'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
              activeCategory === cat
                ? 'bg-accent-pink text-white'
                : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink hover:border-accent-pink/40'
            }`}
          >
            {cat} ({techCategories[cat].length})
          </button>
        ))}
      </div>

      {/* Tech grid */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {Object.entries(filteredCategories).map(([category, techs]) => (
            <motion.div
              key={category}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {!activeCategory && (
                <h3 className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-2">
                  {category}
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {techs.map((tech, i) => (
                  <TechItem key={tech.name} tech={tech} index={i} />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border-light dark:border-border-dark">
        {[
          { min: 90, label: 'Expert' },
          { min: 75, label: 'Advanced' },
          { min: 60, label: 'Intermediate' },
        ].map(({ min, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="h-1.5 w-6 rounded-full bg-gradient-to-r from-accent-pink to-accent-pink-hover-dark" style={{ opacity: min / 100 }} />
            <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">{label} ({min}%+)</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
