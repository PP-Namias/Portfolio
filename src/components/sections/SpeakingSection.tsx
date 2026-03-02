'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Mic } from 'lucide-react';
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
        <Mic className="h-3.5 w-3.5 text-accent-pink mt-0.5 flex-shrink-0" />
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
          Available for talks and workshops on full-stack development, cloud architecture, and modern web technologies.
        </p>
      </div>
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 ml-5">
          {topics.map((topic) => (
            <span
              key={topic}
              className="text-[9px] px-1.5 py-0.5 rounded-full border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
      <a
        href={`mailto:${profile.email}?subject=Speaking%20Inquiry`}
        className="inline-flex items-center gap-1 text-sm text-accent-pink hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200 font-medium"
      >
        Get in touch
        <ChevronRight className="h-4 w-4" />
      </a>
    </motion.section>
  );
}
