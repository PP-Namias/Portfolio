'use client';

import { motion } from 'framer-motion';
import { MapPin, Mail, Github, Linkedin, ExternalLink, Calendar, Download, User, Code, Briefcase, Award, BookOpen, Target, ChevronRight, Star, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Image from 'next/image';
import { personalInfo } from '@/data/personal';
import { techStackCollection } from '@/data/techStack';
import { projectsCollection } from '@/data/projects';
import { experienceCollection } from '@/data/experience';
import { certificationsCollection } from '@/data/certifications';
import { blogCollection } from '@/data/blog';
import { useState } from 'react';

// Tech Stack Color Mapping
const techColors: Record<string, string> = {
  'JavaScript': 'badge-yellow',
  'TypeScript': 'badge-blue',
  'React': 'badge-blue',
  'Next.js': 'badge-gray',
  'Node.js': 'badge-green',
  'Python': 'badge-blue',
  'PHP': 'badge-purple',
  'Java': 'badge-orange',
  'Docker': 'badge-blue',
  'AWS': 'badge-orange',
  'MongoDB': 'badge-green',
  'MySQL': 'badge-blue',
  'PostgreSQL': 'badge-blue',
  'Redis': 'badge-red',
  'Git': 'badge-orange',
  'Firebase': 'badge-yellow',
  'GraphQL': 'badge-pink',
  'Vue.js': 'badge-green',
  'Angular': 'badge-red',
  'Svelte': 'badge-orange',
  'Express.js': 'badge-gray',
  'FastAPI': 'badge-green',
  'Django': 'badge-green',
  'Laravel': 'badge-red',
  'Spring Boot': 'badge-green',
  'Kubernetes': 'badge-blue',
  'Terraform': 'badge-purple',
  'Jenkins': 'badge-blue',
  'Nginx': 'badge-green'
};

// Enhanced Profile Header Component
function EnhancedProfileHeader() {
  return (
    <motion.div 
      className="profile-header"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src="/profile.jpeg"
            alt={personalInfo.profile.name}
            width={120}
            height={120}
            className="profile-avatar"
          />
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1 profile-info">
          <h1>{personalInfo.profile.name}</h1>
          <p className="title">{personalInfo.profile.title}</p>
          <div className="location">
            <MapPin size={16} />
            <span>{personalInfo.profile.location}</span>
          </div>
          
          {/* Status */}
          <div className="profile-status mt-3">
            <div className="status-dot"></div>
            <span>Available for opportunities</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <motion.button 
          className="btn-icon"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🌙
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="profile-actions mt-6">
        <motion.a
          href={`mailto:${personalInfo.profile.email}`}
          className="btn btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Mail size={16} />
          Get in Touch
        </motion.a>

        <motion.a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download size={16} />
          Resume
        </motion.a>

        <motion.a
          href={personalInfo.social.linkedin || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Linkedin size={16} />
          LinkedIn
        </motion.a>

        <motion.a
          href={personalInfo.social.github || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Github size={16} />
          GitHub
        </motion.a>

        <motion.a
          href="#contact"
          className="btn btn-warning"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Calendar size={16} />
          Schedule Call
        </motion.a>
      </div>
    </motion.div>
  );
}

// Enhanced About Card Component
function EnhancedAboutCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className="card mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="card-header">
        <h2 className="card-title">
          <User size={20} />
          About Me
        </h2>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          <p className="text-secondary body-base">
            {personalInfo.summary.professional}
          </p>
          
          {/* Specializations */}
          <div>
            <h3 className="heading-sm mb-3">Core Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {personalInfo.specializations.map((spec, index) => (
                <span key={index} className="badge badge-primary">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Expandable Content */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pt-4 border-t border-gray-700">
              <p className="text-secondary body-base mb-4">
                {personalInfo.summary.personal}
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">5+</div>
                  <div className="text-xs text-gray-400">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">50+</div>
                  <div className="text-xs text-gray-400">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">15+</div>
                  <div className="text-xs text-gray-400">Technologies</div>
                </div>
              </div>
            </div>
          </motion.div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-ghost btn-sm w-full mt-3"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
            <ChevronRight size={16} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Tech Stack Card
function EnhancedTechStackCard() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Frontend']));

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <motion.div 
      className="card mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="card-header">
        <h2 className="card-title">
          <Code size={20} />
          Tech Stack
        </h2>
      </div>
      <div className="card-content">
        <div className="space-y-3">
          {techStackCollection.map((category, index) => (
            <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full p-3 text-left bg-gray-800/50 hover:bg-gray-700/50 transition-colors flex items-center justify-between"
              >
                <span className="font-medium">{category.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{category.technologies.length} tools</span>
                  <ChevronRight 
                    size={16} 
                    className={`transform transition-transform ${expandedCategories.has(category.category) ? 'rotate-90' : ''}`} 
                  />
                </div>
              </button>
              
              <motion.div
                initial={false}
                animate={{ 
                  height: expandedCategories.has(category.category) ? 'auto' : 0,
                  opacity: expandedCategories.has(category.category) ? 1 : 0
                }}
                style={{ overflow: 'hidden' }}
              >
                <div className="p-3 border-t border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {category.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className={`badge ${techColors[tech] || 'badge-outline'}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Projects Grid
function EnhancedProjectsGrid() {
  return (
    <motion.div 
      className="card mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="card-title">
            <Target size={20} />
            Featured Projects
          </h2>
          <motion.a
            href="/projects"
            className="btn btn-ghost btn-sm"
            whileHover={{ scale: 1.05 }}
          >
            View All
            <ExternalLink size={14} />
          </motion.a>
        </div>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {projectsCollection.slice(0, 3).map((project, index) => (
            <motion.div
              key={index}
              className="project-card"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                </div>
                {project.status === 'In Progress' && (
                  <span className="badge badge-warning text-xs">In Progress</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.slice(0, 4).map((tech, techIndex) => (
                  <span key={techIndex} className={`badge badge-outline text-xs`}>
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="text-xs text-gray-500">+{project.technologies.length - 4} more</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star size={12} />
                    <span>{project.metrics?.github_stars || 0}</span>
                  </div>
                  <div>Updated {project.lastUpdated}</div>
                </div>
                
                <div className="flex gap-2">
                  {project.links.live && (
                    <motion.a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ExternalLink size={14} />
                    </motion.a>
                  )}
                  {project.links.github && (
                    <motion.a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Github size={14} />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Experience Timeline
function EnhancedExperienceTimeline() {
  return (
    <motion.div 
      className="card mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="card-header">
        <h2 className="card-title">
          <Briefcase size={20} />
          Experience
        </h2>
      </div>
      <div className="card-content">
        <div className="timeline">
          {experienceCollection.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className={`timeline-dot ${exp.current ? 'current' : ''}`}></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-title">{exp.position}</h3>
                    <p className="timeline-company">{exp.company}</p>
                  </div>
                  <div className="timeline-duration">
                    <div>{exp.duration}</div>
                    <div className="text-xs text-gray-500">{exp.location}</div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-300 line-clamp-2">{exp.description}</p>
                  
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.achievements.slice(0, 2).map((achievement, achIndex) => (
                        <li key={achIndex} className="text-xs text-gray-400 flex items-start gap-1">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {exp.technologies && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {exp.technologies.slice(0, 5).map((tech, techIndex) => (
                      <span key={techIndex} className="badge badge-outline text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Certifications Card
function EnhancedCertificationsCard() {
  return (
    <motion.div 
      className="card mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="card-header">
        <h2 className="card-title">
          <Award size={20} />
          Certifications
        </h2>
      </div>
      <div className="card-content">
        <div className="space-y-3">
          {certificationsCollection.slice(0, 4).map((cert, index) => (
            <motion.div
              key={index}
              className="certification-item"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="certification-title">{cert.name}</h3>
                  <p className="certification-issuer">{cert.issuer}</p>
                  <p className="certification-date">
                    Earned {cert.dateEarned} • ID: {cert.credentialId}
                  </p>
                </div>
                
                {cert.verificationUrl && (
                  <motion.a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ExternalLink size={14} />
                  </motion.a>
                )}
              </div>

              {cert.skills && cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {cert.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span key={skillIndex} className="badge badge-success text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Blog Posts Card
function EnhancedBlogPostsCard() {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="card-title">
            <BookOpen size={20} />
            Recent Writing
          </h2>
          <motion.a
            href="/blog"
            className="btn btn-ghost btn-sm"
            whileHover={{ scale: 1.05 }}
          >
            View All
            <ExternalLink size={14} />
          </motion.a>
        </div>
      </div>
      <div className="card-content">
        <div className="space-y-3">
          {blogPostsCollection.slice(0, 4).map((post, index) => (
            <motion.div
              key={index}
              className="blog-post-item"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="blog-post-title line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    <CalendarIcon size={12} className="inline mr-1" />
                    {post.publishedDate}
                    <Clock size={12} className="inline ml-3 mr-1" />
                    {post.readTime}
                  </p>
                  <p className="text-sm text-gray-300 line-clamp-2 mt-2">{post.excerpt}</p>
                </div>
                
                <motion.a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-icon ml-3"
                  whileHover={{ scale: 1.1 }}
                >
                  <ExternalLink size={14} />
                </motion.a>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span key={tagIndex} className="badge badge-outline text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Main Portfolio Component
export default function EnhancedDarkPortfolio() {
  return (
    <div className="min-h-screen portfolio-layout">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="portfolio-header"
        >
          <EnhancedProfileHeader />
        </motion.header>

        {/* Main Content */}
        <main className="portfolio-main">
          <div className="portfolio-grid">
            {/* Left Column - Main Content */}
            <div className="portfolio-content">
              <EnhancedAboutCard />
              <EnhancedTechStackCard />
              <EnhancedProjectsGrid />
            </div>

            {/* Right Column - Sidebar */}
            <div className="portfolio-sidebar">
              <EnhancedExperienceTimeline />
              <EnhancedCertificationsCard />
              <EnhancedBlogPostsCard />
            </div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="portfolio-footer"
        >
          <div className="text-center text-gray-400">
            <p className="text-sm">
              © {new Date().getFullYear()} {personalInfo.name}. Built with Next.js, TypeScript & Framer Motion.
            </p>
            <p className="text-xs mt-2">
              Designed for impact. Developed for performance. Crafted with passion.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
