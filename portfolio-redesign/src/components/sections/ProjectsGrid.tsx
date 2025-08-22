'use client';

import { projectsCollection, type Project } from '@/data/projects';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Calendar, Users } from 'lucide-react';
import Image from 'next/image';

export function ProjectsGrid() {
  // Get featured projects (first 6)
  const featuredProjects = projectsCollection.featured?.slice(0, 6) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">Featured Projects</h2>
      </div>
      
      <div className="card-content">
        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-subtle rounded-lg overflow-hidden hover:border-accent transition-all duration-200 group"
              >
                {/* Project Image */}
                <div className="h-48 bg-card-secondary relative overflow-hidden">
                  {project.images && project.images[0] ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.images[0].alt || project.title}
                      width={400}
                      height={192}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center">
                        <ExternalLink size={24} className="text-accent" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="heading-5 mb-1">{project.title}</h3>
                      <p className="body-small text-secondary">{project.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {project.status?.replace('-', ' ') || 'Unknown'}
                    </span>
                  </div>

                  <p className="body-base text-secondary mb-4 line-clamp-2">
                    {project.shortDescription || project.description}
                  </p>

                  {/* Project Meta */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted">
                    {project.duration && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {project.duration}
                      </div>
                    )}
                    {project.teamSize && (
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        {project.teamSize} team
                      </div>
                    )}
                  </div>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-muted/20 text-muted text-xs rounded-md">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Project Links */}
                  <div className="flex items-center gap-3">
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary"
                      >
                        <ExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-secondary"
                      >
                        <Github size={14} />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <ExternalLink size={24} className="text-muted" />
            </div>
            <p className="body-base text-muted">No projects available at the moment.</p>
          </div>
        )}

        {/* Summary */}
        {featuredProjects.length > 0 && (
          <div className="mt-8 pt-6 border-t border-subtle">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="heading-3 text-accent">{projectsCollection.statistics?.totalProjects || 0}+</div>
                <div className="body-small">Total Projects</div>
              </div>
              <div>
                <div className="heading-3 text-accent">
                  {projectsCollection.statistics?.featuredProjects || featuredProjects.length}
                </div>
                <div className="body-small">Featured</div>
              </div>
              <div>
                <div className="heading-3 text-accent">
                  {projectsCollection.statistics?.liveProjects || 0}
                </div>
                <div className="body-small">Live Projects</div>
              </div>
              <div>
                <div className="heading-3 text-accent">
                  {projectsCollection.statistics?.technologiesUsed || 0}
                </div>
                <div className="body-small">Technologies</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
