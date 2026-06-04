'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCmsContent } from '@/hooks/useCmsContent';

export function AboutSection() {
  const { profile, about } = useCmsContent();
  const [showMore, setShowMore] = useState(false);
  const fallbackParagraphs = profile.summary
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const paragraphs = about.paragraphs.length > 0 ? about.paragraphs : fallbackParagraphs;

  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 id="about-heading" className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-pink border-b border-border-light dark:border-border-dark pb-2 mb-3.5">
        About
      </h2>
      <div className="space-y-4">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          {(showMore ? paragraphs : paragraphs.slice(0, 2)).map((paragraph) => (
            <p
              key={paragraph}
              className="text-[14px] sm:text-[15px] text-text-secondary-light dark:text-text-secondary-dark leading-[1.75]"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        {paragraphs.length > 2 && (
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1 text-[13px] font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
          >
            {showMore ? (
              <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
            ) : (
              <>Read more <ChevronDown className="h-3.5 w-3.5" /></>
            )}
          </button>
        )}
      </div>
    </motion.section>
  );
}
