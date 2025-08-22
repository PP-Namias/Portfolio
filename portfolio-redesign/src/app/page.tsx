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
    <div className="min-h-screen bg-background">
      {/* Container with max-width 1200px and proper padding */}
      <div className="container mx-auto px-6 py-8 max-w-[1200px]">
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Header - Full Width */}
          <motion.div variants={itemVariants}>
            <ProfileHeader />
          </motion.div>

          {/* Two-column layout: Main content 65%, Sidebar 35% */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 65% (2 columns out of 3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <motion.div variants={itemVariants}>
                <AboutCard />
              </motion.div>

              {/* Projects Grid */}
              <motion.div variants={itemVariants}>
                <ProjectsGrid />
              </motion.div>

              {/* Experience Timeline */}
              <motion.div variants={itemVariants}>
                <ExperienceTimeline />
              </motion.div>
            </div>

            {/* Sidebar - 35% (1 column out of 3) */}
            <div className="space-y-6">
              {/* Tech Stack */}
              <motion.div variants={itemVariants}>
                <TechStackCard />
              </motion.div>

              {/* Certifications */}
              <motion.div variants={itemVariants}>
                <CertificationsCard />
              </motion.div>

              {/* Blog Posts */}
              <motion.div variants={itemVariants}>
                <BlogPostsCard />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
