'use client';

import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  TrendingUp, 
  Award,
  Star,
  Target
} from 'lucide-react';
import { experienceData, ExperienceData } from '@/data/experience';

interface ExperienceCardProps {
  experience: ExperienceData;
  index: number;
}

const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  const getTypeColor = (type: string) => {
    const colors = {
      'full-time': 'text-blue-500 bg-blue-500/10 border-blue-500/30',
      'contract': 'text-purple-500 bg-purple-500/10 border-purple-500/30',
      'freelance': 'text-green-500 bg-green-500/10 border-green-500/30',
      'internship': 'text-orange-500 bg-orange-500/10 border-orange-500/30'
    };
    return colors[type as keyof typeof colors] || colors['full-time'];
  };

  const isCurrentPosition = index === 0; // Assuming first item is current

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative group"
    >
      {/* Enhanced Timeline line */}
      {index > 0 && (
        <div className="absolute left-8 -top-4 w-0.5 h-4 bg-gradient-to-b from-[var(--color-accent)]/50 to-[var(--color-border)]"></div>
      )}
      
      {/* Enhanced Timeline dot with pulse effect for current position */}
      <div className="absolute left-6 top-8 z-10">
        <div className={`w-6 h-6 ${isCurrentPosition ? 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)]' : 'bg-[var(--color-accent)]'} rounded-full border-4 border-[var(--color-background)] shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {isCurrentPosition && (
            <div className="absolute inset-0 w-6 h-6 bg-[var(--color-accent)] rounded-full animate-ping opacity-75"></div>
          )}
        </div>
        <div className="absolute inset-0 w-6 h-6 flex items-center justify-center">
          <Briefcase className="w-3 h-3 text-white" />
        </div>
      </div>
      
      {/* Enhanced Card content */}
      <div className="ml-16 glass-card card-compact hover:scale-[1.01] transition-all duration-300">
        <div className="flex flex-col gap-6">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="body-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  {experience.position}
                </h3>
                {isCurrentPosition && (
                  <span className="chip chip-success">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                    Current
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="body-base font-semibold text-[var(--color-text-secondary)]">{experience.company}</span>
                <span className={`px-3 py-1 rounded-full body-xs font-semibold border ${getTypeColor(experience.employmentType)}`}>
                  {experience.employmentType.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 body-sm text-[var(--color-text-muted)]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="font-medium">{experience.duration.displayDuration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>{experience.location}</span>
                </div>
              </div>
            </div>

            {/* Performance Rating */}
            <div className="glass-card card-compact text-center min-w-[120px]">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                ))}
              </div>
              <div className="body-xs text-[var(--color-text-secondary)]">Excellence Rating</div>
            </div>
          </div>

          {/* Enhanced Key Achievements */}
          <div className="glass-card card-compact">
            <h4 className="body-sm font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--color-accent)]" />
              Key Achievements & Impact
            </h4>
            <div className="space-y-3">
              {experience.achievements.map((achievement, achievementIndex) => (
                <motion.div 
                  key={achievementIndex} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: achievementIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="body-sm text-[var(--color-text-secondary)] flex items-start gap-3 group/item"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                  <span className="leading-relaxed">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Metrics with Icons */}
          {experience.metrics && Object.keys(experience.metrics).length > 0 && (
            <div className="glass-card card-compact">
              <h4 className="body-sm font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--color-accent)]" />
                Impact Metrics & Results
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(experience.metrics).map(([key, value], metricIndex) => (
                  value && (
                    <motion.div 
                      key={metricIndex} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: metricIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center p-3 bg-[var(--color-surface-light)]/50 rounded-lg hover:bg-[var(--color-surface-light)] transition-colors group/metric"
                    >
                      <div className="body-lg font-bold text-[var(--color-accent)] mb-1 group-hover/metric:scale-110 transition-transform">
                        {value}
                      </div>
                      <div className="body-xs text-[var(--color-text-secondary)] font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                    </motion.div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Technologies */}
          <div>
            <h4 className="body-sm font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--color-accent)]" />
              Technologies & Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech, techIndex) => (
                <motion.span 
                  key={techIndex} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                  viewport={{ once: true }}
                  className="chip chip-primary hover:scale-105 transition-all cursor-default"
                >
                  {tech}
                </motion.span>
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
    <section className="card relative overflow-hidden" id="experience">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-primary)]/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/10 rounded-full blur-3xl translate-y-24 -translate-x-24" />
      </div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="heading-md text-[var(--color-text-primary)]">Professional Experience</h2>
              <p className="body-sm text-[var(--color-text-muted)]">Career journey and key achievements</p>
            </div>
          </div>

          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Full Resume
          </motion.a>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Main timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-primary)] to-[var(--color-accent)] opacity-30"></div>
          
          <div className="space-y-8">
            {experienceData.map((experience, index) => (
              <ExperienceCard
                key={experience._id}
                experience={experience}
                index={index}
              />
            ))}
          </div>

          {/* Timeline end marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute left-6 bottom-0 w-6 h-6 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] rounded-full border-4 border-[var(--color-background)] shadow-lg flex items-center justify-center"
          >
            <Star className="w-3 h-3 text-white" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
