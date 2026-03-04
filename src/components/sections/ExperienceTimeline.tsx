'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { experiences } from '@/data/experience';
import { TimelineItem } from '@/components/ui/TimelineItem';
import { useModal } from '@/hooks/useModal';

export function ExperienceTimeline() {
  const { openModal } = useModal();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Experience
      </h2>
      <div>
        {experiences.map((exp, index) => (
          <TimelineItem key={`${exp.company}-${exp.position}`} item={exp} index={index} isLast={index === experiences.length - 1} />
        ))}
      </div>
      <button
        onClick={() => openModal('experience')}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent-pink hover:text-accent-pink-hover dark:hover:text-accent-pink-hover-dark transition-colors"
      >
        View Full Experience
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </motion.section>
  );
}
