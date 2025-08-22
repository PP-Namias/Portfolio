'use client';

import { personalInfo } from '@/data/personal';
import { motion } from 'framer-motion';

export function AboutCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          About
        </h2>
      </div>

      <div className="card-content">
        {/* Professional Summary */}
        <div className="space-y-4 mb-6">
          {personalInfo.about.summary.map((paragraph, index) => (
            <p key={index} className="body-base">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Key Specializations */}
        <div className="mb-6">
          <h3 className="heading-4 mb-3">Specializations</h3>
          <div className="grid grid-cols-1 gap-3">
            {personalInfo.about.specializations.slice(0, 4).map((specialization, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="body-base">{specialization}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Focus */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-medium text-blue-400 mb-2">Current Focus</h4>
          <p className="body-small text-blue-300">
            {personalInfo.about.currentFocus}
          </p>
        </div>
      </div>

      {/* Metrics Footer */}
      <div className="card-footer">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="heading-3 text-accent">
              {personalInfo.about.yearsOfExperience}+
            </div>
            <div className="body-small">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="heading-3 text-accent">
              {personalInfo.about.metrics.projectsCompleted}+
            </div>
            <div className="body-small">Projects Completed</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
