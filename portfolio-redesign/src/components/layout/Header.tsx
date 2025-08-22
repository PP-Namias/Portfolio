'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, User, Briefcase, Code, FolderOpen, Mail, Sun, Moon,
  Calendar, Send, Award, MapPin, Trophy,
  Star, Sparkles, ArrowRight, ExternalLink
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { personalInfo } from '@/data/personal';
import Image from 'next/image';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigation = useMemo(() => [
    { name: 'Home', href: '#home', icon: User },
    { name: 'About', href: '#about', icon: User },
    { name: 'Experience', href: '#experience', icon: Briefcase },
    { name: 'Skills', href: '#skills', icon: Code },
    { name: 'Projects', href: '#projects', icon: FolderOpen },
    { name: 'Contact', href: '#contact', icon: Mail },
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
      
      // Update active section
      const sections = navigation.map(item => item.href.slice(1));
      const scrollY = scrollPosition + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigation]);

  const achievementBadges = [
    { icon: Trophy, text: 'Top 1% Developer', color: 'var(--color-warning)' },
    { icon: Star, text: '100+ Projects', color: 'var(--color-accent)' },
    { icon: Award, text: 'Certified Expert', color: 'var(--color-success)' }
  ];

  return (
    <>
      {/* Sticky Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'glass-card backdrop-blur-xl border-b border-[var(--color-border)]' 
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] flex items-center justify-center">
                <span className="text-white font-bold text-lg">PP</span>
              </div>
              <span className="font-bold text-lg text-[var(--color-text-primary)]">
                {personalInfo.profile.name.split(' ')[0]}
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ y: -2 }}
                  className={`relative font-medium transition-colors duration-300 ${
                    activeSection === item.href.slice(1)
                      ? 'text-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {item.name}
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--color-accent)] rounded-full"
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="w-10 h-10 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center transition-colors hover:bg-[var(--color-card)]"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[var(--color-warning)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--color-primary)]" />
                )}
              </motion.button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-card)]"
            >
              <div className="px-6 py-4 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-background)] via-[var(--color-surface)] to-[var(--color-card)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-secondary)] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow delay-animation" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative inline-block"
            >
              <div className="relative w-40 h-40 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[var(--color-background)]">
                    <Image
                      src="/profile.jpeg"
                      alt={personalInfo.profile.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 rounded-full border-2 border-dashed border-[var(--color-accent)] opacity-30"
                />
              </div>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card"
            >
              <Sparkles className="w-4 h-4 text-[var(--color-warning)]" />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                Available for new opportunities
              </span>
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            </motion.div>

            {/* Name & Title */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="heading-hero"
              >
                {personalInfo.profile.name}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="heading-md text-[var(--color-text-secondary)] max-w-3xl mx-auto"
              >
                {personalInfo.profile.title}
              </motion.p>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex items-center justify-center gap-2 text-[var(--color-text-muted)]"
              >
                <MapPin className="w-4 h-4" />
                <span className="body-base">{personalInfo.profile.location}</span>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <a href="#contact" className="btn btn-primary btn-lg group">
                <Calendar className="w-5 h-5" />
                Schedule a Call
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              
              <a href={`mailto:${personalInfo.profile.email}`} className="btn btn-secondary btn-lg group">
                <Send className="w-5 h-5" />
                Send Email
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>

            {/* Achievement Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex items-center justify-center gap-6 flex-wrap"
            >
              {achievementBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card cursor-pointer"
                >
                  <badge.icon 
                    className="w-5 h-5" 
                    style={{ color: badge.color }}
                  />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {badge.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-[var(--color-text-muted)] rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-[var(--color-text-muted)] rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};
