import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { ConnectSection } from '@/components/sections/ConnectSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <main id="main-content" className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12">
      {/* Hero spans full container width */}
      <Card className="mb-4">
        <HeroSection />
      </Card>

      {/* Two-column layout: Main + Sidebar */}
      {/* Mobile: About → Experience + Connect → TechStack → Projects */}
      {/* Desktop: Left (About, TechStack, Projects) | Right sticky (Experience, Connect) */}
      <div className="grid grid-cols-1 lg:grid-cols-[62%_1fr] gap-4 mt-4">
        <div className="order-1 lg:order-none lg:col-start-1">
          <div className="lg:sticky lg:top-4 space-y-4">
            <Card>
              <AboutSection />
            </Card>

            <Card>
              <TechStackSection />
            </Card>

            <Card>
              <ProjectsSection />
            </Card>
          </div>
        </div>

        <div className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-3 space-y-4">
          <Card>
            <ExperienceTimeline />
          </Card>
          <Card>
            <ConnectSection />
          </Card>
        </div>
      </div>

      {/* Certifications — full width */}
      <Card className="mt-4">
        <CertificationsSection />
      </Card>

      {/* Full-width gallery */}
      <Card className="mt-4">
        <GallerySection />
      </Card>

      {/* Footer */}
      <Footer />
    </main>
  );
}
