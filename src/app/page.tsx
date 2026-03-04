import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
// import { RecommendationsCarousel } from '@/components/sections/RecommendationsCarousel';
import { MembershipsSection } from '@/components/sections/MembershipsSection';
import { SpeakingSection } from '@/components/sections/SpeakingSection';
import { ConnectSection } from '@/components/sections/ConnectSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <main id="main-content" className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12">
      {/* Hero spans full container width */}
      <Card className="mb-4">
        <HeroSection />
      </Card>

      {/* Two-column layout: Main + Sidebar */}
      {/* Mobile: About → Experience → Memberships → Speaking → TechStack → Projects */}
      {/* Desktop: Left (About, TechStack, Projects) | Right sticky (Experience, Memberships, Speaking) */}
      <div className="grid grid-cols-1 lg:grid-cols-[62%_1fr] gap-4 mt-0">
        <div className="order-1 lg:order-none lg:col-start-1">
          <Card>
            <AboutSection />
          </Card>
        </div>

        <div className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-3">
          <aside className="lg:sticky lg:top-8 space-y-4">
            <Card>
              <ExperienceTimeline />
            </Card>
            <Card>
              <MembershipsSection />
            </Card>
            <Card>
              <SpeakingSection />
            </Card>
          </aside>
        </div>

        <div className="order-3 lg:order-none lg:col-start-1">
          <Card>
            <TechStackSection />
          </Card>
        </div>

        <div className="order-4 lg:order-none lg:col-start-1">
          <Card>
            <ProjectsSection />
          </Card>
        </div>
      </div>

      {/* Certifications + Connect side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Card>
          <CertificationsSection />
        </Card>
        <Card>
          <ConnectSection />
        </Card>
      </div>

      {/* Full-width gallery */}
      <Card className="mt-4">
        <GallerySection />
      </Card>

      {/* Minimal copyright */}
      <footer className="mt-8 pb-6 pt-3">
        <p className="text-center text-[11px] text-text-muted-light dark:text-text-muted-dark">
          &copy; {new Date().getFullYear()} Jhon Keneth Ryan Namias
        </p>
      </footer>
    </main>
  );
}
