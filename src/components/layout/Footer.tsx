'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Mail, MapPin } from 'lucide-react';
import { profile } from '@/data/profile';
import { socialLinks } from '@/data/socials';

const quickLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Experience', href: '/experience' },
  { label: 'GitHub', href: profile.github },
  { label: 'Resume', href: '/resume.pdf' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const connectLinks = socialLinks.filter((s) =>
    ['github', 'linkedin', 'x', 'instagram', 'discord'].includes(s.name)
  );

  return (
    <motion.footer
      className="mt-16 pb-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="border-t border-border-light dark:border-border-dark pt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink transition-colors"
                    {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark mb-3">
              Connect
            </h3>
            <ul className="space-y-2">
              {connectLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark mb-3">
              Get in Touch
            </h3>
            <div className="space-y-2">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </a>
              <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-border-light dark:border-border-dark pt-4">
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.footer>
  );
}
