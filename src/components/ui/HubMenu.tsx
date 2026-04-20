'use client';

import { useState, useRef, useCallback, useEffect, type ComponentType } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import {
  Bot,
  FileDown,
  Calendar,
  Mail,
  Share2,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { HubMenuItem } from './HubMenuItem';
import { socialLinks } from '@/data/socials';
import { profile } from '@/data/profile';
import { useModal } from '@/hooks/useModal';
import { IS_BLOG_VISIBLE } from '@/lib/features';

interface HubMenuProps {
  onClose: () => void;
  onOpenChat: () => void;
}

const CONNECT_SOCIALS = ['github', 'linkedin', 'x', 'instagram'] as const;

const socialIconMap: Record<string, ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  instagram: FaInstagram,
};

export function HubMenu({ onClose, onOpenChat }: Readonly<HubMenuProps>) {
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
      {/* Profile Header — elevated without gradient accent */}
      <motion.div
        className="relative px-5 pt-5 pb-4 bg-white dark:bg-[#1C1C1E] border-b border-border-light/50 dark:border-border-dark/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Profile avatar with curved square shape */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -18 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <div className="h-11 w-11 rounded-lg border border-border-light dark:border-border-dark overflow-hidden bg-white dark:bg-card-bg-dark shadow-sm">
                <Image
                  src="/images/profile/Jhon%20Keneth%20Ryan%20Namias.jpg"
                  alt={profile.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                  priority
                />
              </div>
              <motion.div
                className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-[#1C1C1E]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
              />
            </motion.div>
            <motion.div
              className="min-w-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                {profile.name}
              </p>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                {profile.title}
              </p>
            </motion.div>
          </div>
          <motion.button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-all flex-shrink-0"
            aria-label="Close menu"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.85 }}
            transition={{ duration: 0.2 }}
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-pink/20 to-transparent" />

      {/* Menu Items */}
      <div
        ref={menuRef}
        className="py-2 overflow-y-auto chat-scrollbar flex-1 touch-pan-y"
        role="menu"
        aria-label="Quick actions menu"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        data-lenis-prevent
      >
        {/* Section label */}
        <motion.div
          className="px-5 pt-1 pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[10px] font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">
            Quick Actions
          </p>
        </motion.div>

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
        <div className="h-px mx-5 my-1.5 bg-border-light/50 dark:bg-border-dark/50" />

        <HubMenuItem
          icon={Mail}
          label="Send Email"
          subtitle={profile.email}
          index={3}
          href="/contact"
          onClick={onClose}
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
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden px-5"
            >
              <div className="flex items-center gap-2 py-2.5 pl-[48px]">
                {connectLinks.map((link, i) => {
                  const Icon = socialIconMap[link.name] || Share2;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-xl bg-accent-pink/8 dark:bg-accent-pink/10 flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-all duration-200 hover:shadow-md hover:shadow-accent-pink/20 hover:scale-110"
                      aria-label={link.label}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {IS_BLOG_VISIBLE && (
          <HubMenuItem
            icon={ArrowUpRight}
            label="Read Blog"
            subtitle="Latest articles & tutorials"
            index={5}
            href="/blog"
            onClick={onClose}
            iconColorClass="text-indigo-500"
            iconBgClass="bg-indigo-500/10"
          />
        )}
      </div>

      {/* Footer — minimal status */}
      <motion.div
        className="px-5 py-3 border-t border-border-light/50 dark:border-border-dark/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => { openModal('booking'); onClose(); }}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors group"
        >
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {' '}
            Book a meeting
          </span>
          <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
        </button>
      </motion.div>
    </>
  );
}
