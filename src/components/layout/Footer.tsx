'use client';

import React from 'react';
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { useModal } from '@/hooks/useModal';
import { useCmsContent } from '@/hooks/useCmsContent';

const footerSocialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  instagram: FaInstagram,
};

export function Footer() {
  const { profile, socialLinks, siteSettings } = useCmsContent();
  const { openModal } = useModal();
  const footerSocials = socialLinks.filter((link) =>
    ['github', 'linkedin', 'x', 'instagram'].includes(link.name)
  );
  const footerCopy = siteSettings.footer;

  return (
    <footer className="mt-8 pb-8 pt-6 border-t border-border-light dark:border-border-dark">
      <div className="flex flex-col items-center gap-4">
        {/* Final CTA */}
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-center">
          {footerCopy.leadText || 'Interested in working together?'}{' '}
          <button
            type="button"
            onClick={() => openModal('contact')}
            className="text-accent-pink hover:text-accent-pink-hover dark:hover:text-accent-pink-hover-dark font-medium transition-colors"
          >
            {footerCopy.contactPrompt || 'Send a message'}
          </button>
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
          &copy; {new Date().getFullYear()} {footerCopy.copyright || profile.name}
        </p>
      </div>
    </footer>
  );
}
