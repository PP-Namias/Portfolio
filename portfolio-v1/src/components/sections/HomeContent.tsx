'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ProjectsSectionRevamped } from '@/components/sections/ProjectsSectionRevamped';
import { BlogSection } from '@/components/sections/BlogSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { ConnectSection } from '@/components/sections/ConnectSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { StickyTwoColumn } from '@/components/sections/StickyTwoColumn';
import { IS_PROJECTS_REVAMP_ENABLED } from '@/lib/features';

export function HomeContent() {
  return (
    <main id="main-content" className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12">
      <Card className="mb-4">
        <HeroSection />
      </Card>

      <StickyTwoColumn
        left={
          <>
            <Card>
              <AboutSection />
            </Card>
            <Card>
              <TechStackSection />
            </Card>
            <Card id="projects">
              {IS_PROJECTS_REVAMP_ENABLED ? <ProjectsSectionRevamped /> : <ProjectsSection />}
            </Card>
          </>
        }
        right={
          <>
            <Card>
              <ExperienceTimeline />
            </Card>
            <Card>
              <ConnectSection />
            </Card>
          </>
        }
      />

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <Card>
          <SectionErrorBoundary name="BlogSection">
            <BlogSection />
          </SectionErrorBoundary>
        </Card>
        <Card>
          <SectionErrorBoundary name="CertificationsSection">
            <CertificationsSection />
          </SectionErrorBoundary>
        </Card>
      </div>

      <Card className="mt-4">
        <SectionErrorBoundary name="GallerySection">
          <GallerySection />
        </SectionErrorBoundary>
      </Card>

      <Footer />
    </main>
  );
}
