'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Code, Monitor, Server, Database, Brain, Cloud, Smartphone, 
  ChevronDown, ChevronRight
} from 'lucide-react';
import { techStackData } from '@/data/techStack';

const iconMap = {
  Monitor,
  Server,
  Database,
  Brain,
  Cloud,
  Smartphone,
  Code
};

const getProficiencyColor = (proficiency: string) => {
  const colors = {
    expert: 'bg-green-500/20 text-green-400 border-green-500/30',
    advanced: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    learning: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };
  return colors[proficiency as keyof typeof colors] || colors.intermediate;
};

const getCategoryColor = (color: string) => {
  const colors = {
    blue: 'border-blue-500/30 bg-blue-500/10',
    green: 'border-green-500/30 bg-green-500/10',
    purple: 'border-purple-500/30 bg-purple-500/10',
    orange: 'border-orange-500/30 bg-orange-500/10',
    cyan: 'border-cyan-500/30 bg-cyan-500/10',
    indigo: 'border-indigo-500/30 bg-indigo-500/10'
  };
  return colors[color as keyof typeof colors] || colors.blue;
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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className={`border rounded-lg p-4 transition-all duration-300 ${getCategoryColor(data.color)}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-3">
          {IconComponent && <IconComponent className="w-5 h-5 text-accent" />}
          <span className="font-medium text-text-primary">{name}</span>
          <span className="text-xs text-text-secondary bg-secondary/30 px-2 py-1 rounded-full">
            {data.technologies.length} skills
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors" />
        </motion.div>
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
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-primary/50 rounded-lg border border-border"
            >
              <div className="flex-1">
                <div className="font-medium text-text-primary text-sm">
                  {tech.name}
                </div>
                {tech.yearsOfExperience && (
                  <div className="text-xs text-text-secondary">
                    {tech.yearsOfExperience} year{tech.yearsOfExperience > 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getProficiencyColor(tech.proficiency)}`}>
                {tech.proficiency}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TechStackSection = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Frontend', 'Backend']) // Expand first two by default
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

  const toggleAll = () => {
    const allCategories = Object.keys(techStackData.categories);
    if (expandedCategories.size === allCategories.length) {
      setExpandedCategories(new Set());
    } else {
      setExpandedCategories(new Set(allCategories));
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="skills"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Code className="w-5 h-5 mr-3 text-accent" />
          <h2 className="text-xl font-semibold text-text-primary">Tech Stack</h2>
        </div>
        <button 
          onClick={toggleAll}
          className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
        >
          {expandedCategories.size === Object.keys(techStackData.categories).length ? 'Collapse All' : 'Expand All'}
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(techStackData.categories).map(([category, data]) => (
          <TechCategory
            key={category}
            name={category}
            data={data}
            isExpanded={expandedCategories.has(category)}
            onToggle={() => toggleCategory(category)}
          />
        ))}
      </div>

      {/* Proficiency Legend */}
      <div className="mt-6 p-4 bg-secondary/20 rounded-lg border border-border">
        <h4 className="text-sm font-medium text-text-primary mb-3">Proficiency Levels</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { level: 'expert', desc: '5+ years' },
            { level: 'advanced', desc: '3-5 years' },
            { level: 'intermediate', desc: '1-3 years' },
            { level: 'learning', desc: 'Currently learning' }
          ].map(({ level, desc }) => (
            <div key={level} className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getProficiencyColor(level)}`}>
                {level}
              </span>
              <span className="text-xs text-text-secondary">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
