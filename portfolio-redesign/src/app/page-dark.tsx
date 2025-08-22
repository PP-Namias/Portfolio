'use client';

import { motion } from 'framer-motion';
import { ProfileHeader } from '@/components/sections/ProfileHeader';
import { AboutCard } from '@/components/sections/AboutCard';
import { TechStackCard } from '@/components/sections/TechStackCard';
import { ProjectsGrid } from '@/components/sections/ProjectsGrid';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { CertificationsCard } from '@/components/sections/CertificationsCard';
import { BlogPostsCard } from '@/components/sections/BlogPostsCard';

export default function DarkThemePortfolio() {
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
          <ProfileHeader />
        </motion.header>

        {/* Main Content */}
        <main className="portfolio-main">
          <div className="portfolio-grid">
            {/* Main Content Column */}
            <div className="portfolio-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <AboutCard />
                <TechStackCard />
                <ProjectsGrid />
              </motion.div>
            </div>

            {/* Sidebar Column */}
            <aside className="portfolio-sidebar">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                <ExperienceTimeline />
                <CertificationsCard />
                <BlogPostsCard />
              </motion.div>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="portfolio-footer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-muted text-sm">Available for new opportunities</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="/resume.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Download Resume
              </a>
              <a 
                href="#contact" 
                className="btn btn-primary btn-sm"
              >
                Get In Touch
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs text-muted">
              <p>&copy; 2024 Bryl Lim. All rights reserved.</p>
              <p>Built with Next.js, TypeScript & Framer Motion</p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
