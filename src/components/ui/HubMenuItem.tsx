'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
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
      <div className={`h-10 w-10 rounded-xl ${iconBgClass} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}>
        <Icon className={`h-5 w-5 ${iconColorClass} transition-transform duration-200`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors duration-200">
          {label}
        </p>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
          {subtitle}
        </p>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-text-muted-light/0 dark:text-text-muted-dark/0 group-hover:text-text-muted-light dark:group-hover:text-text-muted-dark transition-all duration-200 -translate-x-1 group-hover:translate-x-0 flex-shrink-0" />
    </>
  );

  const className =
    'flex items-center gap-3 w-full px-5 py-2.5 hover:bg-accent-pink/5 dark:hover:bg-accent-pink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-pink/50 focus-visible:bg-accent-pink/5 transition-all duration-200 text-left group';

  if (href) {
    return (
      <motion.a
        href={href}
        download={download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 + index * 0.06, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
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
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.06, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onClick}
      className={className}
      role="menuitem"
      tabIndex={0}
    >
      {content}
    </motion.button>
  );
}
