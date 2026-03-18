'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { experiences } from '@/data/experience';
import { TimelineItem } from '@/components/ui/TimelineItem';

export function ExperienceTimeline() {
  const previewExperiences = experiences.slice(0, 3);

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
        {previewExperiences.map((exp, index) => (
          <TimelineItem
            key={`${exp.company}-${exp.position}`}
            item={exp}
            index={index}
            isLast={index === previewExperiences.length - 1}
          />
        ))}
      </div>
    </motion.section>
  );
}
