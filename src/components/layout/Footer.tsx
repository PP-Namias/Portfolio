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
    <footer className="mt-8 pb-8 pt-6 border-t border-border-light dark:border-border-dark">
      <div className="flex flex-col items-center gap-4">
        {/* Final CTA */}
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-center">
          Interested in working together?{' '}
          <a
            href="https://www.linkedin.com/in/pp-namias/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-pink hover:text-accent-pink-hover dark:hover:text-accent-pink-hover-dark font-medium transition-colors"
          >
            Let&apos;s connect
          </a>
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
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}
