'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { techCategories } from '@/data/techStack';

export function TechStackSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Tech Stack
      </h2>

      <div className="space-y-4">
        {Object.entries(techCategories).map(([category, techs], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.1, duration: 0.3 }}
          >
            <h3 className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
              {category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {techs.map((tech) => (
                <span
                  key={tech.name}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink/40 hover:text-accent-pink transition-colors"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
