'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { profile } from '@/data/profile';

export function AboutSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
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
        {profile.education.map((edu, index) => {
          const startYear = new Date(edu.startedAt).getFullYear();
          const endLabel = edu.endedAt ? new Date(edu.endedAt).getFullYear() : 'Present';
          return (
            <motion.div
              key={index}
              className="mt-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 text-accent-pink mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    {edu.degree}
                  </p>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    {edu.institution} — {edu.location}
                  </p>
                  <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-0.5">
                    {startYear} – {endLabel} · GPA: {edu.gpa}
                  </p>
                </div>
              </div>
              {edu.honors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 ml-6">
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
              {edu.relevantCourses.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 ml-6">
                  {edu.relevantCourses.map((course) => (
                    <span
                      key={course}
                      className="text-[9px] px-1.5 py-0.5 rounded-full border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}

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
