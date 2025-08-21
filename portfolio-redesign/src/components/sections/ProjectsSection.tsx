'use client';

import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  ExternalLink, 
  Github, 
  Star, 
  Eye, 
  Calendar,
  Code,
  Zap,
  ArrowUpRight,
  Play
} from 'lucide-react';
import { projectsCollection, type Project } from '@/data/projects';

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  // Mock data for demonstration - replace with real data from your projects
  const mockStats = {
    stars: Math.floor(Math.random() * 100) + 10,
    views: Math.floor(Math.random() * 1000) + 100,
    lastUpdated: '2024-01'
  };

  const isFeatured = index === 0; // First project is featured

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`glass-card group hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden ${
        isFeatured ? 'lg:col-span-2 lg:row-span-2 p-8' : 'p-6'
      }`}
      onClick={() => project.links?.live && window.open(project.links.live, '_blank')}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-accent to-primary text-white text-xs font-bold rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" />
          Featured
        </div>
      )}

      {/* Project thumbnail/icon area */}
      <div className={`relative mb-6 ${isFeatured ? 'h-48' : 'h-32'} bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl border border-accent/20 overflow-hidden group-hover:border-accent/40 transition-all`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Code className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-8 h-8 text-white opacity-80" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={`font-bold text-primary group-hover:text-accent transition-colors mb-2 ${
              isFeatured ? 'text-2xl' : 'text-lg'
            }`}>
              {project.title}
            </h3>
            
            {/* Project stats */}
            <div className="flex items-center gap-4 text-xs text-muted mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>{mockStats.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{mockStats.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{mockStats.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {project.links?.github && (
              <motion.a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 glass-card hover:bg-surface transition-colors group/button"
                aria-label="View GitHub repository"
              >
                <Github className="w-4 h-4 text-secondary group-hover/button:text-accent transition-colors" />
              </motion.a>
            )}
            {project.links?.live && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 glass-card hover:bg-accent/10 transition-colors group/button"
              >
                <ArrowUpRight className="w-4 h-4 text-accent" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className={`text-secondary leading-relaxed mb-6 ${
          isFeatured ? 'text-base' : 'text-sm'
        }`}>
          {project.shortDescription || project.description}
        </p>

        {/* Technologies */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary">Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.slice(0, isFeatured ? 8 : 4).map((tech: string, techIndex: number) => (
              <motion.span 
                key={techIndex} 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                viewport={{ once: true }}
                className="px-3 py-1 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 text-accent text-xs font-medium rounded-full hover:scale-105 transition-all"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const projects = projectsCollection.featured;
  const displayProjects = projects.slice(0, 6); // Show 6 projects for better grid

  return (
    <section className="py-20 bg-gradient-to-br from-background via-surface to-background relative overflow-hidden" id="projects">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="glass-card p-8 inline-block">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-full mb-6"
            >
              <FolderOpen className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary">Featured Work</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Recent Projects
              </span>
            </h2>
            
            <p className="text-secondary text-lg max-w-2xl mx-auto mb-6">
              A showcase of innovative solutions, cutting-edge technologies, and impactful applications 
              that demonstrate expertise in modern development practices.
            </p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-primary text-white font-medium rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-4 h-4" />
              View All Projects
            </motion.button>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project: Project, index: number) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Interested in collaborating?
            </h3>
            <p className="text-secondary mb-6 max-w-2xl mx-auto">
              I&apos;m always excited to work on new projects and bring innovative ideas to life. 
              Let&apos;s discuss how we can create something amazing together.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start a Project
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
