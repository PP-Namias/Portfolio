'use client';

import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  ExternalLink, 
  Github, 
  Star, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { projectsCollection, type Project } from '@/data/projects';

export const ProjectsSection = () => {
  const projects = projectsCollection?.featured || [];
  const featuredProjects = projects.slice(0, 3); // Show top 3 projects

  return (
    <section className="card relative overflow-hidden" id="projects">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/10 rounded-full opacity-50 -translate-y-16 -translate-x-16" />
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="heading-md text-[var(--color-text-primary)]">Featured Projects</h2>
              <p className="body-sm text-[var(--color-text-muted)]">Showcasing innovative solutions</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary hidden sm:flex"
          >
            <ExternalLink className="w-4 h-4" />
            View All
          </motion.button>
        </div>

        {/* Enhanced Projects Grid */}
        <div className="space-y-6">
          {featuredProjects.map((project: Project, index: number) => {
            const isFeatured = index === 0;
            
            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01, y: -4 }}
                className="glass-card card-compact group cursor-pointer relative overflow-hidden"
                onClick={() => project.links?.live && window.open(project.links.live, '_blank')}
              >
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute top-4 right-4 z-10 chip chip-success">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                )}

                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="body-lg font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                        {project.title}
                      </h3>
                      
                      {project.category && (
                        <span className="chip chip-secondary mb-3">
                          {project.category}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {project.links?.github && (
                        <motion.a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 glass-card hover:bg-[var(--color-surface-light)] transition-colors flex items-center justify-center"
                          aria-label="View GitHub repository"
                        >
                          <Github className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        </motion.a>
                      )}
                      
                      {project.links?.live && (
                        <motion.a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] hover:shadow-lg transition-all flex items-center justify-center rounded-lg"
                          aria-label="View live project"
                        >
                          <ArrowUpRight className="w-4 h-4 text-white" />
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="body-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                    {project.description || project.shortDescription}
                  </p>

                  {/* Technologies Used */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="body-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[var(--color-accent)]" />
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech: string, techIndex: number) => (
                          <motion.span
                            key={techIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                            viewport={{ once: true }}
                            className="chip chip-primary"
                          >
                            {tech}
                          </motion.span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="chip chip-secondary">
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Project Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="glass-card card-compact mt-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 via-transparent to-[var(--color-primary)]/5" />
          <div className="relative z-10 text-center">
            <div className="body-sm font-semibold text-[var(--color-text-primary)] mb-4">
              Project Portfolio Overview
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="body-lg font-bold text-[var(--color-accent)] mb-1">
                  {projectsCollection.statistics?.totalProjects || projects.length}
                </div>
                <div className="body-xs text-[var(--color-text-muted)]">Total Projects</div>
              </div>
              <div>
                <div className="body-lg font-bold text-[var(--color-primary)] mb-1">
                  {featuredProjects.length}
                </div>
                <div className="body-xs text-[var(--color-text-muted)]">Featured</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};