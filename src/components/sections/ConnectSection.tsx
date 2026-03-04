'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Calendar, ExternalLink,
  Github, Instagram, Linkedin, Facebook, Twitter, MessageSquare,
} from 'lucide-react';
import { socialLinks } from '@/data/socials';
import { useModal } from '@/hooks/useModal';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  github: Github,
  mail: Mail,
  linkedin: Linkedin,
  facebook: Facebook,
  'message-square': MessageSquare,
  twitter: Twitter,
  instagram: Instagram,
};

export function ConnectSection() {
  const { openModal } = useModal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
        Connect
      </h3>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 leading-relaxed">
        Open for collaborations, freelance work, and interesting conversations. Let&apos;s build something together.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {socialLinks.map((link, index) => {
          const Icon = iconMap[link.icon] || ExternalLink;
          if (link.name === 'cal') {
            return (
              <motion.button
                key={link.name}
                onClick={() => openModal('booking')}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors duration-200 group bg-accent-pink text-white hover:bg-accent-pink-hover"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </motion.button>
            );
          }
          return (
            <motion.a
              key={link.name}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors duration-200 group ${
                link.featured
                  ? 'bg-accent-pink text-white hover:bg-accent-pink-hover'
                  : 'border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{link.label}</span>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}
