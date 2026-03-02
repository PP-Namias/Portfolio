'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { techCategories } from '@/data/techStack';

// Map JSON logo slugs to Simple Icons slugs where they differ
const LOGO_SLUG_MAP: Record<string, string> = {
  sharp: 'csharp',
  css: 'css3',
  nextjs: 'nextdotjs',
  sklearn: 'scikitlearn',
  photoshop: 'adobephotoshop',
};

function getLogoUrl(logo: string): string {
  const slug = LOGO_SLUG_MAP[logo] || logo;
  return `https://cdn.simpleicons.org/${encodeURIComponent(slug)}`;
}

export function TechStackSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Tech Stack
      </h2>
      <div className="space-y-3">
        {Object.entries(techCategories).map(([category, techs], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.1, duration: 0.3 }}
          >
            <h3 className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-1.5">
              {category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {techs.map((tech) => (
                <span
                  key={tech.name}
                  className="group relative inline-flex items-center text-xs px-2.5 py-1 rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors duration-200"
                >
                  {tech.logo && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getLogoUrl(tech.logo)}
                      alt=""
                      width={14}
                      height={14}
                      className="mr-1.5 opacity-50 group-hover:opacity-80 dark:invert transition-opacity"
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  {tech.name}
                  <span className="ml-1 text-[9px] text-text-muted-light dark:text-text-muted-dark opacity-0 group-hover:opacity-100 transition-opacity">
                    {tech.proficiency}%
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
