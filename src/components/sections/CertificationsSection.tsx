'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { certifications } from '@/data/certifications';

export function CertificationsSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Recent Certifications
        </h2>
        <a
          href="#"
          className="flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
        >
          View All
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            className="group"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
          >
            <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
              {cert.name}
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
              {cert.issuer}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
