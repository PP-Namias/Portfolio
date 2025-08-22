'use client';

import { featuredProjects, type Project } from '@/data/projects';
import { motion } from 'framer-motion';

export function ProjectsGrid() {
  const displayProjects = featuredProjects.slice(0, 4);

  const getProjectTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      'web': 'badge-blue',
      'mobile': 'badge-green',
      'desktop': 'badge-purple',
      'library': 'badge-orange',
      'tool': 'badge-yellow',
      'api': 'badge-red',
      'database': 'badge-indigo',
      'default': 'badge-gray'
    };
    return colors[type] || colors['default'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Featured Projects
        </h2>
        <p className="text-muted">Recent work and contributions</p>
      </div>

      <div className="card-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayProjects.map((project: Project, index: number) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="project-card group cursor-pointer"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="project-title group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${getProjectTypeColor(project.type)}`}>
                      {project.type}
                    </span>
                    {project.status === 'completed' && (
                      <span className="badge badge-success">Completed</span>
                    )}
                    {project.status === 'in-progress' && (
                      <span className="badge badge-warning">In Progress</span>
                    )}
                  </div>
                </div>
                
                {/* Project Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      title="View GitHub Repository"
                      aria-label="View GitHub Repository"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      title="View Live Project"
                      aria-label="View Live Project"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Project Description */}
              <p className="body-small text-muted mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Key Features */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="mb-4">
                  <div className="space-y-1">
                    {project.highlights.slice(0, 2).map((highlight: string, highlightIndex: number) => (
                      <div key={highlightIndex} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="body-small">{highlight}</span>
                      </div>
                    ))}
                    {project.highlights.length > 2 && (
                      <div className="body-small text-muted">
                        +{project.highlights.length - 2} more highlights
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech: string, techIndex: number) => (
                    <span key={techIndex} className="badge badge-outline text-xs">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="badge badge-outline text-xs">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Project Stats */}
              <div className="flex items-center justify-between text-xs text-muted">
                <div className="flex items-center gap-4">
                  {project.metrics?.stars && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {project.metrics.stars}
                    </div>
                  )}
                  {project.metrics?.forks && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      {project.metrics.forks}
                    </div>
                  )}
                </div>
                <div className="text-muted">
                  {new Date(project.endDate || project.startDate).getFullYear()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <button className="btn btn-ghost btn-sm w-full">
          View All Projects
        </button>
      </div>
    </motion.div>
  );
}
