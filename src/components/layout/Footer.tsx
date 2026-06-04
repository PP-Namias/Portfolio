'use client';

import React, {useEffect, useState} from 'react';
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { useModal } from '@/hooks/useModal';
import { useCmsContent } from '@/hooks/useCmsContent';

const footerSocialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  instagram: FaInstagram,
};

// Computed once at module load. Re-computing on every render
// would risk SSR vs client drift across the year boundary
// (Dec 31 23:59 vs Jan 1 00:00).
const CURRENT_YEAR = new Date().getFullYear();
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

export function Footer() {
  const { profile, socialLinks, siteSettings } = useCmsContent();
  const { openModal } = useModal();
  const [year, setYear] = useState(CURRENT_YEAR);
  const footerSocials = socialLinks.filter((link) =>
    ['github', 'linkedin', 'x', 'instagram'].includes(link.name)
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
    <footer className="mt-8 pb-6 pt-5 border-t border-border-light dark:border-border-dark">
      <div className="flex flex-col items-center gap-3">
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
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark text-center">
          &copy; {year} {footerCopy.copyright || profile.name}
          <span className="mx-2 opacity-50">&middot;</span>
          Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
        </p>
      </div>
    </footer>
  );
}
