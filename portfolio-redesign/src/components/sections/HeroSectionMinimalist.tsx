'use client';

import { personalInfo } from '@/data/personal';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="section-lg">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Headline */}
            <h1 className="heading-1 mb-lg">
              {personalInfo.profile.name}
            </h1>
            
            {/* Subtitle */}
            <h2 className="heading-3 text-gray-600 dark:text-gray-400 mb-xl font-normal">
              {personalInfo.profile.title}
            </h2>
            
            {/* Tagline */}
            <p className="body-large mb-2xl max-w-2xl mx-auto">
              {personalInfo.profile.tagline}
            </p>
            
            {/* CTA Button */}
            <div className="flex justify-center">
              <a 
                href="#contact" 
                className="btn btn-primary btn-lg"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
