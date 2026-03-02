'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Mail, ChevronRight, ExternalLink } from 'lucide-react';
import { profile } from '@/data/profile';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function HeroSection() {
  return (
    <motion.section
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Theme toggle */}
      <div className="absolute top-0 right-0">
        <ThemeToggle />
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Profile Photo */}
        <div className="flex-shrink-0">
          <div className="h-[150px] w-[150px] rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
            <Image
              src="/images/profile/me.jpg"
              alt={profile.name}
              width={150}
              height={150}
              className="h-full w-full object-cover"
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

          {/* Location */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <MapPin className="h-3.5 w-3.5 text-text-muted-light dark:text-text-muted-dark" />
            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {profile.location}
            </span>
          </div>

          {/* Title */}
          <p className="mt-2 text-base font-medium text-text-primary-light dark:text-text-primary-dark">
            {profile.title}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <Button variant="primary" size="md" href={profile.github}>
              View GitHub
              <ExternalLink className="h-3.5 w-3.5" />
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
        </div>
      </div>
    </motion.section>
  );
}
