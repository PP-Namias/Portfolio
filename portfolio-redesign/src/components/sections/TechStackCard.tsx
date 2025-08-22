'use client';

import { techStackCollection, type TechCategory, type Technology } from '@/data/techStack';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function TechStackCard() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Frontend']);
  
  // Core categories to display
  const coreCategories = techStackCollection.categories
    .filter((category: TechCategory) => 
      ['Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML'].includes(category.name)
    )
    .sort((a: TechCategory, b: TechCategory) => a.order - b.order);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getBadgeColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Frontend': 'badge-primary',
      'Backend': 'badge-success', 
      'Database': 'badge-purple',
      'DevOps': 'badge-warning',
      'AI/ML': 'badge-primary'
    };
    return colors[category] || 'badge-outline';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Tech Stack
        </h2>
        <button className="btn btn-ghost btn-sm">View All</button>
      </div>

      <div className="card-content">
        <div className="space-y-6">
          {coreCategories.map((category: TechCategory) => (
            <div key={category._id}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="flex items-center justify-between w-full mb-3 text-left"
              >
                <h3 className="heading-4">{category.name}</h3>
                <svg 
                  className={`w-4 h-4 transition-transform ${
                    expandedCategories.includes(category.name) ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Technology Badges */}
              {expandedCategories.includes(category.name) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap gap-2"
                >
                  {category.technologies
                    .filter((tech: Technology) => ['expert', 'advanced'].includes(tech.proficiency))
                    .slice(0, 8)
                    .map((tech: Technology) => (
                      <motion.div
                        key={tech.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`badge ${getBadgeColor(category.name)}`}
                        title={`${tech.proficiency} - ${tech.yearsOfExperience} years`}
                      >
                        {tech.name}
                        {tech.proficiency === 'expert' && (
                          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )}
                      </motion.div>
                    ))}
                  
                  {category.technologies.length > 8 && (
                    <div className="badge badge-outline">
                      +{category.technologies.length - 8} more
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
