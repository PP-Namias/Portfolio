'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from '@/components/ui/OptimizedImage';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useCmsContent } from '@/hooks/useCmsContent';
import { resolveContentImageSrc } from '@/lib/media';

const INITIAL_COUNT = 6;

function getCertificationImageSrc(cert: { image: string; imageUrl?: string }): string {
  if (cert.image) return cert.image;
  return resolveContentImageSrc(cert.imageUrl, { folder: 'certifications' });
}

export function CertificationsSection() {
  const { certifications } = useCmsContent();
  const [selectedCert, setSelectedCert] = useState<{ image: string; imageUrl?: string; title: string } | null>(null);
  const [activeIssuer, setActiveIssuer] = useState('All');
  const [expanded, setExpanded] = useState(false);

  const issuers = ['All', ...Array.from(new Set(certifications.map((c) => c.issuer)))];

  const filtered = useMemo(
    () => activeIssuer === 'All' ? certifications : certifications.filter((c) => c.issuer === activeIssuer),
    [activeIssuer, certifications]
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
      aria-labelledby="certifications-heading"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 id="certifications-heading" className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Certifications
      </h2>

      {/* Issuer filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {issuers.map((issuer) => (
          <button
            type="button"
            key={issuer}
            onClick={() => setActiveIssuer(issuer)}
            className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-200 ${
              activeIssuer === issuer
                ? 'bg-accent-pink text-white shadow-sm shadow-accent-pink/25'
                : 'bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-accent-pink/10 hover:text-accent-pink border border-border-light dark:border-border-dark'
            }`}
          >
            {issuer}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {visibleCerts.map((cert, index) => (
          <motion.button
            type="button"
            key={`${cert.title}-${cert.issuer}`}
            className="group relative cursor-pointer rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-left"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            onClick={() => setSelectedCert({ image: cert.image, imageUrl: cert.imageUrl, title: cert.title })}
          >
            <div className="aspect-[4/3] relative">
              {getCertificationImageSrc(cert) ? (
                <Image
                  src={getCertificationImageSrc(cert)}
                  alt={cert.title}
                  fill
                  sizes="(max-width: 640px) 45vw, 200px"
                  loading="lazy"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-light text-xs font-medium text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark">
                  No certificate image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <p className="text-[11px] font-medium text-white leading-tight line-clamp-2">
                  {cert.title}
                </p>
                <p className="text-[11px] text-white/70 mt-0.5">
                  {cert.issuer}
                </p>
              </div>
            </div>
            </motion.button>
        ))}
      </div>

      {/* Expand / Collapse */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="flex items-center gap-1 mx-auto mt-3 text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
        >
          {expanded ? (
            <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
          ) : (
            <>View all certs <ChevronDown className="h-3.5 w-3.5" /></>
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
                type="button"
                onClick={() => setSelectedCert(null)}
                className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              {getCertificationImageSrc(selectedCert) ? (
                <Image
                  src={getCertificationImageSrc(selectedCert)}
                  alt={selectedCert.title}
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 672px"
                  loading="eager"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-white/5 text-sm font-medium text-white/80">
                  No certificate image available
                </div>
              )}
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

