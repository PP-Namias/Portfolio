import { Header } from '@/components/layout/Header';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { BeyondCodingSection } from '@/components/sections/BeyondCodingSection';
import { SimpleBlogSection } from '@/components/sections/SimpleBlogSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* Header with Professional Profile */}
      <Header />

      {/* Main Content in Bryl Lim Style Layout */}
      <section className="py-8 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Main Content Area (8/12) */}
            <div className="lg:col-span-8 space-y-8">
              <AboutSection />
              <ExperienceTimeline />
              <BeyondCodingSection />
              <SimpleBlogSection />
            </div>
            
            {/* Right Column - Sidebar (4/12) */}
            <div className="lg:col-span-4 space-y-8">
              <TechStackSection />
              <ProjectsSection />
              <CertificationsSection />
              <ContactSection />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
