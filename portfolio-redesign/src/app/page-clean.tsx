import { Header } from '@/components/layout/HeaderMinimalist';
import { FooterMinimalist } from '@/components/layout/FooterMinimalist';
import { HeroSection } from '@/components/sections/HeroSectionMinimalist';
import { AboutSection } from '@/components/sections/AboutSectionMinimalist';
import { ExperienceSection } from '@/components/sections/ExperienceSectionMinimalist';
import { ProjectsSection } from '@/components/sections/ProjectsSectionMinimalist';
import { TechStackSection } from '@/components/sections/TechStackSectionMinimalist';
import { ContactSection } from '@/components/sections/ContactSectionMinimalist';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="fade-in">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <TechStackSection />
        <ProjectsSection />
        <ContactSection />
      </div>
      
      <FooterMinimalist />
    </main>
  );
}
