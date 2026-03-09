'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp } from 'lucide-react';
import { galleryImages } from '@/data/gallery';

const INITIAL_COUNT = 9;
const FILTER_TAGS = ['All', ...Array.from(new Set(galleryImages.flatMap((img) => img.tags.filter((t) => !/^\d{4}$/.test(t))).sort()))];

// Assigns span classes for visual variety — only the first image gets 2x2, rest are 1x1
// This avoids gaps in the dense grid while still giving a hero treatment
function getSpanClass(index: number): string {
  if (index === 0) return 'col-span-2 row-span-2';
  return '';
}

export function GallerySection() {
  const [activeTag, setActiveTag] = useState('All');
  const [expanded, setExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => activeTag === 'All' ? galleryImages : galleryImages.filter((img) => img.tags.includes(activeTag)),
    [activeTag]
  );

  const visibleImages = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  // Reset expansion when filter changes
  useEffect(() => {
    setExpanded(false);
  }, [activeTag]);

  // Lightbox navigation
  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < filtered.length - 1) ? prev + 1 : 0);
  }, [selectedIndex, filtered.length]);

  const goToPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0) ? prev - 1 : filtered.length - 1);
  }, [selectedIndex, filtered.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [selectedIndex, goToNext, goToPrev]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedIndex]);

  const selectedImage = selectedIndex !== null ? filtered[selectedIndex] : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Header */}
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Gallery
        <span className="text-xs font-medium px-1.5 py-0.5 rounded-md bg-accent-pink/10 text-accent-pink ml-2 align-middle">
          {filtered.length}
        </span>
      </h2>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-200 ${
              activeTag === tag
                ? 'bg-accent-pink text-white shadow-sm shadow-accent-pink/25'
                : 'bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-accent-pink/10 hover:text-accent-pink border border-border-light dark:border-border-dark'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Masonry-style grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 auto-rows-[150px] sm:auto-rows-[170px]" style={{ gridAutoFlow: 'dense' }}>
        <AnimatePresence mode="popLayout">
          {visibleImages.map((image, index) => {
            const globalIndex = filtered.indexOf(image);
            const spanClass = getSpanClass(index);
            return (
              <motion.button
                key={image.media}
                layout
                type="button"
                onClick={() => setSelectedIndex(globalIndex)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`relative rounded-xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-pink focus:ring-offset-2 dark:focus:ring-offset-background-dark ${spanClass}`}
              >
                <Image
                  src={`/images/gallery/${image.media}`}
                  alt={image.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out brightness-[0.95] group-hover:brightness-100"
                />
                {/* Hover overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <span className="text-xs font-medium text-white leading-snug line-clamp-2 drop-shadow-sm">
                    {image.title}
                  </span>
                  {image.createdAt && (
                    <span className="text-[11px] text-white/70 mt-0.5">
                      {new Date(image.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expand / Collapse button */}
      {hasMore && (
        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="flex items-center gap-1 text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
          >
            {expanded ? (
              <>Show Less <ChevronUp className="h-3.5 w-3.5" /></>
            ) : (
              <>View all {filtered.length} photos <ChevronDown className="h-3.5 w-3.5" /></>
            )}
          </button>
        </motion.div>
      )}

      {/* Lightbox with prev/next navigation */}
      <AnimatePresence>
        {selectedImage && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.title}
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[12px] text-white/60 font-medium">
              {selectedIndex + 1} / {filtered.length}
            </div>

            {/* Previous button */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              className="absolute left-2 sm:left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 sm:right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Image + caption */}
            <motion.div
              key={selectedImage.media}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl w-full px-12 sm:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={`/images/gallery/${selectedImage.media}`}
                alt={selectedImage.title}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 900px"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                priority
              />
              <div className="text-center mt-4">
                <p className="text-sm font-medium text-white/90">
                  {selectedImage.title}
                </p>
                {selectedImage.createdAt && (
                  <p className="text-xs text-white/50 mt-1">
                    {new Date(selectedImage.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
