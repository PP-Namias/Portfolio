'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Experience } from '@/types';

interface TimelineItemProps {
  item: Experience;
  index: number;
  isLast: boolean;
}

export function TimelineItem({ item, index, isLast }: TimelineItemProps) {
  const startYear = new Date(item.startedAt).getFullYear();
  const endLabel = item.endedAt ? new Date(item.endedAt).getFullYear().toString() : 'Present';
  const dateLabel = startYear === Number(endLabel) ? `${startYear}` : `${startYear} – ${endLabel}`;

  return (
    <motion.div
      className="relative flex gap-3 pb-4"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div className="h-2.5 w-2.5 rounded-full bg-accent-pink mt-1.5 flex-shrink-0" />
        {!isLast && (
          <div className="w-px flex-1 bg-border-light dark:bg-border-dark mt-1" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-1">
        <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark leading-snug">
          {item.position}
        </p>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
          {item.company}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
            {dateLabel}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink">
            {item.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
