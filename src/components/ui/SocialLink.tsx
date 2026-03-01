'use client';

import React from 'react';
import { ExternalLink, Linkedin, Github, Instagram } from 'lucide-react';

interface SocialLinkProps {
  platform: string;
  url: string;
}

const iconMap: Record<string, React.ReactNode> = {
  LinkedIn: <Linkedin className="h-4 w-4" />,
  GitHub: <Github className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
};

export function SocialLink({ platform, url }: SocialLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 py-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200 group"
    >
      <span className="text-text-muted-light dark:text-text-muted-dark group-hover:text-accent-pink transition-colors duration-200">
        {iconMap[platform] || <ExternalLink className="h-4 w-4" />}
      </span>
      <span>{platform}</span>
    </a>
  );
}
