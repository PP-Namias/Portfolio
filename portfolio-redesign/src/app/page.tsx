import { Header } from '@/components/layout/Header';
import { TwoColumnLayout } from '@/components/layout/TwoColumnLayout';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { BeyondCodingSection } from '@/components/sections/BeyondCodingSection';
import { SimpleBlogSection } from '@/components/sections/SimpleBlogSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FooterCompact } from '@/components/layout/FooterCompact';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header with Professional Profile */}
      <Header />

      {/* Main Content in Bryl Lim Style Layout */}
      <section className="section-sm bg-background">
        <div className="container">
          <TwoColumnLayout
            leftContent={
              <>
                <AboutSection />
                <TechStackSection />
                <CertificationsSection />
                <BeyondCodingSection />
              </>
            }
            rightContent={
              <>
                <ExperienceTimeline />
                <ProjectsSection />
                <SimpleBlogSection />
              </>
            }
          />
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <FooterCompact />
    </main>
  );
}
