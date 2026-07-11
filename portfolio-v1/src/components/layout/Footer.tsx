'use client';

import React from 'react';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { useCmsContent } from '@/hooks/useCmsContent';

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  twitter: FaXTwitter,
};

export function Footer() {
  const { profile, socialLinks } = useCmsContent();
  const socials = socialLinks.filter((l) => ['github', 'linkedin', 'x', 'twitter'].includes(l.name));

  return (
    <footer className="mt-8 pb-6 pt-4 border-t border-border-light dark:border-border-dark">
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-2.5">
          {socials.map((link) => {
            const Icon = socialIcons[link.name];
            if (!Icon) return null;
            return (
              <a
                key={link.name}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 w-11 flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors"
                aria-label={link.label}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            );
          })}
        </div>
        <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
          &copy; {new Date().getFullYear()} {profile.name} &middot; Next.js &middot; Sanity
        </p>
      </div>
    </footer>
  );
}
