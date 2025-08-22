'use client';

import { experienceCollection, type ExperienceData } from '@/data/experience';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, ChevronRight } from 'lucide-react';

export function ExperienceTimeline() {
  // Get recent experiences (first 4)
  const recentExperiences = experienceCollection.experiences?.slice(0, 4) || [];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">Professional Experience</h2>
      </div>
      
      <div className="card-content">
        {recentExperiences.length > 0 ? (
          <div className="space-y-6">
            {recentExperiences.map((experience, index: number) => (
              <motion.div
                key={experience._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 border-l-2 border-accent/30 last:border-l-0"
              >
                {/* Timeline dot */}
                <div className="absolute -left-2 top-2 w-4 h-4 bg-accent rounded-full border-2 border-card-bg"></div>
                
                <div className="pb-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="heading-5 mb-1">{experience.position}</h3>
                      <div className="flex items-center gap-2 text-secondary">
                        <Briefcase size={14} />
                        <span className="body-small">{experience.company}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1">
                      <div className="flex items-center gap-1 text-muted">
                        <Calendar size={14} />
                        <span className="body-xs">
                          {formatDate(experience.startDate)} - {
                            experience.current ? 'Present' : formatDate(experience.endDate || '')
                          }
                        </span>
                      </div>
                      {experience.location && (
                        <div className="flex items-center gap-1 text-muted">
                          <MapPin size={14} />
                          <span className="body-xs">{experience.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="body-base text-secondary mb-4 line-clamp-2">
                    {experience.description}
                  </p>

                  {/* Key Achievements */}
                  {experience.achievements && experience.achievements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="heading-6 mb-2">Key Achievements</h4>
                      <ul className="space-y-1">
                        {experience.achievements.slice(0, 3).map((achievement: string, achIndex: number) => (
                          <li key={achIndex} className="flex items-start gap-2 body-small text-secondary">
                            <ChevronRight size={14} className="text-accent mt-0.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies */}
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.slice(0, 5).map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {experience.technologies.length > 5 && (
                        <span className="px-2 py-1 bg-muted/20 text-muted text-xs rounded-md">
                          +{experience.technologies.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <Briefcase size={24} className="text-muted" />
            </div>
            <p className="body-base text-muted">No experience data available at the moment.</p>
          </div>
        )}

        {/* Summary */}
        {recentExperiences.length > 0 && experienceCollection.totalExperience && (
          <div className="mt-8 pt-6 border-t border-subtle">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="heading-3 text-accent">{experienceCollection.totalExperience.years || 0}+</div>
                <div className="body-small">Years Experience</div>
              </div>
              <div>
                <div className="heading-3 text-accent">{experienceCollection.experiences?.length || 0}</div>
                <div className="body-small">Companies</div>
              </div>
              <div>
                <div className="heading-3 text-accent">
                  {experienceCollection.experiences?.reduce((total, exp) => total + (exp.metrics?.projectsCompleted || 0), 0) || 0}+
                </div>
                <div className="body-small">Projects</div>
              </div>
              <div>
                <div className="heading-3 text-accent">
                  {experienceCollection.experiences?.some(exp => exp.current) ? 'Active' : 'Available'}
                </div>
                <div className="body-small">Status</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
