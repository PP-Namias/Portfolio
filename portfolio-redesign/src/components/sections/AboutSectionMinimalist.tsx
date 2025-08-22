'use client';

import { personalInfo } from '@/data/personal';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="grid-2 items-center gap-12">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 mb-xl">About Me</h2>
            
            {/* Bio Summary */}
            <div className="space-y-6 mb-2xl">
              {personalInfo.about.summary.slice(0, 2).map((paragraph, index) => (
                <p key={index} className="body-base">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Key Highlights */}
            <div className="space-y-4">
              <h3 className="heading-4 mb-lg">Core Expertise</h3>
              <div className="space-y-3">
                {personalInfo.about.specializations.slice(0, 3).map((specialization, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="body-base">{specialization}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-80 h-80 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <Image
                  src={personalInfo.profile.avatar}
                  alt={personalInfo.profile.name}
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Experience Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {personalInfo.about.yearsOfExperience}+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Years Experience
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
