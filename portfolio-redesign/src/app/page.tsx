import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
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
    <main className="min-h-screen bg-primary">
      {/* Header with Professional Profile */}
      <Header />

      {/* Hero Section with Typing Animation */}
      <HeroSection />

      {/* Main Content in Two-Column Bryl Lim Style Layout */}
      <section className="py-16 bg-primary">
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
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
