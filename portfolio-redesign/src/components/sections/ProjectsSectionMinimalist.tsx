'use client';

import { projectsCollection, type Project } from '@/data/projects';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export function ProjectsSection() {
  const featuredProjects = projectsCollection.featured.slice(0, 6);

  return (
    <section id="projects" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-2 text-center mb-2xl">Featured Projects</h2>
          
          <div className="grid-3">
            {featuredProjects.map((project: Project, index: number) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group cursor-pointer"
              >
                {/* Project Image */}
                {project.images && project.images.length > 0 && (
                  <div className="mb-lg overflow-hidden rounded-lg">
                    <Image
                      src={project.images[0].url}
                      alt={project.images[0].alt}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                
                {/* Project Content */}
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center gap-2 mb-sm">
                    <span className="chip chip-accent">{project.category}</span>
                    {project.status === 'completed' && (
                      <span className="chip">Completed</span>
                    )}
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="heading-4 mb-sm group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="body-base mb-lg line-clamp-3">
                    {project.shortDescription || project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="mb-lg">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 4).map((tech: string, techIndex: number) => (
                        <span key={techIndex} className="chip text-xs">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="chip text-xs">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Project Links */}
                  <div className="flex items-center gap-3">
                    {project.links?.live && (
                      <Link
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        Live Demo
                      </Link>
                    )}
                    {project.links?.github && (
                      <Link
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                      >
                        Code
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* View All Projects Button */}
          <div className="text-center mt-2xl">
            <Link href="/projects" className="btn btn-ghost btn-lg">
              View All Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
