'use client';

import { techStackCollection, type TechCategory } from '@/data/techStack';
import { motion } from 'framer-motion';

export function TechStackSection() {
  // Get core categories with technologies
  const coreCategories = techStackCollection.categories
    .filter((category: TechCategory) => 
      ['Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML'].includes(category.name)
    )
    .sort((a: TechCategory, b: TechCategory) => a.order - b.order);

  return (
    <section id="skills" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-2 text-center mb-2xl">Technical Skills</h2>
          
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {coreCategories.map((category: TechCategory, index: number) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  {/* Category Title */}
                  <h3 className="heading-4 mb-lg text-center">
                    {category.name}
                  </h3>
                  
                  {/* Technologies Grid */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {category.technologies
                      .filter(tech => ['expert', 'advanced'].includes(tech.proficiency))
                      .slice(0, 8)
                      .map((tech, techIndex) => (
                        <motion.div
                          key={tech.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: (index * 0.1) + (techIndex * 0.05) 
                          }}
                          viewport={{ once: true }}
                          className={`chip ${tech.proficiency === 'expert' ? 'chip-accent' : ''}`}
                        >
                          {tech.name}
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
