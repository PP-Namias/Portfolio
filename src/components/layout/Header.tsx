'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ColorSchemePicker } from '@/components/ui/ColorSchemePicker';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certs', href: '#certifications' },
  { label: 'Blog', href: '/blog' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const isScrolled = currentY > 20;
    const isScrollingDown = currentY > lastScrollY && currentY > 80;

    setScrolled(isScrolled);
    setHidden(isScrollingDown);
    setLastScrollY(currentY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change or ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle hash links (section anchors)
    if (!href.startsWith('#')) return;

    e.preventDefault();
    setMobileOpen(false);

    const el = document.querySelector(href);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'header-glass'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo / Name */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 shrink-0"
            >
              <span className="text-sm font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors duration-200">
                PP Namias
              </span>
              <span className={cn(
                'hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-300',
                'bg-accent-pink/10 text-accent-pink',
              )}>
                Portfolio
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center" aria-label="Main navigation">
              <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-surface-light/60 dark:bg-card-bg-dark/60 border border-border-light/50 dark:border-border-dark/50 backdrop-blur-sm">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      'px-3 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200',
                      'text-text-secondary-light dark:text-text-secondary-dark',
                      'hover:text-text-primary-light dark:hover:text-text-primary-dark',
                      'hover:bg-surface-light dark:hover:bg-card-bg-dark',
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-1.5">
              <div className="hidden sm:flex items-center gap-1.5">
                <ColorSchemePicker />
                <div className="h-4 w-px bg-border-light dark:bg-border-dark mx-0.5" />
              </div>
              <ThemeToggle />

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  'md:hidden rounded-lg p-2 transition-colors duration-200',
                  'hover:bg-surface-light dark:hover:bg-card-bg-dark',
                  'text-text-muted-light dark:text-text-muted-dark',
                  'focus:outline-none focus:ring-2 focus:ring-accent-pink focus:ring-offset-2 dark:focus:ring-offset-background-dark'
                )}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="md:hidden overflow-hidden border-t border-border-light/50 dark:border-border-dark/50"
            >
              <div className="px-4 py-3 space-y-1 header-glass">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      'block px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                      'text-text-secondary-light dark:text-text-secondary-dark',
                      'hover:text-text-primary-light dark:hover:text-text-primary-dark',
                      'hover:bg-surface-light/80 dark:hover:bg-card-bg-dark/80',
                    )}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    {link.label}
                  </motion.a>
                ))}

                {/* Color scheme picker for mobile */}
                <div className="flex items-center gap-2 px-3 pt-2 pb-1 sm:hidden">
                  <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Accent</span>
                  <ColorSchemePicker />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Backdrop overlay for mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </>
  );
}
