'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from '@/components/ui/OptimizedImage';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  MapPin,
  Mail,
  Download,
  Calendar,
} from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ColorSchemePicker } from '@/components/ui/ColorSchemePicker';
import { HackedText } from '@/components/ui/hacked-text';
import { useModal } from '@/hooks/useModal';
import { useCmsContent } from '@/hooks/useCmsContent';
import { IS_BLOG_VISIBLE } from '@/lib/features';
import { sanityField } from '@/utils/sanity-data-attribute';

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  twitter: FaXTwitter,
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
  const { profile, socialLinks, hero } = useCmsContent();
  const roles = hero.roles.length > 0 ? hero.roles : [profile.title];
  const mainProfileImage = hero.profileImageUrl;
  const [roleIndex, setRoleIndex] = useState(0);
  const [activeProfileImage, setActiveProfileImage] = useState(mainProfileImage);
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
  }, [roles.length]);

  const displayedSocials = socialLinks.filter((s) =>
    ['github', 'linkedin', 'twitter', 'x'].includes(s.name)
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

  const handlePhotoMouseEnter = useCallback(() => {
    setActiveProfileImage((currentImage) => (currentImage === mainProfileImage ? currentImage : mainProfileImage));
  }, [mainProfileImage]);

  const handlePhotoMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setActiveProfileImage(mainProfileImage);
  }, [mainProfileImage, rotateX, rotateY]);

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.section
      className="relative py-1 sm:py-2"
      aria-labelledby="hero-heading"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Controls — top-right corner */}
      <motion.div
        className="mb-4 flex w-full items-center justify-end gap-2 md:absolute md:right-0 md:top-1 md:z-10 md:mb-0 md:w-auto"
        variants={itemVariants}
      >
        <ColorSchemePicker />
        <ThemeToggle />
      </motion.div>

      <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-center gap-6 sm:gap-7 lg:gap-8 md:pt-2 lg:pt-1">
        {/* Profile Photo — 3D tilt card */}
        <motion.div className="flex-shrink-0" variants={photoVariants}>
          <div className="[perspective:600px]">
            <motion.div
              ref={photoRef}
              className="group relative h-[188px] w-[160px] cursor-pointer rounded-2xl border border-border-light dark:border-border-dark shadow-md transition-[box-shadow,border-color] duration-300 ease-out hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:border-accent-pink/40"
              style={{ rotateX: smoothRotateX, rotateY: smoothRotateY }}
              whileHover={{ scale: 1.06, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onMouseEnter={handlePhotoMouseEnter}
              onMouseMove={handlePhotoMouseMove}
              onMouseLeave={handlePhotoMouseLeave}
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeProfileImage}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    {activeProfileImage ? (
                      <Image
                        src={activeProfileImage}
                        alt={profile.name}
                        fill
                        sizes="(max-width: 640px) 160px, 160px"
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-pink/20 to-accent-pink/40 text-2xl font-bold text-accent-pink">
                        {initials}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Identity + Actions */}
          <div className="flex-1 min-w-0 space-y-4 sm:space-y-5">
          {/* Name + Role block */}
          <div>
            <motion.h1
              id="hero-heading"
              className="text-[1.7rem] sm:text-[2.05rem] font-bold text-text-primary-light dark:text-text-primary-dark inline-flex items-center flex-wrap justify-center sm:justify-start leading-[1.15] tracking-tight"
              variants={itemVariants}
              {...sanityField({id: 'profile', type: 'profile'}, 'fullName')}
            >
              <HackedText
                text={profile.name}
                className="text-text-primary-light dark:text-text-primary-dark"
              />
              <VerifiedBadge />
            </motion.h1>

            <motion.div className="h-8 mt-1.5 overflow-hidden" variants={itemVariants}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIndex}
                  className="text-[15px] sm:text-base font-semibold text-accent-pink"
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35 }}
                  {...sanityField({id: 'profile', type: 'profile'}, 'heroRoles', roleIndex)}
                >
                  {roles[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Location + Availability + Socials — one line */}
          <motion.div
            className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[13px] sm:text-sm"
            variants={itemVariants}
          >
            <div className="flex items-center gap-1.5 text-text-muted-light dark:text-text-muted-dark">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{profile.location}</span>
            </div>
            <span className="text-border-light dark:text-border-dark">·</span>
            <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              {hero.availabilityLabel || 'Available'}
            </span>
            <span className="text-border-light dark:text-border-dark">·</span>
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
                    className="h-11 w-11 rounded flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors"
                    aria-label={link.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
                    whileHover={{ y: -1 }}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </motion.a>
                );
              })}
              {IS_BLOG_VISIBLE && (
                <>
                  <span className="mx-0.5 h-3.5 w-px bg-border-light dark:bg-border-dark" />
                  <motion.a
                    href="/blog"
                    className="h-7 rounded px-1.5 flex items-center text-[12px] font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.68, type: 'spring', stiffness: 300, damping: 20 }}
                    whileHover={{ y: -1 }}
                  >
                    Blog
                  </motion.a>
                </>
              )}
            </div>
          </motion.div>

          {/* CTAs — compact row */}
          <motion.div
            className="flex flex-wrap items-center justify-center sm:justify-start gap-2"
            variants={itemVariants}
          >
            <Button
              variant="primary"
              size="sm"
              onClick={() => openModal('resume')}
              className="h-9 px-4 shadow-lg shadow-accent-pink/25 hover:shadow-xl hover:shadow-accent-pink/30 transition-shadow"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openModal('booking')}
              className="h-9 px-4"
            >
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Book a Call
            </Button>
            <a
              href="mailto:pp.namias@gmail.com"
              className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg px-4 text-[13px] font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Email
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

