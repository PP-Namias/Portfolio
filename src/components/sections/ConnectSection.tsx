'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, ExternalLink, MessageSquareText } from 'lucide-react';
import {
  FaDiscord,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import { socialLinks } from '@/data/socials';
import { experiences } from '@/data/experience';
import { certifications } from '@/data/certifications';
import { technologies } from '@/data/techStack';
import { useModal } from '@/hooks/useModal';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  github: FaGithub,
  mail: Mail,
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
  discord: FaDiscord,
  twitter: FaXTwitter,
  x: FaXTwitter,
  instagram: FaInstagram,
};

export function ConnectSection() {
  const { openModal } = useModal();
  const emailFallback = socialLinks.find((link) => link.name === 'email')?.link?.replace('mailto:', '') ?? 'pp.namias@gmail.com';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
        Connect
      </h2>
      <p className="text-[13px] sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2 leading-[1.7]">
        Open for collaborations, freelance work, and interesting conversations. Let&apos;s build something together.
      </p>
      <p className="text-[12px] sm:text-xs text-text-muted-light dark:text-text-muted-dark mb-3.5">
        {experiences.length} companies &middot; {certifications.length} certifications &middot; {technologies.length} technologies
      </p>

      {/* Primary CTA — elevated above social links */}
      <div className="flex flex-wrap items-center gap-2 mb-3.5">
        {socialLinks.filter(link => link.name === 'cal').map((link, index) => {
          const Icon = iconMap[link.icon] || ExternalLink;
          return (
            <motion.button
              key={link.name}
              onClick={() => openModal('booking')}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group bg-accent-pink text-white hover:bg-accent-pink-hover shadow-sm shadow-accent-pink/20"
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </motion.button>
          );
        })}

        <motion.button
          onClick={() => openModal('contact')}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group border border-accent-pink/30 text-accent-pink hover:bg-accent-pink/10"
        >
          <MessageSquareText className="h-4 w-4" />
          <span>Contact Form</span>
        </motion.button>

        <motion.a
          href={`mailto:${emailFallback}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.3 }}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink"
        >
          <Mail className="h-4 w-4" />
          <span>Email fallback</span>
        </motion.a>
      </div>

      {/* Secondary social links — lower visual weight */}
      <div className="flex flex-wrap items-center gap-2">
        {socialLinks.filter(link => link.name !== 'cal').map((link, index) => {
          const Icon = iconMap[link.icon] || ExternalLink;
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
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-200 group border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink"
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
