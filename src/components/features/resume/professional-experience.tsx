import { useState } from 'react';
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion';
import { Chip } from '@heroui/react';
import { Resume } from './resume-container';
import { MapPin, Briefcase, Calendar, ChevronDown, ChevronUp, Award, FolderOpen, Clock, ExternalLink } from 'lucide-react';
import { calculateDuration } from '@/utilities/duration';
import { ProjectPreviewModal } from './project-preview-modal';
import { useRef } from 'react';

interface Project {
  title: string;
  image: string;
  description: string;
  repositoryURL: string | null;
  liveURL: string | null;
  processURL: string | null;
  tags: string[];
  year: number;
}

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
  projects?: Project[];
}

// Animation variants for enhanced timeline
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30, y: 10 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 100,
    },
  },
};

const timelineDotVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      damping: 15,
      stiffness: 200,
      delay: 0.2,
    },
  },
};

const timelineLineVariants: Variants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
      delay: 0.3,
    },
  },
};

export const ProfessionalExperience = ({ 
  experiences,
  projects = [],
}: ProfessionalExperienceProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  // Track expanded state for each experience
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    // Initialize all items as expanded by default
    const initial: Record<string, boolean> = {};
    experiences.forEach((exp) => {
      initial[`${exp.company}-${exp.startedAt}`] = true;
    });
    return initial;
  });

  // Project preview modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Find project by title
  const findProjectByTitle = (title: string): Project | undefined => {
    return projects.find(p => 
      p.title.toLowerCase().includes(title.toLowerCase()) ||
      title.toLowerCase().includes(p.title.toLowerCase())
    );
  };

  // Open project preview
  const openProjectPreview = (projectTitle: string) => {
    const project = findProjectByTitle(projectTitle);
    if (project) {
      setSelectedProject(project);
      setIsModalOpen(true);
    }
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

      <div ref={sectionRef} className="relative" aria-label="Professional experience timeline">
        {experiences.length === 0 ? (
          <p className="text-sm text-resume-secondary">No experience to display</p>
        ) : (
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {experiences.map((experience, index) => {
              const itemKey = `${experience.company}-${experience.startedAt}`;
              const isExpanded = expandedItems[itemKey] ?? true;

              return (
                <motion.div
                  key={itemKey}
                  className="relative pl-8 experience-item page-break-inside-avoid group"
                  variants={itemVariants}
                >
                  {/* Timeline Dot */}
                  <motion.div 
                    className="absolute left-0 top-1 timeline-dot"
                    variants={timelineDotVariants}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 border-resume-accent transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-resume-accent/30 ${
                      experience.endedAt === null 
                        ? 'bg-resume-accent animate-pulse' 
                        : 'bg-resume-bg dark:bg-resume-background-alt'
                    }`} />
                  </motion.div>

                  {/* Timeline Line */}
                  {index < experiences.length - 1 && (
                    <motion.div 
                      className="absolute left-[7px] top-5 w-[2px] h-[calc(100%+2rem)] bg-gradient-to-b from-resume-accent to-resume-border timeline-line" 
                      variants={timelineLineVariants}
                    />
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
                                {experience.relatedProjects.map((project, projIndex) => {
                                  const hasProject = findProjectByTitle(project);
                                  return (
                                    <Chip
                                      key={projIndex}
                                      size="sm"
                                      variant="bordered"
                                      color="secondary"
                                      className={`text-xs transition-all duration-200 ${
                                        hasProject 
                                          ? 'cursor-pointer hover:bg-resume-accent/20 hover:border-resume-accent hover:scale-105' 
                                          : 'cursor-default'
                                      }`}
                                      endContent={hasProject ? <ExternalLink size={10} /> : undefined}
                                      onClick={() => hasProject && openProjectPreview(project)}
                                      data-testid="project-chip"
                                    >
                                      {project}
                                    </Chip>
                                  );
                                })}
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
          </motion.div>
        )}
      </div>

      {/* Project Preview Modal */}
      <ProjectPreviewModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </Resume.Section>
  );
};
