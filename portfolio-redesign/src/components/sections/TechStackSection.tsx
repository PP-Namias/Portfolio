'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Code, Monitor, Server, Database, Brain, Cloud, Smartphone, 
  ChevronRight, Wrench, Palette, Star, Clock, BarChart3
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

export const TechStackSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
        {techStackData.map((category, categoryIndex) => {
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
                    <IconComponent className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">
                      {category.category}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {category.technologies.length} technologies
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
                    {category.technologies.map((tech, techIndex) => {
                      const config = proficiencyConfig[tech.proficiency as keyof typeof proficiencyConfig];
                      
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
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                            {config.label}
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
              {techStackData.reduce((total, cat) => total + cat.technologies.length, 0)}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Technologies</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--color-accent)]">
              {techStackData.length}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">Categories</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
  }
};

interface TechCategoryProps {
  name: string;
  data: {
    technologies: Array<{
      name: string;
      proficiency: "expert" | "advanced" | "intermediate" | "learning";
      yearsOfExperience?: number;
    }>;
    icon: string;
    color: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

const TechCategory = ({ name, data, isExpanded, onToggle }: TechCategoryProps) => {
  const IconComponent = iconMap[data.icon as keyof typeof iconMap];
  const techCount = data.technologies.length;
  const expertCount = data.technologies.filter(t => t.proficiency === 'expert').length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="glass-card card-compact group hover:scale-[1.02] transition-all duration-300"
    >
      <button
        onClick={onToggle}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="font-semibold text-primary group-hover:text-gradient transition-colors">
                {name}
              </h3>
              <p className="text-xs text-muted">
                {techCount} technologies • {expertCount} expert level
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-8 h-8 rounded-lg bg-surface border border-default flex items-center justify-center group-hover:border-accent transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
          </motion.div>
        </div>

        {/* Category Stats */}
        <div className="flex items-center gap-4 text-xs text-muted mb-3">
          <div className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            <span>Proficiency Range</span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => {
              const maxStars = Math.max(...data.technologies.map(t => proficiencyConfig[t.proficiency].stars));
              return (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < maxStars ? 'text-yellow-400 fill-current' : 'text-muted'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="space-y-3 pt-3 border-t border-light">
          {data.technologies.map((tech, index) => {
            const config = proficiencyConfig[tech.proficiency];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor} hover:scale-[1.02] transition-transform cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-primary text-sm">{tech.name}</h4>
                  <div className={`chip ${config.color} text-xs`}>
                    {config.label}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < config.stars ? 'text-yellow-400 fill-current' : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {tech.yearsOfExperience && (
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Clock className="w-3 h-3" />
                      <span>{tech.yearsOfExperience}+ years</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TechStackSection = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Frontend']) // Start with Frontend expanded
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const totalTechnologies = Object.values(techStackData.categories)
    .reduce((total, category) => total + category.technologies.length, 0);
  
  const expertTechnologies = Object.values(techStackData.categories)
    .reduce((total, category) => 
      total + category.technologies.filter(t => t.proficiency === 'expert').length, 0
    );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card relative overflow-hidden"
      id="skills"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-secondary rounded-full opacity-5 -translate-y-12 -translate-x-12" />
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="heading-sm text-primary">Tech Stack</h2>
              <p className="text-sm text-muted">
                {totalTechnologies} technologies • {expertTechnologies} expert level
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary"
            onClick={() => {
              // Toggle all categories
              const allCategories = Object.keys(techStackData.categories);
              const allExpanded = allCategories.every(cat => expandedCategories.has(cat));
              if (allExpanded) {
                setExpandedCategories(new Set());
              } else {
                setExpandedCategories(new Set(allCategories));
              }
            }}
          >
            {Object.keys(techStackData.categories).every(cat => expandedCategories.has(cat)) 
              ? 'Collapse All' 
              : 'Expand All'
            }
          </motion.button>
        </div>

        {/* Categories Grid */}
        <div className="space-y-4">
          {Object.entries(techStackData.categories).map(([category, data], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TechCategory
                name={category}
                data={data}
                isExpanded={expandedCategories.has(category)}
                onToggle={() => toggleCategory(category)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
