'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { experiences } from '@/data/experience';
import { TimelineItem } from '@/components/ui/TimelineItem';

export function ExperienceTimeline() {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleExperiences = useMemo(
    () => (isExpanded ? experiences : experiences.slice(0, 3)),
    [isExpanded]
  );

  const isExpandable = experiences.length > 3;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2.5">
        Experience
      </h2>
      <p className="text-[13px] sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3.5 leading-relaxed">
        Recent roles across project leadership, technical execution, and delivery operations.
      </p>
      <motion.div layout>
        {visibleExperiences.map((exp, index) => (
          <TimelineItem
            key={`${exp.company}-${exp.position}`}
            item={exp}
            index={index}
            isLast={index === visibleExperiences.length - 1}
          />
        ))}

        {isExpandable && (
          <motion.button
            layout
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-pink hover:text-accent-pink-hover dark:hover:text-accent-pink-hover-dark transition-colors"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Show Less' : 'View Full Experience'}
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </motion.button>
        )}
      </motion.div>
    </motion.section>
  );
}
