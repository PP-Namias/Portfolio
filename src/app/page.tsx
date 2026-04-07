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
import { StickySectionNav } from '@/components/ui/StickySectionNav';

export default function Home() {
  return (
    <main id="main-content" className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12">
      {/* Hero spans full container width */}
      <Card className="mb-4">
        <HeroSection />
      </Card>

      {/* Sticky quick navigation for better section scanning */}
      <StickySectionNav />

      {/* Two-column layout: Main + Sidebar */}
      {/* Mobile: About → Experience + Connect → TechStack → Projects */}
      {/* Desktop: Left (About, TechStack, Projects) | Right sticky rail (Experience, Connect) */}
      <div className="grid grid-cols-1 lg:grid-cols-[62%_1fr] gap-4 mt-4">
        <div className="order-1 lg:order-none lg:col-start-1 space-y-4">
          <section id="about" className="scroll-mt-24">
            <Card>
              <AboutSection />
            </Card>
          </section>

          <section id="tech" className="scroll-mt-24">
            <Card>
              <TechStackSection />
            </Card>
          </section>

          <section id="projects" className="scroll-mt-24">
            <Card>
              <ProjectsSection />
            </Card>
          </section>
        </div>

        <div className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:self-start lg:sticky lg:top-4">
          <div className="space-y-4 lg:max-h-[calc(100vh-1.5rem)] lg:overflow-y-auto lg:pr-1 chat-scrollbar">
            <section id="experience" className="scroll-mt-24">
              <Card>
                <ExperienceTimeline />
              </Card>
            </section>
            <section id="connect" className="scroll-mt-24">
              <Card>
                <ConnectSection />
              </Card>
            </section>
          </div>
        </div>
      </div>

      {/* Certifications — full width */}
      <section id="certifications" className="scroll-mt-24">
        <Card className="mt-4">
          <CertificationsSection />
        </Card>
      </section>

      {/* Full-width gallery */}
      <section id="gallery" className="scroll-mt-24">
        <Card className="mt-4">
          <GallerySection />
        </Card>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
