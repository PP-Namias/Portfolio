'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { galleryImages } from '@/data/gallery';

const IMAGES_PER_SLIDE = 5;

export function GallerySection() {
  const totalSlides = Math.ceil(galleryImages.length / IMAGES_PER_SLIDE);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedImage, setSelectedImage] = useState<{ media: string; title: string } | null>(null);

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
          Gallery{' '}
          <span className="text-xs font-normal text-text-muted-light dark:text-text-muted-dark">
            ({galleryImages.length})
          </span>
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
            <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
              {currentSlide + 1} / {totalSlides}
            </span>
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
              <button
                key={image.media}
                type="button"
                onClick={() => setSelectedImage(image)}
                className="aspect-square rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-card-bg-dark group relative cursor-pointer"
              >
                <Image
                  src={`/images/gallery/${image.media}`}
                  alt={image.title}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end p-1.5">
                  <span className="text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight line-clamp-2">
                    {image.title}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6" />
              </button>
              <Image
                src={`/images/gallery/${selectedImage.media}`}
                alt={selectedImage.title}
                width={800}
                height={600}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <p className="text-center text-sm text-white/80 mt-3">
                {selectedImage.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
