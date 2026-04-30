import { HomeLayoutClient } from './HomeLayoutClient';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { ConnectSection } from '@/components/sections/ConnectSection';
import { GallerySection } from '@/components/sections/GallerySection';

export default async function Home() {
  return (
    <HomeLayoutClient
      heroNode={<HeroSection />}
      aboutNode={<AboutSection />}
      techStackNode={<TechStackSection />}
      projectsNode={<ProjectsSection />}
      experienceNode={<ExperienceTimeline />}
      connectNode={<ConnectSection />}
      certificationsNode={<CertificationsSection />}
      galleryNode={<GallerySection />}
    />
  );
}
