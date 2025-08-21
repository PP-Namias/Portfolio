import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { TwoColumnLayout } from '@/components/layout/TwoColumnLayout';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';

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
            </>
          }
          rightContent={
            <>
              <ExperienceTimeline />
              {/* Projects Section - Placeholder for now */}
              <section className="card" id="projects">
                <h2 className="text-xl font-semibold text-primary mb-6">Featured Projects</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                    <h3 className="font-medium text-primary mb-2">AI-Powered Portfolio Website</h3>
                    <p className="text-sm text-secondary mb-3">
                      Modern Next.js portfolio with AI integration, featuring dynamic content generation and intelligent user interactions.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {['Next.js', 'TypeScript', 'AI/ML', 'Tailwind CSS'].map((tech) => (
                        <span key={tech} className="badge-sm">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                    <h3 className="font-medium text-primary mb-2">Full-Stack E-commerce Platform</h3>
                    <p className="text-sm text-secondary mb-3">
                      Complete e-commerce solution with payment integration, inventory management, and analytics dashboard.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {['React', 'Node.js', 'PostgreSQL', 'Stripe API'].map((tech) => (
                        <span key={tech} className="badge-sm">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
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
