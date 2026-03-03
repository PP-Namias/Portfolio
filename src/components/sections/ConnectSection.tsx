'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Calendar, ExternalLink,
  Github, Instagram, Linkedin, Facebook, Twitter, MessageSquare,
} from 'lucide-react';
import { socialLinks } from '@/data/socials';
import { Card } from '@/components/ui/Card';
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div>
        <Card>
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
            Connect
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon] || ExternalLink;
              // Cal.com link opens booking modal instead of navigating
              if (link.name === 'cal') {
                return (
                  <button
                    key={link.name}
                    onClick={() => openModal('booking')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 group bg-accent-pink text-white hover:bg-accent-pink-hover border border-accent-pink"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </button>
                );
              }
              return (
                <a
                  key={link.name}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 group ${
                    link.featured
                      ? 'bg-accent-pink text-white hover:bg-accent-pink-hover border border-accent-pink'
                      : 'border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        </Card>
      </div>
    </motion.section>
  );
}
