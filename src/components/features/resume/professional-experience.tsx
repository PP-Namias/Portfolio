import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chip } from '@heroui/react';
import { Resume } from './resume-container';
import { MapPin, Briefcase, Calendar, ChevronDown, ChevronUp, Award, FolderOpen, Clock } from 'lucide-react';
import { calculateDuration } from '@/utilities/duration';

interface Experience {
  company: string;
  position: string;
  summary: string;
  country: string;
  modality: string;
  type: string;
  startedAt: string;
  endedAt: string | null;
  technologies: string[];
  highlights: string[];
  achievements?: string[];
  relatedProjects?: string[];
}

interface ProfessionalExperienceProps {
  experiences: Experience[];
}

export const ProfessionalExperience = ({ 
  experiences 
}: ProfessionalExperienceProps) => {
  // Track expanded state for each experience
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    // Initialize all items as expanded by default
    const initial: Record<string, boolean> = {};
    experiences.forEach((exp) => {
      initial[`${exp.company}-${exp.startedAt}`] = true;
    });
    return initial;
  });

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Format date from YYYY-MM to "MMM YYYY"
  const formatDate = (dateString: string): string => {
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Format date range
  const formatDateRange = (startedAt: string, endedAt: string | null): string => {
    const start = formatDate(startedAt);
    const end = endedAt ? formatDate(endedAt) : 'Present';
    return `${start} - ${end}`;
  };

  return (
    <Resume.Section id="professional-experience">
      <Resume.Header>Professional Experience</Resume.Header>

      <div className="relative" aria-label="Professional experience timeline">
        {experiences.length === 0 ? (
          <p className="text-sm text-resume-secondary">No experience to display</p>
        ) : (
          <div className="space-y-8">
            {experiences.map((experience, index) => {
              const itemKey = `${experience.company}-${experience.startedAt}`;
              const isExpanded = expandedItems[itemKey] ?? true;

              return (
                <motion.div
                  key={itemKey}
                  className="relative pl-8 experience-item page-break-inside-avoid group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-1 timeline-dot">
                    <div className={`w-4 h-4 rounded-full border-2 border-resume-accent transition-all duration-300 group-hover:scale-110 ${
                      experience.endedAt === null 
                        ? 'bg-resume-accent' 
                        : 'bg-resume-bg dark:bg-resume-background-alt'
                    }`} />
                  </div>

                  {/* Timeline Line */}
                  {index < experiences.length - 1 && (
                    <div className="absolute left-[7px] top-5 w-[2px] h-[calc(100%+2rem)] bg-resume-border timeline-line" />
                  )}

                  {/* Experience Content */}
                  <div className="space-y-3 transition-all duration-300 hover:translate-x-1">
                    {/* Company Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-resume-primary company transition-colors duration-300 group-hover:text-resume-accent">
                            {experience.company}
                          </h3>
                          {/* Expand/Collapse Button */}
                          <button
                            onClick={() => toggleExpand(itemKey)}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                            data-testid="expand-toggle"
                            className="p-1 rounded-full hover:bg-resume-border/50 transition-colors duration-200 print:hidden"
                          >
                            {isExpanded ? (
                              <ChevronUp size={18} className="text-resume-secondary" />
                            ) : (
                              <ChevronDown size={18} className="text-resume-secondary" />
                            )}
                          </button>
                        </div>
                        <p className="text-lg font-medium text-resume-accent">
                          {experience.position}
                        </p>
                      </div>
                      
                      <div className="flex flex-col md:items-end gap-1 text-sm text-resume-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDateRange(experience.startedAt, experience.endedAt)}
                        </span>
                        {/* Duration Display */}
                        <span className="flex items-center gap-1 text-resume-accent font-medium">
                          <Clock size={14} />
                          {calculateDuration(experience.startedAt, experience.endedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {experience.country} • {experience.modality}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {experience.type}
                        </span>
                      </div>
                    </div>

                    {/* Achievement Badges */}
                    {experience.achievements && experience.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {experience.achievements.map((achievement, achIndex) => (
                          <Chip
                            key={achIndex}
                            size="sm"
                            variant="flat"
                            color="success"
                            startContent={<Award size={12} />}
                            className="text-xs font-medium"
                          >
                            {achievement}
                          </Chip>
                        ))}
                      </div>
                    )}

                    {/* Expandable Content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          {/* Summary */}
                          <p className="text-sm leading-6 text-resume-primary mb-3">
                            {experience.summary}
                          </p>

                          {/* Highlights */}
                          {experience.highlights && experience.highlights.length > 0 && (
                            <ul className="space-y-2 text-sm text-resume-primary mb-3">
                              {experience.highlights.map((highlight, highlightIndex) => (
                                <li key={highlightIndex} className="flex gap-2 transition-colors duration-200 hover:text-resume-accent">
                                  <span className="text-resume-accent mt-1">•</span>
                                  <span className="flex-1 leading-6">{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Related Projects */}
                          {experience.relatedProjects && experience.relatedProjects.length > 0 && (
                            <div className="mb-3 related-projects" data-testid="related-projects">
                              <div className="flex items-center gap-1 text-sm text-resume-secondary mb-2">
                                <FolderOpen size={14} />
                                <span className="font-medium">Related Projects:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {experience.relatedProjects.map((project, projIndex) => (
                                  <Chip
                                    key={projIndex}
                                    size="sm"
                                    variant="bordered"
                                    color="secondary"
                                    className="text-xs cursor-pointer hover:bg-resume-accent/10 transition-colors duration-200"
                                  >
                                    {project}
                                  </Chip>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Technologies */}
                          {experience.technologies && experience.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {experience.technologies.map((tech, techIndex) => (
                                <Chip
                                  key={techIndex}
                                  size="sm"
                                  variant="flat"
                                  color="primary"
                                  className="text-xs transition-transform duration-200 hover:scale-105"
                                >
                                  {tech}
                                </Chip>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Resume.Section>
  );
};
