'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Code, Monitor, Server, Database, Brain, Cloud, Smartphone, 
  ChevronRight, Wrench, Palette
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
      className="bg-surface rounded-2xl p-4 border border-default hover:shadow-card-hover transition-all duration-300"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-3">
          {IconComponent && <IconComponent className="w-5 h-5 text-accent" />}
          <span className="font-medium text-primary">{name}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-secondary transition-colors" />
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
        <div className="mt-3 flex flex-wrap gap-2">
          {data.technologies.map((tech, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="chip-sm bg-background text-secondary border border-default hover:border-accent transition-colors"
            >
              {tech.name}
            </motion.span>
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="skills"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Code className="w-4 h-4 mr-2 text-accent" />
          <h2 className="text-lg font-semibold text-primary">Tech Stack</h2>
        </div>
        <button className="text-sm text-accent hover:text-accent-hover font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
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
    </motion.section>
  );
};
