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
    color: 'chip-success',
    stars: 5,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-700'
  },
  advanced: {
    label: 'Advanced',
    color: 'chip-primary',
    stars: 4,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700'
  },
  intermediate: {
    label: 'Intermediate',
    color: 'chip-warning',
    stars: 3,
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-700'
  },
  learning: {
    label: 'Learning',
    color: 'chip-secondary',
    stars: 2,
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-700'
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
