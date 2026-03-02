'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { certifications } from '@/data/certifications';

export function CertificationsSection() {
  const [selectedCert, setSelectedCert] = useState<{ image: string; title: string } | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    if (selectedCert) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedCert]);

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
            className="group flex items-center gap-3 cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            onClick={() => setSelectedCert({ image: cert.image, title: cert.title })}
          >
            <div className="flex-shrink-0 h-8 w-8 rounded-md overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-card-bg-dark">
              <Image
                src={`/images/certifications/${cert.image}`}
                alt={cert.title}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate group-hover:text-accent-pink transition-colors">
                {cert.title}
              </p>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                {cert.issuer} · {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={selectedCert.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              className="relative max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
              <Image
                src={`/images/certifications/${selectedCert.image}`}
                alt={selectedCert.title}
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
