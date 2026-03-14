'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { MapPin, Mail, Download, Calendar, Github, Linkedin, Twitter, Instagram, ArrowUpRight } from 'lucide-react';
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

/* Staggered entrance variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const photoVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.05 },
  },
};

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const { openModal } = useModal();
  const photoRef = useRef<HTMLDivElement>(null);

  /* 3D tilt motion values */
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const displayedSocials = socialLinks.filter((s) =>
    ['github', 'linkedin', 'x', 'instagram'].includes(s.name)
  );

  const handlePhotoMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = photoRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(x * 16);
      rotateX.set(y * -16);
    },
    [rotateX, rotateY]
  );

  const handlePhotoMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.section
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Controls — top-right corner */}
      <motion.div
        className="flex items-center justify-center gap-2 mb-4 sm:absolute sm:top-0 sm:right-0 sm:mb-0 sm:z-10"
        variants={itemVariants}
      >
        <ColorSchemePicker />
        <ThemeToggle />
      </motion.div>

      <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-center gap-7">
        {/* Profile Photo — 160px with 3D tilt + gradient ring */}
        <motion.div className="flex-shrink-0" variants={photoVariants}>
          <div style={{ perspective: 600 }}>
            <motion.div
              ref={photoRef}
              className="group relative h-[160px] w-[160px] cursor-pointer shadow-lg border border-border-light dark:border-border-dark rounded-2xl"
              style={{ rotateX: smoothRotateX, rotateY: smoothRotateY }}
              whileHover={{ scale: 1.06 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onMouseMove={handlePhotoMouseMove}
              onMouseLeave={handlePhotoMouseLeave}
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                {/* Photo */}
                <Image
                  src="/images/profile/PP%20Namias.png"
                  alt={profile.name}
                  fill
                  sizes="(max-width: 640px) 160px, 160px"
                  className="object-cover brightness-100 group-hover:brightness-105 transition-[filter] duration-300"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Identity + Actions */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Name + Role block */}
          <div>
            <motion.h1
              className="text-2xl sm:text-[1.8rem] font-bold text-text-primary-light dark:text-text-primary-dark inline-flex items-center flex-wrap justify-center sm:justify-start leading-tight tracking-tight"
              variants={itemVariants}
            >
              {profile.name}
              <VerifiedBadge />
            </motion.h1>

            <motion.div className="h-7 mt-1 overflow-hidden" variants={itemVariants}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIndex}
                  className="text-[15px] font-semibold text-accent-pink"
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35 }}
                >
                  {roles[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Location + Availability + Socials — one dense info row */}
          <motion.div
            className="flex flex-col items-center sm:items-start gap-3"
            variants={itemVariants}
          >
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-text-muted-light dark:text-text-muted-dark" />
                <span className="text-[13px] text-text-muted-light dark:text-text-muted-dark">
                  {profile.location}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/25">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                </span>
                Available
              </span>
            </div>

            {/* Social icons — compact row */}
            <div className="flex items-center gap-1">
              {displayedSocials.map((link, i) => {
                const Icon = socialIconMap[link.name];
                if (!Icon) return null;
                return (
                  <motion.a
                    key={link.name}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 w-7 rounded-md flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink hover:bg-accent-pink/5 transition-colors"
                    aria-label={link.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
                    whileHover={{ y: -1 }}
                  >
                    <Icon className="h-[15px] w-[15px]" />
                  </motion.a>
                );
              })}
              <span className="mx-1 h-3.5 w-px bg-border-light dark:bg-border-dark" />
              <motion.a
                href="/blog"
                className="group/blog h-7 rounded-md px-2 flex items-center gap-1 text-[12px] font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink hover:bg-accent-pink/5 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.68, type: 'spring', stiffness: 300, damping: 20 }}
                whileHover={{ y: -1 }}
              >
                Blog
                <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-0.5 group-hover/blog:opacity-100 group-hover/blog:translate-x-0 transition-all duration-150" />
              </motion.a>
            </div>
          </motion.div>

          {/* CTAs — single row, clear hierarchy */}
          <motion.div
            className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5"
            variants={itemVariants}
          >
            <Button variant="primary" size="lg" onClick={() => openModal('resume')} className="shadow-lg shadow-accent-pink/25 hover:shadow-xl hover:shadow-accent-pink/30 transition-shadow">
              <Download className="h-4 w-4" />
              Resume
            </Button>
            <Button variant="outline" size="md" onClick={() => openModal('booking')}>
              <Calendar className="h-4 w-4" />
              Book a Call
            </Button>
            <Button variant="ghost" size="sm" href={`mailto:${profile.email}`}>
              <Mail className="h-3.5 w-3.5" />
              Email
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
