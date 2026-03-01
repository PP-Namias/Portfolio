'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, FileText } from 'lucide-react';
import { profile } from '@/data/profile';

export function ContactSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-3">
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-2.5 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200 group"
        >
          <Mail className="h-4 w-4 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span>{profile.email}</span>
        </a>
        <a
          href={profile.scheduleCallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200 group"
        >
          <Calendar className="h-4 w-4 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span>Schedule a Call</span>
        </a>
        <a
          href={profile.blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200 group"
        >
          <FileText className="h-4 w-4 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span>Blog</span>
        </a>
      </div>
    </motion.section>
  );
}
