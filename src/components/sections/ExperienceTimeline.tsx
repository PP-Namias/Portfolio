'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { experiences } from '@/data/experience';
import { TimelineItem } from '@/components/ui/TimelineItem';

export function ExperienceTimeline() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Experience
      </h2>
      <div>
        {experiences.map((exp, index) => (
          <TimelineItem key={exp.id} item={exp} index={index} isLast={index === experiences.length - 1} />
        ))}
      </div>
    </motion.section>
  );
}
