import { motion } from 'framer-motion';
import { Chip, Button } from '@heroui/react';
import { ExternalLink, Github, Calendar } from 'lucide-react';

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

interface ProjectCardProps {
  project: Project;
  variant?: 'grid' | 'list';
  onClick?: () => void;
}

export const ProjectCard = ({ 
  project, 
  variant = 'grid',
  onClick 
}: ProjectCardProps) => {
  const maxTags = variant === 'list' ? 8 : 5;
  const visibleTags = project.tags.slice(0, maxTags);
  const remainingTagsCount = project.tags.length - maxTags;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if clicking on links or buttons
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    onClick?.();
  };

  return (
    <motion.article
      className={`
        project-card 
        bg-resume-bg-alt 
        border border-resume-border 
        rounded-lg 
        p-6 
        space-y-3
        transition-all 
        duration-300
        hover:scale-105 
        hover:shadow-lg
        hover:border-resume-accent
        page-break-inside-avoid
        ${variant === 'list' ? 'list-view flex gap-6' : ''}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handleCardClick}
      aria-label={`Project: ${project.title}`}
    >
      {/* Content Container */}
      <div className={`flex-1 ${variant === 'list' ? 'flex flex-col justify-between' : 'space-y-3'}`}>
        {/* Header: Title and Year */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-resume-primary flex-1 line-clamp-2">
            {project.title}
          </h3>
          {project.year > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-resume-secondary flex-shrink-0">
              <Calendar size={14} />
              <span className="font-medium">{project.year}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm leading-6 text-resume-secondary line-clamp-2">
          {project.description}
        </p>

        {/* Technology Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <Chip
                key={tag}
                size="sm"
                variant="flat"
                color="primary"
                className="text-xs"
              >
                {tag}
              </Chip>
            ))}
            {remainingTagsCount > 0 && (
              <Chip
                size="sm"
                variant="flat"
                color="default"
                className="text-xs"
              >
                +{remainingTagsCount} more
              </Chip>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {(project.liveURL || project.repositoryURL) && (
          <div className="flex flex-wrap gap-2 no-print">
            {project.liveURL && (
              <Button
                as="a"
                href={project.liveURL}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                color="primary"
                variant="flat"
                startContent={<ExternalLink size={14} />}
                className="text-xs font-medium"
              >
                View Live
              </Button>
            )}
            {project.repositoryURL && (
              <Button
                as="a"
                href={project.repositoryURL}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                color="default"
                variant="bordered"
                startContent={<Github size={14} />}
                className="text-xs font-medium"
              >
                View Code
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
};
