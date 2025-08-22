'use client';

import { experienceData, type ExperienceData } from '@/data/experience';
import { motion } from 'framer-motion';

export function ExperienceTimeline() {
  const recentExperiences = experienceData
    .sort((a: ExperienceData, b: ExperienceData) => b.order - a.order)
    .slice(0, 6);

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V2a2 2 0 112 2v4m0 0a9 9 0 11-16 6c0-5.142 3.045-9.297 7-9.297S14 7.858 14 13z" />
          </svg>
          Experience
        </h2>
      </div>

      <div className="card-content">
        <div className="timeline">
          {recentExperiences.map((experience: ExperienceData, index: number) => (
            <motion.div
              key={experience._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="timeline-item"
            >
              {/* Timeline Dot */}
              <div className={`timeline-dot ${experience.current ? 'bg-green-400' : ''}`}></div>
              
              {/* Content */}
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <div className="timeline-title">{experience.position}</div>
                    <div className="timeline-company">{experience.company}</div>
                  </div>
                  <div className="timeline-duration">
                    {experience.current ? (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {experience.duration.displayDuration}
                      </div>
                    ) : (
                      experience.duration.displayDuration
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="body-small text-muted mt-2 mb-3">
                  {experience.description}
                </p>

                {/* Key Achievement */}
                {experience.achievements.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="body-small">
                        {experience.achievements[0]}
                      </span>
                    </div>
                  </div>
                )}

                {/* Technologies (show 3 max) */}
                {experience.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {experience.technologies.slice(0, 3).map((tech: string, techIndex: number) => (
                      <span key={techIndex} className="badge badge-outline text-xs">
                        {tech}
                      </span>
                    ))}
                    {experience.technologies.length > 3 && (
                      <span className="badge badge-outline text-xs">
                        +{experience.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Metrics */}
                {experience.metrics && (
                  <div className="mt-3 p-2 bg-gray-800/50 rounded text-xs">
                    {experience.metrics.teamSize && (
                      <div className="text-muted">Team: {experience.metrics.teamSize} members</div>
                    )}
                    {experience.metrics.impact && (
                      <div className="text-blue-400">{experience.metrics.impact}</div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <button className="btn btn-ghost btn-sm w-full">
          View Full Experience
        </button>
      </div>
    </motion.div>
  );
}
