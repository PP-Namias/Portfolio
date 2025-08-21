'use client';

import { motion } from 'framer-motion';
import { User, Target } from 'lucide-react';
import { personalInfo } from '@/data/personal';

export const AboutSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="about"
    >
      <div className="flex items-center mb-6">
        <User className="w-5 h-5 mr-3 text-accent" />
        <h2 className="text-xl font-semibold text-primary">About</h2>
      </div>

      <div className="space-y-6">
        {/* Professional Summary */}
        <div className="space-y-4">
          {personalInfo.about.summary.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-secondary">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-default">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {personalInfo.about.yearsOfExperience}+
            </div>
            <div className="text-xs text-muted">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {personalInfo.about.metrics.projectsCompleted}+
            </div>
            <div className="text-xs text-muted">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {personalInfo.about.metrics.teamsLed}+
            </div>
            <div className="text-xs text-muted">Teams Led</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {personalInfo.about.metrics.certifications}+
            </div>
            <div className="text-xs text-muted">Certifications</div>
          </div>
        </div>

        {/* Current Focus */}
        <div className="bg-secondary/20 p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Target className="w-4 h-4 mr-2 text-accent" />
            <span className="text-sm font-medium text-text-primary">Current Focus</span>
          </div>
          <p className="text-sm text-text-secondary">
            {personalInfo.about.currentFocus}
          </p>
        </div>

        {/* Specializations */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {personalInfo.about.specializations.map((spec, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.05 }}
                className="badge"
              >
                {spec}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
