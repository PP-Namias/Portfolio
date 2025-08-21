import { Header } from '@/components/layout/Header';
import { TwoColumnLayout } from '@/components/layout/TwoColumnLayout';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { BeyondCodingSection } from '@/components/sections/BeyondCodingSection';
import { EnhancedProjectsSection } from '@/components/sections/EnhancedProjectsSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { RecentBlogPostsSection } from '@/components/sections/RecentBlogPostsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header with Professional Profile */}
      <Header />

      {/* Main Content in Bryl Lim Style Layout */}
      <section className="section" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <TwoColumnLayout
            leftContent={
              <>
                <AboutSection />
                <TechStackSection />
                <BeyondCodingSection />
              </>
            }
            rightContent={
              <>
                <ExperienceTimeline />
                <EnhancedProjectsSection />
                <CertificationsSection />
                <RecentBlogPostsSection />
              </>
            }
          />
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
