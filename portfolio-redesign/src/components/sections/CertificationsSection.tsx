'use client';

import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';

export const CertificationsSection = () => {
  const certifications = [
    {
      id: '1',
      title: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2024',
      status: 'active' as const
    },
    {
      id: '2',
      title: 'Microsoft Azure Developer',
      issuer: 'Microsoft',
      date: '2023',
      status: 'active' as const
    },
    {
      id: '3',
      title: 'Google Cloud Professional',
      issuer: 'Google Cloud',
      date: '2023',
      status: 'active' as const
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
      id="certifications"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] rounded-lg flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Certifications</h2>
          <p className="text-xs text-[var(--color-text-muted)]">Professional credentials</p>
        </div>
      </div>

      {/* Certifications List */}
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors"
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-[var(--color-text-primary)]">
                {cert.title}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {cert.issuer} • {cert.date}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                {cert.status === 'active' ? 'Active' : 'Expired'}
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-[var(--color-border)] text-center">
        <div className="text-lg font-bold text-[var(--color-accent)]">
          {certifications.length}
        </div>
        <div className="text-xs text-[var(--color-text-muted)]">Active Certifications</div>
      </div>
    </motion.section>
  );
};
