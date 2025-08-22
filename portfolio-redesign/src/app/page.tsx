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
    <main className="min-h-screen bg-background">
      {/* Header with Professional Profile */}
      <Header />

      {/* Main Content in Bryl Lim Style Layout */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Wider (8/12) */}
            <div className="lg:col-span-8 space-y-6">
              <AboutSection />
              <ExperienceTimeline />
              <BeyondCodingSection />
              <SimpleBlogSection />
            </div>
            
            {/* Right Column - Narrower (4/12) */}
            <div className="lg:col-span-4 space-y-6">
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
