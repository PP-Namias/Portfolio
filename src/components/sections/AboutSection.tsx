'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/data/profile';

export function AboutSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        About
      </h2>
      <div className="space-y-4">
        {profile.bio.map((paragraph, index) => (
          <motion.p
            key={index}
            className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </motion.section>
  );
}
