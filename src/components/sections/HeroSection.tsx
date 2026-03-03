'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, ChevronRight, ExternalLink, Download, Calendar, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { profile } from '@/data/profile';
import { socialLinks } from '@/data/socials';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ColorSchemePicker } from '@/components/ui/ColorSchemePicker';
import { useModal } from '@/hooks/useModal';

const roles = [
  'Full Stack Engineer',
  'AI Automation Specialist',
  'Project Manager @ MASH',
];

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  instagram: Instagram,
};

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const { openModal } = useModal();

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const displayedSocials = socialLinks.filter((s) =>
    ['github', 'linkedin', 'x', 'instagram'].includes(s.name)
  );

  return (
    <motion.section
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Controls row: color picker + theme toggle */}
      <div className="absolute top-0 right-0 flex items-center gap-3">
        <ColorSchemePicker />
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-start gap-6">
        {/* Profile Photo with animated gradient ring */}
        <div className="flex-shrink-0 self-center sm:self-start">
          <div className="relative h-[120px] w-[120px] rounded-full">
            {/* Animated gradient ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-pink via-accent-pink-hover-dark to-accent-pink animate-spin-slow" />
            {/* Background fill to mask the ring under the photo */}
            <div className="absolute inset-[3px] rounded-full bg-white dark:bg-background-dark z-[1]" />
            {/* Photo */}
            <Image
              src="/images/profile/PP%20Namias.png"
              alt={profile.name}
              width={114}
              height={114}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[114px] w-[114px] rounded-full object-cover z-[2]"
              priority
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h1 className="text-[1.65rem] font-bold text-text-primary-light dark:text-text-primary-dark inline-flex items-center flex-wrap justify-center sm:justify-start leading-tight">
            {profile.name}
            <VerifiedBadge />
          </h1>

          {/* Animated role text */}
          <div className="h-6 mt-1.5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIndex}
                className="text-[15px] font-medium text-accent-pink"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {roles[roleIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Location + Availability */}
          <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-text-muted-light dark:text-text-muted-dark" />
              <span className="text-[13px] text-text-muted-light dark:text-text-muted-dark">
                {profile.location}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Open to opportunities
            </span>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-5">
            <Button variant="primary" size="md" href={profile.github}>
              View GitHub
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="md" onClick={() => openModal('resume')}>
              <Download className="h-4 w-4" />
              Resume
            </Button>
            <Button variant="ghost" size="md" onClick={() => openModal('booking')}>
              <Calendar className="h-4 w-4" />
              Book a Call
            </Button>
            <Button variant="ghost" size="md" href={`mailto:${profile.email}`}>
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border-light dark:border-border-dark" />

          {/* Bottom row: blog link + social icons */}
          <div className="flex items-center justify-center sm:justify-between gap-4">
            <a
              href="/blog"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
            >
              Read my blog
              <ChevronRight className="h-3.5 w-3.5" />
            </a>

            {/* Social icons */}
            <div className="flex items-center gap-1.5">
              {displayedSocials.map((link) => {
                const Icon = socialIconMap[link.name];
                if (!Icon) return null;
                return (
                  <a
                    key={link.name}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-lg border border-border-light dark:border-border-dark flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:border-accent-pink hover:text-accent-pink transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
