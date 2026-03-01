'use client';

import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';

export function MainContent() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <TechStackSection />
      <ProjectsSection />
      <CertificationsSection />
    </div>
  );
}
