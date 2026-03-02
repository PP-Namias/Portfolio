'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Experience } from '@/types';

interface TimelineItemProps {
  item: Experience;
  index: number;
  isLast: boolean;
}

export function TimelineItem({ item, index, isLast }: TimelineItemProps) {
  const [expanded, setExpanded] = useState(false);
  const startYear = new Date(item.startedAt).getFullYear();
  const endLabel = item.endedAt ? new Date(item.endedAt).getFullYear().toString() : 'Present';
  const dateLabel = startYear === Number(endLabel) ? `${startYear}` : `${startYear} – ${endLabel}`;
  const hasDetails = item.summary || item.technologies.length > 0 || item.highlights.length > 0 || item.achievements.length > 0;

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
        <div
          className={hasDetails ? 'cursor-pointer group' : ''}
          onClick={() => hasDetails && setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-1">
            <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark leading-snug">
              {item.position}
            </p>
            {hasDetails && (
              <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-text-muted-light dark:text-text-muted-dark transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            )}
          </div>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
            {item.company}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
              {dateLabel}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink">
              {item.type}
            </span>
            {item.modality && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
                {item.modality}
              </span>
            )}
            {item.country && (
              <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
                {item.country}
              </span>
            )}
          </div>
        </div>

        {/* Expandable details */}
        <AnimatePresence>
          {expanded && hasDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-2">
                {item.summary && (
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    {item.summary}
                  </p>
                )}
                {item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] px-1.5 py-0.5 rounded-full border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {item.highlights.length > 0 && (
                  <ul className="space-y-0.5">
                    {item.highlights.map((highlight, i) => (
                      <li key={i} className="text-[11px] text-text-muted-light dark:text-text-muted-dark flex gap-1.5">
                        <span className="text-accent-pink mt-0.5">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.achievements.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-0.5">Achievements</p>
                    <ul className="space-y-0.5">
                      {item.achievements.map((achievement, i) => (
                        <li key={i} className="text-[11px] text-text-muted-light dark:text-text-muted-dark flex gap-1.5">
                          <span className="text-accent-pink mt-0.5">★</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
