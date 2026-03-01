'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Experience } from '@/types';

interface TimelineItemProps {
  item: Experience;
  index: number;
  isLast?: boolean;
}

export function TimelineItem({ item, index, isLast = false }: TimelineItemProps) {
  const isFirst = index === 0;

  return (
    <motion.div
      className="relative flex items-start gap-4 group"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      {/* Timeline indicator column */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Checkbox-style box */}
        <div
          className={`mt-1 h-3 w-3 rounded-[2px] border-2 transition-colors duration-200
            ${isFirst
              ? 'border-accent-pink bg-accent-pink'
              : 'border-border-light dark:border-border-dark bg-transparent group-hover:border-accent-pink group-hover:bg-accent-pink'
            }`}
        />
        {/* Connecting line */}
        {!isLast && (
          <div className="w-px flex-1 min-h-[24px] bg-border-light dark:bg-border-dark mt-1" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-6">
        <div className="flex items-baseline justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">
              {item.role}
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5 truncate">
              {item.organization}
            </p>
          </div>
          <span className="text-xs text-text-muted-light dark:text-text-muted-dark flex-shrink-0 tabular-nums">
            {item.year}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
