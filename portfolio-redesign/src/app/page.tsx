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
      <section className="py-16 bg-secondary border-t border-border" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-secondary mb-8 max-w-2xl mx-auto">
              I'm always interested in discussing new opportunities, innovative projects, 
              and ways to leverage technology for positive impact. Let's connect and explore 
              how we can work together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Schedule a Consultation
              </button>
              <button className="btn-secondary">
                View My Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-primary border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-tertiary text-sm">
              © 2024 PP Namias. Built with Next.js, TypeScript, and modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
