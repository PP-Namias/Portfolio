'use client';

import { personalInfo } from '@/data/personal';
import { motion } from 'framer-motion';

export function AboutCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">About Me</h2>
      </div>
      
      <div className="card-content">
        {/* About Summary */}
        <div className="mb-4">
          {personalInfo.about.summary.map((paragraph: string, index: number) => (
            <p key={index} className="body-base mb-3">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Current Focus */}
        <div className="mb-4">
          <h3 className="heading-5 mb-2">Current Focus</h3>
          <p className="body-base text-accent">
            {personalInfo.about.currentFocus}
          </p>
        </div>

        {/* Specializations */}
        <div className="mb-4">
          <h3 className="heading-5 mb-2">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {personalInfo.about.specializations.slice(0, 4).map((specialization: string, index: number) => (
              <span key={index} className="badge badge-default">
                {specialization}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-2">
          <div className="text-center">
            <div className="heading-3 text-accent">
              {personalInfo.about.yearsOfExperience}+
            </div>
            <div className="body-small">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="heading-3 text-accent">
              200K+
            </div>
            <div className="body-small">Developers Community</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
