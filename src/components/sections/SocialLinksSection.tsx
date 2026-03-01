'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SocialLink } from '@/components/ui/SocialLink';

const socialLinks = [
  { platform: 'LinkedIn', url: 'https://linkedin.com' },
  { platform: 'GitHub', url: 'https://github.com' },
  { platform: 'Instagram', url: 'https://instagram.com' },
];

export function SocialLinksSection() {
  return (
    <motion.section
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
        Social Links
      </h2>
      <div className="space-y-0.5">
        {socialLinks.map((link) => (
          <SocialLink
            key={link.platform}
            platform={link.platform}
            url={link.url}
          />
        ))}
      </div>
    </motion.section>
  );
}
