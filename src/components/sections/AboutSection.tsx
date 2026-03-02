'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/data/profile';

export function AboutSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        About
      </h2>
      <div className="space-y-4">
        <motion.p
          className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          {profile.summary}
        </motion.p>

        {/* Education */}
        {profile.education.map((edu, index) => (
          <motion.div
            key={index}
            className="mt-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
              {edu.degree}
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {edu.institution} — {edu.location}
            </p>
            {edu.honors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {edu.honors.map((honor) => (
                  <span
                    key={honor}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink"
                  >
                    {honor}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {/* Highlights */}
        <motion.div
          className="flex flex-wrap gap-4 mt-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="text-center">
            <p className="text-lg font-bold text-accent-pink">{profile.highlights.yearsExperience}+</p>
            <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark">Years Exp.</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent-pink">{profile.highlights.projectsCompleted}+</p>
            <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark">Projects</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
