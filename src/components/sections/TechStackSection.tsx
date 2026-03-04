'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { techCategories } from '@/data/techStack';
import { technologies } from '@/data/techStack';

const INITIAL_CATEGORIES = 3;
const categories = Object.entries(techCategories);

export function TechStackSection() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? categories : categories.slice(0, INITIAL_CATEGORIES);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Tech Stack
        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-accent-pink/10 text-accent-pink ml-2 align-middle">
          {technologies.length}
        </span>
      </h2>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {visible.map(([category, techs], catIndex) => (
            <motion.div
              key={category}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: catIndex * 0.05, duration: 0.3 }}
            >
              <h3 className="text-[11px] font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5 uppercase tracking-wider">
                {category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {techs.map((tech) => (
                  <span
                    key={tech.name}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink/40 hover:text-accent-pink transition-colors"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {categories.length > INITIAL_CATEGORIES && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 mx-auto mt-3 text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
        >
          {expanded ? (
            <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
          ) : (
            <>View all {categories.length} categories <ChevronDown className="h-3.5 w-3.5" /></>
          )}
        </button>
      )}
    </motion.section>
  );
}
