'use client';

import React, {useEffect, useState} from 'react';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { useCmsContent } from '@/hooks/useCmsContent';

const footerSocialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  twitter: FaXTwitter,
};

// Computed once at module load. Re-computing on every render
// would risk SSR vs client drift across the year boundary
// (Dec 31 23:59 vs Jan 1 00:00).
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { profile, socialLinks, siteSettings } = useCmsContent();
  const [year, setYear] = useState(CURRENT_YEAR);
  const footerSocials = socialLinks.filter((link) =>
    ['github', 'linkedin', 'x', 'twitter'].includes(link.name)
  );
  const footerCopy = siteSettings?.footer ?? {
    leadText: '',
    linkLabel: '',
    copyright: '',
    backToPortfolioLabel: 'Back to Portfolio',
    contactPrompt: 'Send a message',
  };

  useEffect(() => {
    if (year !== new Date().getFullYear()) {
      setYear(new Date().getFullYear());
    }
  }, [year]);

  return (
    <footer className="mt-8 pb-8 pt-6 border-t border-border-light dark:border-border-dark">
      <div className="flex flex-col items-center gap-4">
        {/* Final CTA */}
        <a
          href="https://www.linkedin.com/in/pp-namias/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink dark:hover:text-accent-pink-hover-dark transition-colors"
        >
          Let&apos;s connect
        </a>
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
          &copy; {year} {footerCopy.copyright || profile.name}
        </p>
        <p className="text-[11px] text-text-muted-light/60 dark:text-text-muted-dark/60">
          Built with Next.js, Sanity, and Cloudflare Workers
        </p>
      </div>
    </footer>
  );
}
