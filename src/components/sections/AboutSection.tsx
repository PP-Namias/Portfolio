'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { profile } from '@/data/profile';

export function AboutSection() {
  const [showMore, setShowMore] = useState(false);
  const paragraphs = profile.summary.split('\n\n');

  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3.5">
        About
      </h2>
      <div className="space-y-4">
        {/* Summary text — capped at 2 paragraphs with Read more */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          {(showMore ? paragraphs : paragraphs.slice(0, 2)).map((paragraph, i) => (
            <p
              key={`${paragraph.slice(0, 16)}-${i}`}
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

        {/* Education */}
        {profile.education.map((edu, index) => {
          const startYear = new Date(edu.startedAt).getFullYear();
          const endLabel = edu.endedAt ? new Date(edu.endedAt).getFullYear() : 'Present';
          return (
            <motion.div
              key={`${edu.institution}-${edu.degree}-${edu.startedAt}-${index}`}
              className="mt-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 text-accent-pink mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[15px] font-medium text-text-primary-light dark:text-text-primary-dark leading-snug">
                    {edu.degree}
                  </p>
                  <p className="text-[12px] sm:text-xs text-text-muted-light dark:text-text-muted-dark">
                    {edu.institution} — {edu.location}
                  </p>
                  <p className="text-[12px] sm:text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                    {startYear} – {endLabel} · GWA: {edu.gpa}
                  </p>
                </div>
              </div>
              {edu.honors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 ml-6">
                  {edu.honors.map((honor) => (
                    <span
                      key={honor}
                      className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink"
                    >
                      {honor}
                    </span>
                  ))}
                </div>
              )}

            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
