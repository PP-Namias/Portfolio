'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Users, Zap, FolderOpen } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  technologies: string[];
  metrics: {
    users?: string;
    performance?: string;
    lines?: string;
    features?: string;
  };
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  status: 'completed' | 'in-progress' | 'planning';
  featured: boolean;
}

const projects: Project[] = [
  {
    id: 'ai-portfolio',
    title: 'AI-Powered Portfolio Website',
    description: 'Modern Next.js portfolio with AI integration and dynamic content management.',
    longDescription: 'A comprehensive portfolio website built with Next.js 15, featuring AI-powered content generation, dynamic theme switching, and optimized performance. Includes advanced animations and responsive design.',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'AI/ML'],
    metrics: {
      performance: '98 Lighthouse',
      features: '15+ Components',
      lines: '5K+ Lines'
    },
    links: {
      live: 'https://pp-namias.vercel.app',
      github: 'https://github.com/PP-Namias/portfolio'
    },
    status: 'completed',
    featured: true
  },
  {
    id: 'gym-membership-system',
    title: 'Gym Membership Management',
    description: 'Full-stack gym management system with member tracking and payment integration.',
    longDescription: 'Comprehensive gym management platform featuring member registration, workout tracking, payment processing, and admin dashboard with real-time analytics.',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API', 'Express'],
    metrics: {
      users: '500+ Members',
      features: '12 Modules',
      performance: '95 Lighthouse'
    },
    links: {
      github: 'https://github.com/PP-Namias/gym-management'
    },
    status: 'completed',
    featured: true
  },
  {
    id: 'expense-tracker',
    title: 'Smart Expense Tracker',
    description: 'AI-powered expense tracking app with intelligent categorization.',
    longDescription: 'Mobile-first expense tracking application with AI-powered receipt scanning, automatic categorization, and comprehensive financial analytics.',
    thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    technologies: ['React Native', 'Python', 'TensorFlow', 'FastAPI', 'MongoDB'],
    metrics: {
      users: '1K+ Downloads',
      performance: '92 Lighthouse',
      features: '8 AI Models'
    },
    links: {
      live: 'https://expense-tracker-demo.vercel.app',
      github: 'https://github.com/PP-Namias/expense-tracker'
    },
    status: 'in-progress',
    featured: false
  },
  {
    id: 'airline-booking',
    title: 'Airline Booking System',
    description: 'Enterprise airline reservation system with real-time seat management.',
    longDescription: 'Full-scale airline booking platform with real-time flight tracking, seat selection, payment processing, and administrative dashboard.',
    thumbnail: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Redis', 'Socket.io'],
    metrics: {
      users: '10K+ Bookings',
      performance: '94 Lighthouse',
      features: '20+ Features'
    },
    links: {
      github: 'https://github.com/PP-Namias/airline-booking'
    },
    status: 'completed',
    featured: false
  }
];

const getStatusColor = (status: string) => {
  const colors = {
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    planning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };
  return colors[status as keyof typeof colors] || colors.completed;
};

const getStatusText = (status: string) => {
  const texts = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    planning: 'Planning'
  };
  return texts[status as keyof typeof texts] || 'Unknown';
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-secondary/20 border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-300"
    >
      {/* Project Thumbnail */}
      <div 
        className="h-48 w-full relative"
        style={{ background: project.thumbnail }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </span>
        </div>
        {project.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
            {project.title}
          </h3>
        </div>

        <p className="text-secondary text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-secondary/30 text-secondary rounded border border-border"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 text-xs bg-secondary/30 text-secondary rounded border border-border">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          {Object.entries(project.metrics).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-accent" />
              <span className="text-secondary">{value}</span>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center space-x-3">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm text-secondary hover:text-accent transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Code</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const EnhancedProjectsSection = () => {
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="projects"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FolderOpen className="w-5 h-5 mr-3 text-accent" />
          <h2 className="text-xl font-semibold text-primary">Recent Projects</h2>
        </div>
        <a
          href="https://github.com/PP-Namias"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center space-x-1"
        >
          <span>View All</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-8">
        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-primary mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Featured Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-primary mb-4">Other Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index + featuredProjects.length} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Stats */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-accent">{projects.length}</div>
            <div className="text-sm text-secondary">Total Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-secondary">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">50+</div>
            <div className="text-sm text-secondary">Technologies Used</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
