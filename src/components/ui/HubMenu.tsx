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
  Sparkles,
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
      {/* Profile Header */}
      <div className="px-4 pt-4 pb-3 bg-white dark:bg-card-bg-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-pink to-accent-pink-hover-dark flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {profile.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-card-bg-dark" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                {profile.name}
              </p>
              <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark truncate">
                {profile.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors flex-shrink-0"
            aria-label="Close menu"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-pink/30 to-transparent" />

      {/* Menu Items */}
      <div
        ref={menuRef}
        className="py-1.5 overflow-y-auto chat-scrollbar flex-1 touch-pan-y"
        role="menu"
        aria-label="Quick actions menu"
        onKeyDown={handleKeyDown}
        data-lenis-prevent
      >
        {/* Section label */}
        <div className="px-5 pt-1.5 pb-1">
          <p className="text-[10px] font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
            Quick Actions
          </p>
        </div>

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

        {/* Divider */}
        <div className="h-px mx-4 my-1.5 bg-border-light dark:bg-border-dark" />

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
      <div className="px-4 py-2.5 border-t border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark">
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="h-3 w-3 text-accent-pink opacity-60" />
          <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
            Powered by Gemini AI
          </span>
        </div>
      </div>
    </>
  );
}
