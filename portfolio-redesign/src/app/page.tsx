'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProfileHeader } from '@/components/sections/ProfileHeader';
import { AboutCard } from '@/components/sections/AboutCard';
import { TechStackCard } from '@/components/sections/TechStackCard';
import { ProjectsGrid } from '@/components/sections/ProjectsGrid';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { CertificationsCard } from '@/components/sections/CertificationsCard';
import { BlogPostsCard } from '@/components/sections/BlogPostsCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Home() {
  return (
    <div className="main-container">
      <motion.div 
        className="portfolio-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header - Full Width */}
        <motion.div className="grid-header" variants={itemVariants}>
          <ProfileHeader />
        </motion.div>

        {/* About Section */}
        <motion.div className="grid-about" variants={itemVariants}>
          <AboutCard />
        </motion.div>

        {/* Tech Stack */}
        <motion.div className="grid-tech" variants={itemVariants}>
          <TechStackCard />
        </motion.div>

        {/* Projects - Full Width */}
        <motion.div className="grid-projects" variants={itemVariants}>
          <ProjectsGrid />
        </motion.div>

        {/* Experience Timeline */}
        <motion.div className="grid-experience" variants={itemVariants}>
          <ExperienceTimeline />
        </motion.div>

        {/* Certifications */}
        <motion.div className="grid-certifications" variants={itemVariants}>
          <CertificationsCard />
        </motion.div>

        {/* Blog Posts */}
        <motion.div className="grid-blog" variants={itemVariants}>
          <BlogPostsCard />
        </motion.div>
      </motion.div>
    </div>
  );
}
