'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, ChevronDown, ChevronUp } from 'lucide-react';
import { certifications } from '@/data/certifications';

const ISSUERS = ['All', ...Array.from(new Set(certifications.map((c) => c.issuer)))];
const INITIAL_COUNT = 6;

export function CertificationsSection() {
  const [selectedCert, setSelectedCert] = useState<{ image: string; title: string } | null>(null);
  const [activeIssuer, setActiveIssuer] = useState('All');
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(
    () => activeIssuer === 'All' ? certifications : certifications.filter((c) => c.issuer === activeIssuer),
    [activeIssuer]
  );

  const visibleCerts = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  useEffect(() => {
    setExpanded(false);
  }, [activeIssuer]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    if (selectedCert) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedCert]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Award className="h-4 w-4 text-accent-pink" />
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Certifications
        </h2>
        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-accent-pink/10 text-accent-pink">
          {certifications.length}
        </span>
      </div>

      {/* Issuer filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {ISSUERS.map((issuer) => (
          <button
            key={issuer}
            onClick={() => setActiveIssuer(issuer)}
            className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-all duration-200 ${
              activeIssuer === issuer
                ? 'bg-accent-pink text-white shadow-sm shadow-accent-pink/25'
                : 'bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-accent-pink/10 hover:text-accent-pink border border-border-light dark:border-border-dark'
            }`}
          >
            {issuer === 'All' ? `All (${certifications.length})` : issuer}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {visibleCerts.map((cert, index) => (
          <motion.div
            key={`${cert.title}-${cert.issuer}`}
            className="group flex items-center gap-3 cursor-pointer p-2 -mx-2 rounded-lg hover:bg-accent-pink/5 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            onClick={() => setSelectedCert({ image: cert.image, title: cert.title })}
          >
            <div className="flex-shrink-0 h-9 w-9 rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <Image
                src={`/images/certifications/${cert.image}`}
                alt={cert.title}
                width={36}
                height={36}
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

      {/* Expand / Collapse */}
      {hasMore && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 mx-auto mt-3 text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
        >
          {expanded ? (
            <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
          ) : (
            <>View all {filtered.length} certs <ChevronDown className="h-3.5 w-3.5" /></>
          )}
        </button>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
                className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <Image
                src={`/images/certifications/${selectedCert.image}`}
                alt={selectedCert.title}
                width={800}
                height={600}
                sizes="(max-width: 768px) 100vw, 672px"
                className="w-full h-auto rounded-lg"
              />
              <p className="text-center text-sm font-medium text-white/90 mt-3">
                {selectedCert.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
