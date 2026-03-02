'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { profile } from '@/data/profile';

export function SpeakingSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
        Speaking
      </h2>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
        Available for speaking at events about software development and emerging technologies.
      </p>
      <a
        href={`mailto:${profile.email}`}
        className="inline-flex items-center gap-1 mt-2.5 text-sm text-accent-pink hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200 font-medium"
      >
        Get in touch
        <ChevronRight className="h-4 w-4" />
      </a>
    </motion.section>
  );
}
