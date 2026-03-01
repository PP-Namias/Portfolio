'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages } from '@/data/gallery';

const IMAGES_PER_SLIDE = 5;

export function GallerySection() {
  const totalSlides = Math.ceil(galleryImages.length / IMAGES_PER_SLIDE);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const currentImages = galleryImages.slice(
    currentSlide * IMAGES_PER_SLIDE,
    (currentSlide + 1) * IMAGES_PER_SLIDE
  );

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

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
          Gallery
        </h2>
        {totalSlides > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={goPrev}
              disabled={currentSlide === 0}
              className="rounded-lg p-1.5 transition-colors duration-200 hover:bg-surface-light dark:hover:bg-surface-dark text-text-muted-light dark:text-text-muted-dark disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous gallery slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goNext}
              disabled={currentSlide === totalSlides - 1}
              className="rounded-lg p-1.5 transition-colors duration-200 hover:bg-surface-light dark:hover:bg-surface-dark text-text-muted-light dark:text-text-muted-dark disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next gallery slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="grid grid-cols-3 sm:grid-cols-5 gap-2"
          >
            {currentImages.map((image) => (
              <div
                key={image.id}
                className="aspect-square rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-card-bg-dark"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
