import { Suspense } from 'react';
import { SectionProvider } from './SectionProvider';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { TechStackSection } from './TechStackSection';
import { ProjectsSection } from './ProjectsSection';
import { ProjectsSectionRevamped } from './ProjectsSectionRevamped';
import { ExperienceTimeline } from './ExperienceTimeline';
import { ConnectSection } from './ConnectSection';
import { BlogSection } from './BlogSection';
import { CertificationsSection } from './CertificationsSection';
import { GallerySection } from './GallerySection';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { StickyTwoColumn } from './StickyTwoColumn';
import { SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { IS_PROJECTS_REVAMP_ENABLED, IS_BLOG_VISIBLE } from '@/lib/features';
import { fetchHeroData } from '@/lib/sections/hero.server';
import { fetchAboutData } from '@/lib/sections/about.server';
import { fetchTechStackData } from '@/lib/sections/tech-stack.server';
import { fetchProjectsData } from '@/lib/sections/projects.server';
import { fetchExperienceData } from '@/lib/sections/experience.server';
import { fetchConnectData } from '@/lib/sections/connect.server';
import { fetchBlogData } from '@/lib/sections/blog.server';
import { fetchCertificationsData } from '@/lib/sections/certifications.server';
import { fetchGalleryData } from '@/lib/sections/gallery.server';
import { fetchSiteSettingsData } from '@/lib/sections/site-settings.server';

import { AboutSkeleton } from './skeletons/AboutSkeleton';
import { TechStackSkeleton } from './skeletons/TechStackSkeleton';
import { ProjectsSkeleton } from './skeletons/ProjectsSkeleton';
import { ExperienceSkeleton } from './skeletons/ExperienceSkeleton';
import { ConnectSkeleton } from './skeletons/ConnectSkeleton';
import { BlogSkeleton } from './skeletons/BlogSkeleton';
import { CertificationsSkeleton } from './skeletons/CertificationsSkeleton';
import { GallerySkeleton } from './skeletons/GallerySkeleton';

async function HeroSectionStream() {
  const heroData = await fetchHeroData();
  return (
    <SectionProvider data={{ hero: heroData.hero, profile: heroData.profile as any, socialLinks: heroData.socialLinks }}>
      <HeroSection />
    </SectionProvider>
  );
}

async function AboutSectionStream() {
  const aboutData = await fetchAboutData();
  return (
    <SectionProvider data={{ about: aboutData }}>
      <AboutSection />
    </SectionProvider>
  );
}

async function TechStackSectionStream() {
  const techData = await fetchTechStackData();
  return (
    <SectionProvider data={{ technologies: techData.technologies, techCategories: techData.techCategories }}>
      <TechStackSection />
    </SectionProvider>
  );
}

async function ProjectsSectionStream() {
  const projectsData = await fetchProjectsData();
  return (
    <SectionProvider data={{ projects: projectsData.projects }}>
      {IS_PROJECTS_REVAMP_ENABLED ? <ProjectsSectionRevamped /> : <ProjectsSection />}
    </SectionProvider>
  );
}

async function ExperienceSectionStream() {
  const experienceData = await fetchExperienceData();
  return (
    <SectionProvider data={{ experiences: experienceData.experiences }}>
      <ExperienceTimeline />
    </SectionProvider>
  );
}

async function ConnectSectionStream() {
  const connectData = await fetchConnectData();
  return (
    <SectionProvider data={{ socialLinks: connectData.socialLinks }}>
      <ConnectSection />
    </SectionProvider>
  );
}

async function BlogSectionStream() {
  if (!IS_BLOG_VISIBLE) return null;
  const blogData = await fetchBlogData();
  return (
    <SectionProvider data={{ blogPosts: blogData.blogPosts }}>
      <BlogSection />
    </SectionProvider>
  );
}

async function CertificationsSectionStream() {
  const certData = await fetchCertificationsData();
  return (
    <SectionProvider data={{ certifications: certData.certifications }}>
      <CertificationsSection />
    </SectionProvider>
  );
}

async function GallerySectionStream() {
  const galleryData = await fetchGalleryData();
  return (
    <SectionProvider data={{ galleryImages: galleryData.galleryImages }}>
      <GallerySection />
    </SectionProvider>
  );
}

async function FooterStream() {
  const [heroData, siteSettings] = await Promise.all([fetchHeroData(), fetchSiteSettingsData()]);
  return (
    <SectionProvider data={{ profile: heroData.profile as any, socialLinks: heroData.socialLinks, siteSettings }}>
      <Footer />
    </SectionProvider>
  );
}

export function HomeContentStreaming() {
  return (
    <main id="main-content" className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12">
      <Card className="mb-4">
        <Suspense fallback={<div className="animate-pulse"><div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" /></div>}>
          <HeroSectionStream />
        </Suspense>
      </Card>

      <StickyTwoColumn
        left={
          <>
            <Card>
              <Suspense fallback={<AboutSkeleton />}>
                <AboutSectionStream />
              </Suspense>
            </Card>
            <Card>
              <Suspense fallback={<TechStackSkeleton />}>
                <TechStackSectionStream />
              </Suspense>
            </Card>
            <Card id="projects">
              <Suspense fallback={<ProjectsSkeleton />}>
                <ProjectsSectionStream />
              </Suspense>
            </Card>
          </>
        }
        right={
          <>
            <Card>
              <Suspense fallback={<ExperienceSkeleton />}>
                <ExperienceSectionStream />
              </Suspense>
            </Card>
            <Card>
              <Suspense fallback={<ConnectSkeleton />}>
                <ConnectSectionStream />
              </Suspense>
            </Card>
          </>
        }
      />

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <Card>
          <SectionErrorBoundary name="BlogSection">
            <Suspense fallback={<BlogSkeleton />}>
              <BlogSectionStream />
            </Suspense>
          </SectionErrorBoundary>
        </Card>
        <Card>
          <SectionErrorBoundary name="CertificationsSection">
            <Suspense fallback={<CertificationsSkeleton />}>
              <CertificationsSectionStream />
            </Suspense>
          </SectionErrorBoundary>
        </Card>
      </div>

      <Card className="mt-4">
        <SectionErrorBoundary name="GallerySection">
          <Suspense fallback={<GallerySkeleton />}>
            <GallerySectionStream />
          </Suspense>
        </SectionErrorBoundary>
      </Card>

      <Suspense fallback={<div className="mt-8 py-6 border-t border-gray-200 dark:border-gray-800"><div className="animate-pulse flex justify-center gap-4"><div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" /><div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" /><div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" /></div></div>}>
        <FooterStream />
      </Suspense>
    </main>
  );
}
