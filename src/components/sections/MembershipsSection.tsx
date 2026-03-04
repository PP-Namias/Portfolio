'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Users } from 'lucide-react';
import { memberships } from '@/data/memberships';

export function MembershipsSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-4 w-4 text-accent-pink" />
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          A member of
        </h2>
      </div>
      <div className="space-y-2.5">
        {memberships.map((membership, index) => (
          <motion.a
            key={membership.name}
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
            <div>
              <span className="leading-snug">{membership.name}</span>
              <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-0.5">
                Since {new Date(membership.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}
