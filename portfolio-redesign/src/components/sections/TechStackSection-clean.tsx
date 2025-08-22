'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Code, Monitor, Server, Database, Brain, Cloud, Smartphone, 
  ChevronRight, Wrench, Palette, Clock
} from 'lucide-react';
import { techStackData } from '@/data/techStack';

const iconMap = {
  Monitor,
  Server,
  Database,
  Brain,
  Cloud,
  Smartphone,
  Code,
  Wrench,
  Palette
};

const proficiencyConfig = {
  expert: {
    label: 'Expert',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    stars: 5
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    stars: 4
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    stars: 3
  },
  learning: {
    label: 'Learning',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    stars: 2
  }
};

interface Technology {
  name: string;
  proficiency: 'expert' | 'advanced' | 'intermediate' | 'learning';
  yearsOfExperience?: number;
}

interface TechCategory {
  category: string;
  icon: string;
  technologies: Technology[];
}

export const TechStackSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = Array.isArray(techStackData) ? techStackData as TechCategory[] : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
      id="tech-stack"
    >
      {/* Compact Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] rounded-lg flex items-center justify-center">
          <Code className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Tech Stack</h2>
          <p className="text-xs text-[var(--color-text-muted)]">Technologies & tools</p>
        </div>
      </div>

      {/* Compact Category Grid */}
      <div className="space-y-4">
        {categories.map((category, categoryIndex) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap];
          const isExpanded = selectedCategory === category.category;

          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-surface)]"
            >
              {/* Category Header */}
              <button
                onClick={() => setSelectedCategory(isExpanded ? null : category.category)}
                className="w-full p-3 flex items-center justify-between hover:bg-[var(--color-card)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-[var(--color-accent)]/10 flex items-center justify-center">
                    {IconComponent && <IconComponent className="w-4 h-4 text-[var(--color-accent)]" />}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">
                      {category.category}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {category.technologies?.length || 0} technologies
                    </div>
                  </div>
                </div>
                <ChevronRight 
                  className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`} 
                />
              </button>

              {/* Technology List */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-[var(--color-border)]"
                >
                  <div className="p-3 space-y-2">
                    {category.technologies?.map((tech, techIndex) => {
                      const config = proficiencyConfig[tech.proficiency];
                      
                      return (
                        <motion.div
                          key={tech.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--color-card)] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-[var(--color-text-primary)]">
                              {tech.name}
                            </div>
                            {tech.yearsOfExperience && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[var(--color-text-muted)]" />
                                <span className="text-xs text-[var(--color-text-muted)]">
                                  {tech.yearsOfExperience}y
                                </span>
                              </div>
                            )}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color || ''}`}>
                            {config?.label || 'Unknown'}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-[var(--color-accent)]">
              {categories.reduce((total, cat) => total + (cat.technologies?.length || 0), 0)}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Technologies</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--color-accent)]">
              {categories.length}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Categories</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
