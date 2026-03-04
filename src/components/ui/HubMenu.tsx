'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  FileDown,
  Calendar,
  Mail,
  Share2,
  PenLine,
  X,
  Github,
  Linkedin,
  Twitter,
  Instagram,
} from 'lucide-react';
import { HubMenuItem } from './HubMenuItem';
import { socialLinks } from '@/data/socials';
import { profile } from '@/data/profile';
import { useModal } from '@/hooks/useModal';

interface HubMenuProps {
  onClose: () => void;
  onOpenChat: () => void;
}

const CONNECT_SOCIALS = ['github', 'linkedin', 'x', 'instagram'] as const;

const socialIconMap: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  instagram: Instagram,
};

export function HubMenu({ onClose, onOpenChat }: HubMenuProps) {
  const [connectExpanded, setConnectExpanded] = useState(false);
  const { openModal } = useModal();
  const menuRef = useRef<HTMLDivElement>(null);

  const calLink = socialLinks.find((s) => s.name === 'cal');
  const connectLinks = socialLinks.filter((s) =>
    CONNECT_SOCIALS.includes(s.name as (typeof CONNECT_SOCIALS)[number])
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (!items || items.length === 0) return;
    const current = document.activeElement as HTMLElement;
    const idx = Array.from(items).indexOf(current);
    let next: number;
    if (e.key === 'ArrowDown') {
      next = idx < items.length - 1 ? idx + 1 : 0;
    } else {
      next = idx > 0 ? idx - 1 : items.length - 1;
    }
    items[next].focus();
  }, []);

  useEffect(() => {
    // Auto-focus first menu item when menu opens
    const timer = setTimeout(() => {
      const firstItem = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
      firstItem?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark">
        <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
          Quick Actions
        </p>
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-accent-pink via-accent-pink-hover-dark to-accent-pink" />

      {/* Menu Items */}
      <div
        ref={menuRef}
        className="py-2 overflow-y-auto"
        role="menu"
        aria-label="Quick actions menu"
        onKeyDown={handleKeyDown}
      >
        <HubMenuItem
          icon={Bot}
          label="Ask AI Assistant"
          subtitle="Chat with Keneth's AI"
          index={0}
          onClick={onOpenChat}
          iconColorClass="text-violet-500"
          iconBgClass="bg-violet-500/10"
        />

        <HubMenuItem
          icon={FileDown}
          label="View Resume"
          subtitle="View & download my CV"
          index={1}
          onClick={() => { openModal('resume'); onClose(); }}
          iconColorClass="text-blue-500"
          iconBgClass="bg-blue-500/10"
        />

        {calLink && (
          <HubMenuItem
            icon={Calendar}
            label="Schedule a Meeting"
            subtitle="Book on Cal.com"
            index={2}
            onClick={() => { openModal('booking'); onClose(); }}
            iconColorClass="text-emerald-500"
            iconBgClass="bg-emerald-500/10"
          />
        )}

        <HubMenuItem
          icon={Mail}
          label="Send Email"
          subtitle={profile.email}
          index={3}
          href={`mailto:${profile.email}`}
          iconColorClass="text-amber-500"
          iconBgClass="bg-amber-500/10"
        />

        {/* Connect — expandable */}
        <HubMenuItem
          icon={Share2}
          label="Connect"
          subtitle="GitHub · LinkedIn · X"
          index={4}
          onClick={() => setConnectExpanded((prev) => !prev)}
          iconColorClass="text-teal-500"
          iconBgClass="bg-teal-500/10"
        />

        <AnimatePresence>
          {connectExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden px-4"
            >
              <div className="flex items-center gap-2 py-2 pl-[52px]">
                {connectLinks.map((link) => {
                  const Icon = socialIconMap[link.name] || Share2;
                  return (
                    <a
                      key={link.name}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-lg bg-accent-pink/10 flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-colors"
                      aria-label={link.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <HubMenuItem
          icon={PenLine}
          label="Read Blog"
          subtitle="Latest articles & tutorials"
          index={5}
          href="/blog"
          iconColorClass="text-indigo-500"
          iconBgClass="bg-indigo-500/10"
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border-light dark:border-border-dark">
        <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark text-center">
          Powered by Gemini AI
        </p>
      </div>
    </>
  );
}
