import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { RecommendationsCarousel } from '@/components/sections/RecommendationsCarousel';
import { MembershipsSection } from '@/components/sections/MembershipsSection';
import { SpeakingSection } from '@/components/sections/SpeakingSection';
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
      <div className="flex flex-col lg:flex-row gap-4 mt-0">
        {/* Main content */}
        <div className="w-full lg:w-[62%] space-y-4">
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

        {/* Sidebar: Experience, Memberships, Speaking only */}
        <div className="w-full lg:w-[38%] space-y-4">
          <aside className="lg:sticky lg:top-8 lg:self-start space-y-4">
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
      </div>

      {/* Certs and Recommendations side by side — full width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Card>
          <CertificationsSection />
        </Card>
        <Card>
          <RecommendationsCarousel />
        </Card>
      </div>

      {/* Social Links + Contact card | Latest Blog card — side by side */}
      <div className="mt-4">
        <ConnectSection />
      </div>

      {/* Full-width gallery */}
      <Card className="mt-4">
        <GallerySection />
      </Card>

      {/* Footer */}
      <Footer />
    </main>
  );
}
