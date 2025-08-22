'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Monitor, Server, Database, Cloud, Settings, ChevronRight, BarChart3, Clock } from 'lucide-react';
import { techCategories, techStackCollection } from '@/data/techStack';

// Icon mapping for categories
const iconMap = {
  Monitor,
  Server,
  Database,
  Cloud,
  Settings,
  Code
};

// Proficiency configuration
const proficiencyConfig = {
  expert: {
    label: 'Expert',
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400',
    stars: 5
  },
  advanced: {
    label: 'Advanced', 
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
    stars: 4
  },
  intermediate: {
    label: 'Intermediate',
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400',
    stars: 3
  },
  learning: {
    label: 'Learning',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400',
    stars: 2
  }
};

const getProficiencyLevel = (proficiency: string): number => {
  return proficiencyConfig[proficiency as keyof typeof proficiencyConfig]?.stars || 0;
};

export const TechStackSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = techCategories || [];
  const stats = techStackCollection?.statistics;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card relative overflow-hidden"
      id="tech-stack"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/10 rounded-full opacity-50 -translate-y-16 -translate-x-16" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-primary)]/10 rounded-full opacity-50 translate-y-12 translate-x-12" />
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="heading-md text-[var(--color-text-primary)]">Technology Stack</h2>
            <p className="body-sm text-[var(--color-text-muted)]">Tools and technologies I work with</p>
          </div>
        </div>

        {/* Enhanced Category Grid */}
        <div className="space-y-6">
          {categories.map((category, categoryIndex) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Code;
            const isExpanded = selectedCategory === category.name;

            return (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="glass-card card-compact relative overflow-hidden"
              >
                {/* Category Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 via-transparent to-[var(--color-primary)]/5" />
                
                <div className="relative z-10">
                  {/* Category Header */}
                  <button
                    onClick={() => setSelectedCategory(isExpanded ? null : category.name)}
                    className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-surface-light)]/50 transition-all duration-300 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-xl flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="body-lg font-semibold text-[var(--color-text-primary)]">
                          {category.name}
                        </h3>
                        <p className="body-sm text-[var(--color-text-muted)]">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="chip chip-secondary">
                        {category.technologies?.length || 0} tools
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-300 ${
                          isExpanded ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </button>

                  {/* Technology Grid */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="border-t border-[var(--color-border)] pt-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.technologies?.map((tech, techIndex) => {
                          const config = proficiencyConfig[tech.proficiency as keyof typeof proficiencyConfig];
                          
                          return (
                            <motion.div
                              key={tech.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              className="glass-card card-compact group cursor-pointer relative overflow-hidden"
                            >
                              {/* Tech Card Background Effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              <div className="relative z-10 flex items-center gap-3">
                                {/* Tech Logo */}
                                {tech.logo && (
                                  <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-light)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <img 
                                      src={tech.logo} 
                                      alt={`${tech.name} logo`}
                                      className="w-6 h-6 object-contain"
                                    />
                                  </div>
                                )}
                                
                                <div className="flex-1 min-w-0">
                                  {/* Tech Name */}
                                  <h4 className="body-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                                    {tech.name}
                                  </h4>
                                  
                                  {/* Experience & Proficiency */}
                                  <div className="flex items-center gap-2 mt-1">
                                    {tech.yearsOfExperience && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-[var(--color-text-muted)]" />
                                        <span className="body-xs text-[var(--color-text-muted)]">
                                          {tech.yearsOfExperience}y
                                        </span>
                                      </div>
                                    )}
                                    <div className={`px-2 py-0.5 rounded-full body-xs font-medium ${config?.color || ''}`}>
                                      {config?.label || 'Unknown'}
                                    </div>
                                  </div>
                                  
                                  {/* Proficiency Stars */}
                                  <div className="flex items-center gap-0.5 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                      <div
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                          i < getProficiencyLevel(tech.proficiency)
                                            ? 'bg-[var(--color-accent)] group-hover:scale-125'
                                            : 'bg-[var(--color-surface-light)]'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Stats Footer */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="glass-card card-compact mt-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 via-transparent to-[var(--color-primary)]/5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="body-base font-medium text-[var(--color-text-primary)]">Technology Overview</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="body-lg font-bold text-[var(--color-accent)]">{stats.totalTechnologies}</div>
                  <div className="body-xs text-[var(--color-text-muted)]">Total Technologies</div>
                </div>
                <div className="text-center">
                  <div className="body-lg font-bold text-emerald-500">{stats.expertLevel}</div>
                  <div className="body-xs text-[var(--color-text-muted)]">Expert Level</div>
                </div>
                <div className="text-center">
                  <div className="body-lg font-bold text-blue-500">{stats.advancedLevel}</div>
                  <div className="body-xs text-[var(--color-text-muted)]">Advanced Level</div>
                </div>
                <div className="text-center">
                  <div className="body-lg font-bold text-[var(--color-primary)]">{stats.yearsOfExperience}</div>
                  <div className="body-xs text-[var(--color-text-muted)]">Years Experience</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};
