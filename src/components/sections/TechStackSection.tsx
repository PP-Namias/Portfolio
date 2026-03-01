'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { techStack } from '@/data/techStack';

export function TechStackSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Tech Stack
        </h2>
        <a
          href="#"
          className="flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
        >
          View All
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="space-y-3">
        {techStack.map((category, catIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.1, duration: 0.3 }}
          >
            <h3 className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-1.5">
              {category.category}
            </h3>
            <p className="text-sm text-text-primary-light dark:text-text-primary-dark leading-relaxed">
              {category.technologies.join(', ')}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
