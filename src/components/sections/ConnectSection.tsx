'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Coffee, ExternalLink } from 'lucide-react';
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import { useModal } from '@/hooks/useModal';
import { useCmsContent } from '@/hooks/useCmsContent';
import { DISCORD_PROFILE_URL, KO_FI_URL } from '@/lib/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  github: FaGithub,
  linkedin: FaLinkedinIn,
  discord: FaDiscord,
  twitter: FaXTwitter,
  x: FaXTwitter,
  facebook: FaFacebook,
};

export function ConnectSection() {
  const { socialLinks } = useCmsContent();
  const { openModal } = useModal();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
        Connect
      </h2>
      <p className="text-[13px] sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2 leading-[1.7]">
        Open for collaborations, freelance work, and interesting conversations. Let&apos;s build something together.
      </p>

      {/* Primary CTA — elevated above social links */}
      <div className="flex flex-wrap items-center gap-2 mb-3.5">
        <motion.button
          type="button"
          onClick={() => openModal('booking')}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group border border-accent-pink/30 text-accent-pink hover:bg-accent-pink/10"
        >
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Schedule a Meeting</span>
        </motion.button>

        <motion.a
          href={DISCORD_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg border border-[#5865F2]/30 bg-[#5865F2]/5 text-[#5865F2] hover:bg-[#5865F2]/10 transition-colors duration-200"
        >
          <FaDiscord className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Chat on Discord</span>
        </motion.a>

        <motion.a
          href={KO_FI_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg border border-[#FF5E5B]/30 bg-[#FF5E5B]/5 text-[#FF5E5B] hover:bg-[#FF5E5B]/10 transition-colors duration-200"
          aria-label="Support me on Ko-fi"
        >
          <Coffee className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Support me</span>
        </motion.a>
      </div>

      {/* Secondary social links — lower visual weight */}
      <div className="flex flex-wrap items-center gap-2">
        {socialLinks.filter(link => !['cal', 'email'].includes(link.name)).map((link, index) => {
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
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{link.label}</span>
            </motion.a>
          );
        })}
      </div>
    </motion.section>
  );
}
