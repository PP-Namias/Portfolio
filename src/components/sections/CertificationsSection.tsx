'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Certifications ({certifications.length})
      </h2>
      <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide">
        {certifications.map((cert, index) => (
          <motion.div
            key={`${cert.title}-${cert.issuer}`}
            className="group"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
          >
            <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
              {cert.title}
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
              {cert.issuer} · {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
