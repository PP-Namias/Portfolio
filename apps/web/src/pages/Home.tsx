import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechnicalSkillsSection from "@/components/TechnicalSkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import CertificationsSection from "@/components/CertificationsSection";
import ProjectsSection from "@/components/ProjectsSection";
import { BlogPreviewSection } from "@/components/BlogPreviewSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PersonStructuredData, WebSiteStructuredData } from "@/components/StructuredData";
import ResourcePreload from "@/components/ResourcePreload";

export default function Home() {
  useEffect(() => {
    // Scroll fade-in animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = document.querySelectorAll(".scroll-fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white dark:bg-background dark:text-foreground">
      <SEO />
      <PersonStructuredData />
      <WebSiteStructuredData />
      <ResourcePreload 
        images={[
          "/profile.jpeg",
          "/gallery/PortFolioCoverPhoto.png"
        ]}
      />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <TechnicalSkillsSection />
      <ExperienceSection />
      <CertificationsSection />
      <ProjectsSection />
      <BlogPreviewSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
}
