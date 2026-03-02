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

      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Profile Photo with animated gradient ring */}
        <div className="flex-shrink-0">
          <div className="relative h-[130px] w-[130px]">
            {/* Animated gradient ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-pink via-accent-pink-hover-dark to-accent-pink animate-spin-slow" style={{ padding: '3px' }}>
              <div className="h-full w-full rounded-full bg-white dark:bg-background-dark" />
            </div>
            {/* Photo */}
            <Image
              src="/images/profile/PP%20Namias.png"
              alt={profile.name}
              width={130}
              height={130}
              className="absolute inset-[3px] rounded-full object-cover z-10"
              priority
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0 pt-1">
          {/* Name */}
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center flex-wrap">
            {profile.name}
            <VerifiedBadge />
          </h1>

          {/* Animated role text */}
          <div className="h-6 mt-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIndex}
                className="text-base font-medium text-accent-pink"
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
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-text-muted-light dark:text-text-muted-dark" />
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {profile.location}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Open to opportunities
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
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
            <Button variant="ghost" size="md" href="/blog" internal>
              Read my blog
              <ChevronRight className="h-4 w-4 -ml-1" />
            </Button>
          </div>

          {/* Social icons row */}
          <div className="flex items-center gap-2 mt-3">
            {displayedSocials.map((link) => {
              const Icon = socialIconMap[link.name];
              if (!Icon) return null;
              return (
                <a
                  key={link.name}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:border-accent-pink hover:text-accent-pink transition-colors"
                  aria-label={link.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
