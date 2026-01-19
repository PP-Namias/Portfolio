import { motion } from 'framer-motion';
import { Chip } from '@heroui/react';
import { Resume } from './resume-container';
import { MapPin, Briefcase, Calendar } from 'lucide-react';

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
}

interface ProfessionalExperienceProps {
  experiences: Experience[];
}

export const ProfessionalExperience = ({ 
  experiences 
}: ProfessionalExperienceProps) => {
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
            {experiences.map((experience, index) => (
              <motion.div
                key={`${experience.company}-${experience.startedAt}`}
                className="relative pl-8 experience-item page-break-inside-avoid"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-1 timeline-dot">
                  <div className={`w-4 h-4 rounded-full border-2 border-resume-accent ${
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
                <div className="space-y-3">
                  {/* Company Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-resume-primary company">
                        {experience.company}
                      </h3>
                      <p className="text-lg font-medium text-resume-accent">
                        {experience.position}
                      </p>
                    </div>
                    
                    <div className="flex flex-col md:items-end gap-1 text-sm text-resume-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDateRange(experience.startedAt, experience.endedAt)}
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

                  {/* Summary */}
                  <p className="text-sm leading-6 text-resume-primary">
                    {experience.summary}
                  </p>

                  {/* Highlights */}
                  {experience.highlights && experience.highlights.length > 0 && (
                    <ul className="space-y-2 text-sm text-resume-primary">
                      {experience.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="flex gap-2">
                          <span className="text-resume-accent mt-1">•</span>
                          <span className="flex-1 leading-6">{highlight}</span>
                        </li>
                      ))}
                    </ul>
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
                          className="text-xs"
                        >
                          {tech}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Resume.Section>
  );
};
