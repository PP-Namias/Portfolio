'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { memberships } from '@/data/memberships';

export function MembershipsSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        A member of
      </h2>
      <div className="space-y-2.5">
        {memberships.map((membership, index) => (
          <motion.a
            key={membership.id}
            href={membership.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 group text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="leading-snug">{membership.name}</span>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}
