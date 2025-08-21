'use client';

import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, ExternalLink, TrendingUp } from 'lucide-react';
import { experienceData, ExperienceData } from '@/data/experience';

interface ExperienceCardProps {
  experience: ExperienceData;
  index: number;
}

const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  const getTypeColor = (type: string) => {
    const colors = {
      'full-time': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'contract': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'freelance': 'bg-green-500/20 text-green-400 border-green-500/30',
      'internship': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[type as keyof typeof colors] || colors['full-time'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Timeline line (only show for items after the first) */}
      {index > 0 && (
        <div className="absolute left-6 -top-6 w-0.5 h-6 bg-border"></div>
      )}
      
      {/* Timeline dot */}
      <div className="absolute left-4 top-6 w-4 h-4 bg-accent rounded-full border-4 border-primary z-10"></div>
      
      {/* Card content */}
      <div className="ml-12 card hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {experience.position}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-text-secondary">{experience.company}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(experience.employmentType)}`}>
                  {experience.employmentType.replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-secondary">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {experience.duration.displayDuration}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {experience.location}
                </div>
              </div>
            </div>
          </div>

          {/* Key Achievements */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Key Achievements</h4>
            <ul className="space-y-1">
              {experience.achievements.map((achievement, achievementIndex) => (
                <li key={achievementIndex} className="text-sm text-text-secondary flex items-start gap-2">
                  <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>

          {/* Metrics */}
          {experience.metrics && Object.keys(experience.metrics).length > 0 && (
            <div className="bg-secondary/20 p-3 rounded-lg border border-border">
              <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Impact Metrics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(experience.metrics).map(([key, value], metricIndex) => (
                  value && (
                    <div key={metricIndex} className="text-center">
                      <div className="text-lg font-bold text-accent">
                        {value}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Technologies Used</h4>
            <div className="flex flex-wrap gap-1">
              {experience.technologies.map((tech, techIndex) => (
                <span key={techIndex} className="badge-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ExperienceTimeline = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="experience"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Briefcase className="w-5 h-5 mr-3 text-accent" />
          <h2 className="text-xl font-semibold text-text-primary">Experience</h2>
        </div>
        <button className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
          View Resume
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="relative space-y-8">
        {experienceData.map((experience, index) => (
          <ExperienceCard
            key={experience._id}
            experience={experience}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
};
