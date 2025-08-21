'use client';

import { motion } from 'framer-motion';
import { FolderOpen, ExternalLink, Github } from 'lucide-react';
import { projectsCollection, type Project } from '@/data/projects';

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="card group cursor-pointer"
      onClick={() => project.links?.live && window.open(project.links.live, '_blank')}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center gap-1">
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-lg hover:bg-surface transition-colors"
              aria-label="View GitHub repository"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4 text-muted hover:text-accent transition-colors" />
            </a>
          )}
          {project.links?.live && (
            <ExternalLink className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
          )}
        </div>
      </div>

      <p className="text-xs text-secondary mb-3 leading-relaxed line-clamp-2">
        {project.shortDescription || project.description}
      </p>

      <div className="flex flex-wrap gap-1 mt-auto">
        {project.technologies?.slice(0, 4).map((tech: string, techIndex: number) => (
          <span key={techIndex} className="chip-sm text-xs">
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const projects = projectsCollection.featured;
  const displayProjects = projects.slice(0, 4); // Show first 4 projects to match Bryl Lim design

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
        <button className="text-sm text-accent hover:text-accent-hover font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayProjects.map((project: Project, index: number) => (
          <ProjectCard key={project._id} project={project} index={index} />
        ))}
      </div>
    </motion.section>
  );
};
