'use client';

import { techStackData } from '@/data/techStack';
import { motion } from 'framer-motion';
import { Code2, Star } from 'lucide-react';

export function TechStackCard() {
  // Get featured technologies (first 8 for the card display)
  const featuredTech = techStackData.categories
    ?.slice(0, 3)
    .flatMap(category => category.technologies?.slice(0, 3) || [])
    .slice(0, 8) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">Tech Stack</h2>
      </div>
      
      <div className="card-content">
        {featuredTech.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {featuredTech.map((tech, index) => (
                <motion.div
                  key={tech.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center p-4 border border-subtle rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-200"
                >
                  <div className="w-12 h-12 mb-2 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Code2 size={20} className="text-accent" />
                  </div>
                  <h3 className="heading-6 text-center mb-1">{tech.name}</h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={`${
                          tech.proficiency === 'expert' && i < 5 ||
                          tech.proficiency === 'advanced' && i < 4 ||
                          tech.proficiency === 'intermediate' && i < 3 ||
                          tech.proficiency === 'learning' && i < 2
                            ? 'text-accent fill-current'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="body-xs text-muted mt-1 capitalize">
                    {tech.proficiency}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Tech Categories Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {techStackData.categories?.slice(0, 3).map((category, index) => (
                <div key={category._id || index} className="text-center p-4 bg-card-secondary rounded-lg">
                  <div className="heading-4 text-accent mb-1">
                    {category.technologies?.length || 0}+
                  </div>
                  <div className="body-small text-secondary">{category.name}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <Code2 size={24} className="text-muted" />
            </div>
            <p className="body-base text-muted">No technologies available at the moment.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
