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
      'full-time': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'contract': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'freelance': 'bg-green-500/20 text-green-400 border-green-500/30',
      'internship': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
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
        <div className="absolute left-8 -top-8 w-0.5 h-8 bg-gradient-to-b from-accent/50 to-border"></div>
      )}
      
      {/* Enhanced Timeline dot with pulse effect for current position */}
      <div className="absolute left-6 top-8 z-10">
        <div className={`w-6 h-6 ${isCurrentPosition ? 'bg-gradient-to-r from-accent to-primary' : 'bg-accent'} rounded-full border-4 border-background shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {isCurrentPosition && (
            <div className="absolute inset-0 w-6 h-6 bg-accent rounded-full animate-ping opacity-75"></div>
          )}
        </div>
        <div className="absolute inset-0 w-6 h-6 flex items-center justify-center">
          <Briefcase className="w-3 h-3 text-white" />
        </div>
      </div>
      
      {/* Enhanced Card content */}
      <div className="ml-16 glass-card p-6 hover:scale-[1.02] transition-all duration-300 group-hover:shadow-xl">
        <div className="flex flex-col gap-6">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
                  {experience.position}
                </h3>
                {isCurrentPosition && (
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Current
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-lg font-semibold text-secondary">{experience.company}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(experience.employmentType)}`}>
                  {experience.employmentType.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="font-medium">{experience.duration.displayDuration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{experience.location}</span>
                </div>
              </div>
            </div>

            {/* Performance Rating */}
            <div className="glass-card p-4 text-center min-w-[120px]">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <div className="text-xs text-secondary">Excellence Rating</div>
            </div>
          </div>

          {/* Enhanced Key Achievements */}
          <div className="bg-gradient-to-r from-accent/5 to-primary/5 p-4 rounded-xl border border-accent/20">
            <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
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
                  className="text-sm text-secondary flex items-start gap-3 group/item"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-accent to-primary rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                  <span className="leading-relaxed">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Metrics with Icons */}
          {experience.metrics && Object.keys(experience.metrics).length > 0 && (
            <div className="glass-card p-5 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
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
                      className="text-center p-3 bg-surface/50 rounded-lg hover:bg-surface transition-colors group/metric"
                    >
                      <div className="text-2xl font-bold text-accent mb-1 group-hover/metric:scale-110 transition-transform">
                        {value}
                      </div>
                      <div className="text-xs text-secondary font-medium">
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
            <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
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
                  className="px-3 py-1 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 text-accent text-xs font-medium rounded-full hover:scale-105 hover:bg-gradient-to-r hover:from-accent/20 hover:to-primary/20 transition-all cursor-default"
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
    <section className="py-20 bg-gradient-to-br from-background via-surface to-background relative overflow-hidden" id="experience">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="glass-card p-8 inline-block">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-full mb-6"
            >
              <Briefcase className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary">Professional Journey</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Experience Timeline
              </span>
            </h2>
            
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              A journey through innovative projects, impactful solutions, and continuous growth 
              in the ever-evolving world of technology.
            </p>

            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-accent to-primary text-white font-medium rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-4 h-4" />
              View Full Resume
            </motion.a>
          </div>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Main timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-accent opacity-30"></div>
          
          <div className="space-y-12">
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
            className="absolute left-6 bottom-0 w-6 h-6 bg-gradient-to-r from-accent to-primary rounded-full border-4 border-background shadow-lg flex items-center justify-center"
          >
            <Star className="w-3 h-3 text-white" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
