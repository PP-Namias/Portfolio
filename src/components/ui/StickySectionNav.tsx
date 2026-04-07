'use client';

import React from 'react';

const sectionLinks = [
  { href: '#about', label: 'About' },
  { href: '#tech', label: 'Tech Stack' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#connect', label: 'Connect' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#gallery', label: 'Gallery' },
];

export function StickySectionNav() {
  return (
    <nav
      aria-label="Quick section navigation"
      className="sticky top-2 z-30 mb-4 rounded-xl border border-border-light dark:border-border-dark bg-white/90 dark:bg-card-bg-dark/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-card-bg-dark/80"
    >
      <ul className="scrollbar-hide flex items-center gap-2 overflow-x-auto px-2 py-2 sm:px-3">
        {sectionLinks.map((link) => (
          <li key={link.href} className="shrink-0">
            <a
              href={link.href}
              className="inline-flex items-center rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-1.5 text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark transition-colors hover:border-accent-pink hover:text-accent-pink dark:hover:border-accent-pink dark:hover:text-accent-pink"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
