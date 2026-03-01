import { Footer } from "@/components/partials/footer";
import { FloatingActionButton } from "@/components/common/floating-action-button";
import { SectionHeader } from "@/components/common/section-header";
import { AnimatedSection } from "@/components/common/animated-section";
import { GithubActivityCalendar } from "@/sections/github-activity-calendar";
import { GithubStats } from "@/sections/github-stats";
import { Memberships } from "@/sections/memberships";
import { Experiences } from "@/sections/experiences";
import { Projects } from "@/sections/projects";
import Certifications from "@/sections/certifications";
import Gallery from "@/sections/gallery";
import { Recommendations } from "@/sections/recommendations";
import { Contact } from "@/sections/contact";
import Technologies from "@/sections/technologies";
import { ProfileCard } from "@/components/features/profile/profile-card";
import { createFileRoute } from "@tanstack/react-router";
import { useSEO } from "@/hooks/use-seo";
import {
  sectionMetadata,
  generatePersonSchema,
  generateWebsiteSchema,
  generateProfileSchema,
} from "@/utilities/seo";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  useSEO({
    metadata: sectionMetadata.home,
    schema: [
      generatePersonSchema(),
      generateWebsiteSchema(),
      generateProfileSchema(),
    ],
  });

  return (
    <div className="bg-grid min-h-screen">
      <FloatingActionButton />
      <div className="bg-custom-background mx-auto w-full max-w-480 p-2 sm:p-4 lg:flex lg:gap-4 lg:p-6">
        {/* Left column — slim sticky profile card on desktop */}
        <div className="space-y-2 lg:sticky lg:top-4 lg:w-4/12 lg:self-start 2xl:w-3/12">
          <ProfileCard />
          <div className="hidden lg:block">
            <Footer />
          </div>
        </div>

        {/* Right column — all sections stacked with scroll-triggered animations */}
        <div className="mt-2 space-y-4 lg:mt-0 lg:w-8/12 2xl:w-9/12">
          <AnimatedSection
            id="experiences"
            className="bg-background rounded-xl p-4"
          >
            <SectionHeader title="Career Snapshot" />
            <div className="mt-3">
              <Experiences />
            </div>
          </AnimatedSection>

          <AnimatedSection
            id="technologies"
            className="bg-background rounded-xl p-4"
            delay={0.05}
          >
            <SectionHeader title="Tech Stack" />
            <div className="mt-3">
              <Technologies />
            </div>
          </AnimatedSection>

          <AnimatedSection
            id="projects"
            className="bg-background rounded-xl p-4"
            delay={0.05}
          >
            <SectionHeader title="Recent Projects" viewAllHref="/projects" />
            <div className="mt-3">
              <Projects limit={4} />
            </div>
          </AnimatedSection>

          <AnimatedSection
            id="certifications"
            className="bg-background rounded-xl p-4"
            delay={0.05}
          >
            <SectionHeader
              title="Recent Certifications"
              viewAllHref="/certifications"
            />
            <div className="mt-3">
              <Certifications limit={4} />
            </div>
          </AnimatedSection>

          <AnimatedSection
            id="github"
            className="bg-background rounded-xl p-4"
            delay={0.05}
          >
            <SectionHeader title="GitHub Activity" />
            <div className="mt-3 space-y-3">
              <GithubStats />
              <GithubActivityCalendar />
            </div>
          </AnimatedSection>

          <AnimatedSection
            id="recommendations"
            className="bg-background rounded-xl p-4"
            delay={0.05}
          >
            <SectionHeader title="Recommendations" />
            <div className="mt-3">
              <Recommendations />
            </div>
          </AnimatedSection>

          <AnimatedSection
            id="memberships"
            className="bg-background rounded-xl p-4"
            delay={0.05}
          >
            <SectionHeader title="Memberships" />
            <div className="mt-3">
              <Memberships />
            </div>
          </AnimatedSection>

          <AnimatedSection
            id="gallery"
            className="bg-background rounded-xl p-4"
            delay={0.05}
          >
            <SectionHeader title="Gallery" viewAllHref="/gallery" />
            <div className="mt-3">
              <Gallery limit={8} />
            </div>
          </AnimatedSection>

          <AnimatedSection
            id="contact"
            className="bg-background rounded-xl p-4"
            delay={0.05}
          >
            <SectionHeader title="Get in Touch" />
            <div className="mt-3">
              <Contact />
            </div>
          </AnimatedSection>

          <div className="block pb-4 lg:hidden">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
