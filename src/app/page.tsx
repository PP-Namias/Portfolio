"use client";

import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { EducationSection } from '@/components/sections/EducationSection';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <main id="main-content" className="mx-auto max-w-container px-4 sm:px-6 pt-6 lg:pt-8">
      {/* Header — full width, single hero card */}
      <Card className="mb-4">
        <HeroSection />
      </Card>

      {/* Two-column resume body */}
      {/* Mobile: stacks single column. Desktop: 38% left (skills/education/certs) | 62% right (summary/experience/projects) */}
      <div className="grid grid-cols-1 lg:grid-cols-[38%_1fr] lg:gap-x-8 lg:items-start">
        {/* Left column — short, list-like, scannable */}
        <div className="space-y-7">
          <section data-section="skills" aria-labelledby="skills-heading">
            <TechStackSection />
          </section>
          <hr className="border-border-light dark:border-border-dark" />
          <section data-section="education" aria-labelledby="education-heading">
            <EducationSection />
          </section>
          <hr className="border-border-light dark:border-border-dark" />
          <section data-section="certifications" aria-labelledby="certifications-heading">
            <CertificationsSection />
          </section>
        </div>

        {/* Right column — narrative, detailed */}
        <div className="mt-7 lg:mt-0 space-y-7">
          <section data-section="about" aria-labelledby="about-heading">
            <AboutSection />
          </section>
          <hr className="border-border-light dark:border-border-dark" />
          <section data-section="experience" aria-labelledby="experience-heading">
            <ExperienceTimeline />
          </section>
          <hr className="border-border-light dark:border-border-dark" />
          <section data-section="projects" aria-labelledby="projects-heading">
            <ProjectsSection />
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
