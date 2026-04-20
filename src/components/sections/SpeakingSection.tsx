'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { profile } from '@/data/profile';

export function SpeakingSection() {
  const topics = profile.highlights.primaryTechnologies;

  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
        Speaking
      </h2>
      <div className="flex items-start gap-2 mb-2">
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
          Available for talks and workshops on full-stack development, cloud architecture, and modern web technologies.
        </p>
      </div>
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {topics.map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-0.5 rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
      <a
        href="/contact?subject=Speaking%20Inquiry"
        className="inline-flex items-center gap-1 text-sm text-accent-pink hover:text-accent-pink-hover dark:hover:text-accent-pink-hover-dark transition-colors duration-200 font-medium"
      >
        Get in touch
        <ChevronRight className="h-4 w-4" />
      </a>
    </motion.section>
  );
}
