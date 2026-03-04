'use client';

import React from 'react';
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { profile } from '@/data/profile';
import { socialLinks } from '@/data/socials';

const footerSocialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  instagram: Instagram,
};

const footerSocials = socialLinks.filter((s) =>
  ['github', 'linkedin', 'x', 'instagram'].includes(s.name)
);

export function Footer() {
  return (
    <footer className="mt-8 pb-6 pt-4 border-t border-border-light dark:border-border-dark">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex items-center gap-3">
          {footerSocials.map((link) => {
            const Icon = footerSocialIcons[link.name];
            if (!Icon) return null;
            return (
              <a
                key={link.name}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
                aria-label={link.label}
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
