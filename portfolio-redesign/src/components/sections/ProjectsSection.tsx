'use client';

import { motion } from 'framer-motion';
import { FolderOpen, ExternalLink, Github, Calendar } from 'lucide-react';
import { projectsCollection, type Project } from '@/data/projects';

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live':
      case 'deployed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'development':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">
            {project.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-surface transition-colors"
              aria-label="View GitHub repository"
            >
              <Github className="w-4 h-4 text-secondary hover:text-accent transition-colors" />
            </a>
          )}
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-surface transition-colors"
              aria-label="View live project"
            >
              <ExternalLink className="w-4 h-4 text-secondary hover:text-accent transition-colors" />
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-secondary mb-4 leading-relaxed">
        {project.shortDescription || project.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies?.slice(0, 3).map((tech: string, techIndex: number) => (
            <span key={techIndex} className="chip-sm">
              {tech}
            </span>
          ))}
          {project.technologies?.length > 3 && (
            <span className="chip-sm text-muted">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {project.startDate && (
            <div className="flex items-center gap-1 text-xs text-muted">
              <Calendar className="w-3 h-3" />
              <span>{new Date(project.startDate).getFullYear()}</span>
            </div>
          )}
          <span className={`chip-sm ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const projects = projectsCollection.featured;
  const displayProjects = projects.slice(0, 6); // Show first 6 projects

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="projects"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FolderOpen className="w-4 h-4 mr-2 text-accent" />
          <h2 className="text-lg font-semibold text-primary">Recent Projects</h2>
        </div>
        <a 
          href="#all-projects"
          className="btn-text text-xs"
        >
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {displayProjects.map((project: Project, index: number) => (
          <ProjectCard key={project._id} project={project} index={index} />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-default">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-accent mb-1">
              {projects.length}+
            </div>
            <div className="text-xs text-muted">Projects Built</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent mb-1">
              {projects.filter((p: Project) => p.status?.toLowerCase() === 'live' || p.status?.toLowerCase() === 'deployed').length}
            </div>
            <div className="text-xs text-muted">Live Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent mb-1">
              {new Set(projects.flatMap((p: Project) => p.technologies || [])).size}+
            </div>
            <div className="text-xs text-muted">Technologies</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
