'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { certifications } from '@/data/certifications';

const ISSUERS = ['All', ...Array.from(new Set(certifications.map((c) => c.issuer)))];

export function CertificationsSection() {
  const [selectedCert, setSelectedCert] = useState<{ image: string; title: string } | null>(null);
  const [activeIssuer, setActiveIssuer] = useState('All');

  const filtered = useMemo(
    () => activeIssuer === 'All' ? certifications : certifications.filter((c) => c.issuer === activeIssuer),
    [activeIssuer]
  );

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
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
        Certifications ({certifications.length})
      </h2>

      {/* Issuer filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {ISSUERS.map((issuer) => (
          <button
            key={issuer}
            onClick={() => setActiveIssuer(issuer)}
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors ${
              activeIssuer === issuer
                ? 'bg-accent-pink text-white'
                : 'bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20'
            }`}
          >
            {issuer === 'All' ? `All (${certifications.length})` : issuer}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide">
        {filtered.map((cert, index) => (
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
                sizes="(max-width: 768px) 100vw, 672px"
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
