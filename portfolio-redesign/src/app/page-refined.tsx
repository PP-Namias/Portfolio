'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Github, Linkedin, ExternalLink, Calendar, Download, User, Code, Briefcase, Award, BookOpen, Target, ChevronRight, Star, Calendar as CalendarIcon, Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import { personalInfo } from '@/data/personal';
import { contactInfo, type ContactMethod } from '@/data/contact';
import { techCategories } from '@/data/techStack';
import { featuredProjects } from '@/data/projects';
import { experienceData } from '@/data/experience';
import { certificationsList } from '@/data/certifications';
import { blogPosts } from '@/data/blog';
import './globals-refined.css';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Enhanced Profile Header Component
const EnhancedProfileHeader = () => {
  // Get primary email and social links  
  const primaryEmail = contactInfo.contactMethods.find((method: ContactMethod) => method.type === 'email' && method.primary)?.value || personalInfo.profile.email;
  // Hardcoded social links for now - can be updated when socialPlatforms is available
  const githubUrl = "https://github.com/ppnamias";
  const linkedinUrl = "https://linkedin.com/in/ppnamias";

  return (
    <motion.div 
      className="profile-header-enhanced"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="profile-content">
        <div className="profile-main">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src="/profile.jpeg"
              alt={personalInfo.profile.name}
              width={80}
              height={80}
              className="profile-avatar-enhanced"
              priority
            />
          </motion.div>
          
          <div className="profile-info-enhanced">
            <h1 className="profile-name">{personalInfo.profile.name}</h1>
            <h2 className="profile-title">{personalInfo.profile.title}</h2>
            
            <div className="profile-location">
              <MapPin size={14} />
              <span>{personalInfo.profile.location}</span>
            </div>
            
            <div className="profile-status">
              <div className="status-dot"></div>
              <span>Available for opportunities</span>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <motion.a
            href={`mailto:${primaryEmail}`}
            className="btn-enhanced btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail size={14} />
            Contact Me
          </motion.a>
          
          <motion.a
            href="/resume.pdf"
            download
            className="btn-enhanced btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={14} />
            Download CV
          </motion.a>
          
          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-enhanced btn-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github size={16} />
            </motion.a>
          )}
          
          {linkedinUrl && (
            <motion.a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-enhanced btn-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin size={16} />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced About Card Component
const EnhancedAboutCard = () => {
  const aboutSummary = personalInfo.about?.summary?.[0] || personalInfo.profile.tagline;
  const specializations = personalInfo.about?.specializations || ['Full-Stack Development', 'Cloud Architecture', 'DevOps', 'Team Leadership', 'System Design'];

  return (
    <motion.div
      className="card-enhanced"
      variants={fadeInUp}
    >
      <div className="card-header">
        <h2 className="card-title">
          <User size={18} />
          About Me
        </h2>
      </div>
      
      <div className="card-content">
        <p className="text-bio">
          {aboutSummary}
        </p>
        
        <div className="section-margin">
          <h3 className="section-title">
            Core Competencies
          </h3>
          <div className="flex-wrap-gap">
            {specializations.map((skill) => (
              <span key={skill} className="badge-enhanced badge-outline">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Tech Stack Card Component
const EnhancedTechStackCard = () => {
  const getCategoryClass = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Frontend': 'badge-tech-frontend',
      'Backend': 'badge-tech-backend',
      'Database': 'badge-tech-database',
      'Tools': 'badge-tech-tools',
      'DevOps': 'badge-tech-tools'
    };
    return categoryMap[category] || 'badge-outline';
  };

  return (
    <motion.div
      className="card-enhanced"
      variants={fadeInUp}
    >
      <div className="card-header">
        <h2 className="card-title">
          <Code size={18} />
          Tech Stack
        </h2>
      </div>
      
      <div className="card-content">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex-column-gap"
        >
          {techCategories.map((category) => (
            <motion.div key={category.name} variants={staggerItem}>
              <h3 className="category-header">
                {category.name}
                <span className={`badge-enhanced ${getCategoryClass(category.name)}`}>
                  {category.technologies.length}
                </span>
              </h3>
              <div className="flex-wrap-gap">
                {category.technologies.map((tech) => (
                  <motion.span
                    key={typeof tech === 'string' ? tech : tech.name}
                    className={`badge-enhanced ${getCategoryClass(category.name)}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {typeof tech === 'string' ? tech : tech.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Enhanced Projects Grid Component
const EnhancedProjectsGrid = () => {
  return (
    <motion.div
      className="card-enhanced"
      variants={fadeInUp}
    >
      <div className="card-header">
        <h2 className="card-title">
          <Target size={18} />
          Featured Projects
        </h2>
        <motion.a
          href="/projects"
          className="btn-enhanced btn-ghost"
          whileHover={{ scale: 1.02 }}
        >
          View All
          <ChevronRight size={14} />
        </motion.a>
      </div>
      
      <div className="card-content">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid-gap"
        >
          {featuredProjects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project._id || index}
              className="project-card-enhanced"
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="project-header">
                <div>
                  <h3 className="project-title-enhanced">{project.title}</h3>
                  <span className={`badge-enhanced ${project.status === 'Live' ? 'badge-status-live' : 'badge-status-progress'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="project-actions">
                  {project.links.live && (
                    <motion.a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-enhanced btn-icon"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Eye size={14} />
                    </motion.a>
                  )}
                  {project.links.github && (
                    <motion.a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-enhanced btn-icon"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Github size={14} />
                    </motion.a>
                  )}
                </div>
              </div>
              
              <p className="project-description">{project.description}</p>
              
              <div className="project-tech-stack">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span key={tech} className="badge-enhanced badge-outline">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="badge-enhanced badge-outline">
                    +{project.technologies.length - 4} more
                  </span>
                )}
              </div>
              
              <div className="project-footer">
                <div className="project-meta">
                  <span className="flex-center-gap">
                    <CalendarIcon size={12} />
                    {new Date(project.endDate || project.startDate).getFullYear()}
                  </span>
                  <span className="flex-center-gap">
                    <Star size={12} />
                    Featured
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Enhanced Experience Timeline Component
const EnhancedExperienceTimeline = () => {
  return (
    <motion.div
      className="card-enhanced"
      variants={fadeInUp}
    >
      <div className="card-header">
        <h2 className="card-title">
          <Briefcase size={18} />
          Experience
        </h2>
      </div>
      
      <div className="card-content">
        <div className="timeline-enhanced">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {experienceData.map((exp, index) => (
              <motion.div
                key={exp._id}
                className="timeline-item-enhanced"
                variants={staggerItem}
              >
                <div className={`timeline-dot-enhanced ${index === 0 ? 'current' : ''}`}></div>
                <motion.div
                  className="timeline-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-job">{exp.position}</h3>
                      <h4 className="timeline-company">{exp.company}</h4>
                    </div>
                    <div className="timeline-duration">
                      <div className="timeline-date">
                        {exp.startDate} - {exp.endDate}
                      </div>
                      <div className="timeline-date-right">
                        {exp.location}
                      </div>
                    </div>
                  </div>
                  
                  <p className="timeline-description">{exp.description}</p>
                  
                  <div className="flex-wrap-gap">
                    {exp.technologies.slice(0, 5).map((tech) => (
                      <span key={tech} className="badge-enhanced badge-outline">
                        {tech}
                      </span>
                    ))}
                    {exp.technologies.length > 5 && (
                      <span className="badge-enhanced badge-outline">
                        +{exp.technologies.length - 5}
                      </span>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Certifications Card Component
const EnhancedCertificationsCard = () => {
  return (
    <motion.div
      className="card-enhanced"
      variants={fadeInUp}
    >
      <div className="card-header">
        <h2 className="card-title">
          <Award size={18} />
          Certifications
        </h2>
        <span className="badge-enhanced badge-outline">
          {certificationsList.length}
        </span>
      </div>
      
      <div className="card-content">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex-col-gap-md"
        >
          {certificationsList.slice(0, 4).map((cert) => (
            <motion.div
              key={cert._id}
              className="cert-item-enhanced"
              variants={staggerItem}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="cert-content">
                <div className="cert-info">
                  <h3 className="cert-title">{cert.title}</h3>
                  <p className="cert-issuer">{cert.issuer}</p>
                  <p className="cert-date">{cert.issueDate}</p>
                  <div className="cert-skills">
                    {cert.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="badge-enhanced badge-tech-tools">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <motion.a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-enhanced btn-icon"
                  whileHover={{ scale: 1.1 }}
                >
                  <ExternalLink size={14} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {certificationsList.length > 4 && (
          <motion.button
            className="btn-enhanced btn-ghost full-width-btn"
            whileHover={{ scale: 1.02 }}
          >
            View All Certifications
            <ChevronRight size={14} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Enhanced Blog Posts Card Component
const EnhancedBlogPostsCard = () => {
  return (
    <motion.div
      className="card-enhanced"
      variants={fadeInUp}
    >
      <div className="card-header">
        <h2 className="card-title">
          <BookOpen size={18} />
          Recent Posts
        </h2>
        <motion.a
          href="/blog"
          className="btn-enhanced btn-ghost"
          whileHover={{ scale: 1.02 }}
        >
          View Blog
          <ChevronRight size={14} />
        </motion.a>
      </div>
      
      <div className="card-content">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex-col-gap-md"
        >
          {blogPosts.slice(0, 3).map((post) => (
            <motion.div
              key={post._id}
              className="blog-item-enhanced"
              variants={staggerItem}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="blog-content">
                <div className="blog-info">
                  <h3 className="blog-title">{post.title}</h3>
                  <div className="blog-meta">
                    <span className="blog-meta-item">
                      <Calendar size={12} />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="blog-meta-item">
                      <Clock size={12} />
                      {post.readingTime} min read
                    </span>
                  </div>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-tags">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="badge-enhanced badge-outline">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <motion.a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-enhanced btn-icon"
                  whileHover={{ scale: 1.1 }}
                >
                  <ExternalLink size={14} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main Enhanced Portfolio Component
const RefinedPortfolio = () => {
  return (
    <div className="portfolio-container">
      <EnhancedProfileHeader />
      
      <div className="portfolio-grid">
        <motion.div
          className="portfolio-main"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <EnhancedAboutCard />
          <EnhancedProjectsGrid />
          <EnhancedExperienceTimeline />
        </motion.div>
        
        <motion.div
          className="portfolio-sidebar"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <EnhancedTechStackCard />
          <EnhancedCertificationsCard />
          <EnhancedBlogPostsCard />
        </motion.div>
      </div>
    </div>
  );
};

export default RefinedPortfolio;
