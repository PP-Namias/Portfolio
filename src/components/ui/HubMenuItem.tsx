'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface HubMenuItemProps {
  icon: LucideIcon;
  label: string;
  subtitle: string;
  index: number;
  onClick?: () => void;
  href?: string;
  download?: boolean;
  external?: boolean;
  iconColorClass?: string;
  iconBgClass?: string;
}

export function HubMenuItem({
  icon: Icon,
  label,
  subtitle,
  index,
  onClick,
  href,
  download,
  external,
  iconColorClass = 'text-accent-pink',
  iconBgClass = 'bg-accent-pink/10',
}: HubMenuItemProps) {
  const content = (
    <>
      <div className={`h-10 w-10 rounded-lg ${iconBgClass} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`h-5 w-5 ${iconColorClass}`} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          {label}
        </p>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
          {subtitle}
        </p>
      </div>
    </>
  );

  const className =
    'flex items-center gap-3 w-full px-4 py-2.5 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 focus-visible:bg-surface-light dark:focus-visible:bg-surface-dark transition-colors text-left group';

  if (href) {
    return (
      <motion.a
        href={href}
        download={download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.15 }}
        className={className}
        onClick={onClick}
        role="menuitem"
        tabIndex={0}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.15 }}
      onClick={onClick}
      className={className}
      role="menuitem"
      tabIndex={0}
    >
      {content}
    </motion.button>
  );
}
