'use client';

import { experienceData, type ExperienceData } from '@/data/experience';
import { motion } from 'framer-motion';

export function ExperienceSection() {
  const sortedExperience = experienceData
    .sort((a: ExperienceData, b: ExperienceData) => b.order - a.order)
    .slice(0, 4); // Show top 4 most recent experiences

  return (
    <section id="experience" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-2 text-center mb-2xl">Experience</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 md:left-1/2 md:-translate-x-0.5"></div>
              
              {/* Experience Items */}
              <div className="space-y-12">
                {sortedExperience.map((experience, index) => (
                  <motion.div
                    key={experience._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-8 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 md:left-1/2 md:-translate-x-1/2 z-10"></div>
                    
                    {/* Content */}
                    <div className={`ml-16 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                    }`}>
                      <div className="card">
                        {/* Company & Position */}
                        <div className="mb-lg">
                          <h3 className="heading-4 mb-sm">{experience.position}</h3>
                          <div className="flex items-center gap-2 mb-sm">
                            <span className="body-base font-medium text-blue-600">
                              {experience.company}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="body-small">{experience.location}</span>
                          </div>
                          <p className="body-small text-gray-600 dark:text-gray-400">
                            {experience.duration.displayDuration}
                          </p>
                        </div>
                        
                        {/* Description */}
                        <p className="body-base mb-lg">{experience.description}</p>
                        
                        {/* Key Achievements (max 3) */}
                        {experience.achievements.length > 0 && (
                          <div className="space-y-2">
                            {experience.achievements.slice(0, 3).map((achievement: string, achievementIndex: number) => (
                              <div key={achievementIndex} className="flex items-start gap-2">
                                <div className="w-1-5 h-1-5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="body-small">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Technologies */}
                        {experience.technologies.length > 0 && (
                          <div className="mt-lg">
                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.slice(0, 6).map((tech, techIndex) => (
                                <span key={techIndex} className="chip">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
