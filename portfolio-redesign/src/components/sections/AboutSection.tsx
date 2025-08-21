'use client';

import { motion } from 'framer-motion';
import { User, Target, TrendingUp, Award, Code, Globe } from 'lucide-react';
import { personalInfo } from '@/data/personal';

export const AboutSection = () => {
  const stats = [
    {
      value: `${personalInfo.about.yearsOfExperience}+`,
      label: 'Years Experience',
      icon: TrendingUp,
      color: 'text-blue-500'
    },
    {
      value: `${personalInfo.about.metrics.projectsCompleted}+`,
      label: 'Projects Completed',
      icon: Code,
      color: 'text-green-500'
    },
    {
      value: `${personalInfo.about.metrics.teamsLed}+`,
      label: 'Teams Led',
      icon: Globe,
      color: 'text-purple-500'
    },
    {
      value: `${personalInfo.about.metrics.certifications}+`,
      label: 'Certifications',
      icon: Award,
      color: 'text-orange-500'
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card relative overflow-hidden"
      id="about"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary rounded-full opacity-5 -translate-y-16 translate-x-16" />
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="heading-sm text-primary">About Me</h2>
            <p className="text-sm text-muted">Professional background and expertise</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Enhanced Professional Summary */}
          <div className="space-y-4">
            {personalInfo.about.summary.map((paragraph, index) => (
              <motion.p 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-sm leading-relaxed text-secondary"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Enhanced Key Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card card-compact text-center group cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-surface border border-default flex items-center justify-center group-hover:scale-110 transition-transform ${stat.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-gradient">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Enhanced Current Focus */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-card card-compact relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-primary">Current Focus</span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                {personalInfo.about.currentFocus}
              </p>
            </div>
          </motion.div>

          {/* Enhanced Specializations */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-3">Core Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {personalInfo.about.specializations.map((spec, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="chip chip-primary cursor-pointer"
                >
                  {spec}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
