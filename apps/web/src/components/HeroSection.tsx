import { useEffect, useState } from "react";
import { ChevronDown, Github, Linkedin, Mail, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useActiveResume, getResumeUrl } from "@/hooks/useResume";

export default function HeroSection() {
  const roles = [
    "Full Stack Web Developer",
    "AI Solutions Developer",
    "AI Engineer",
    "Automation Specialist",
    "Chatbot Developer",
  ];

  const typingText = useTypingEffect(roles, 100, 50, 2000);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  
  // Fetch active resume from CMS
  const { data: activeResume, isLoading: resumeLoading } = useActiveResume();
  const resumeUrl = getResumeUrl(activeResume);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden hero-pattern"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
      
      <div className="relative z-10 text-center px-6 mt-12 max-w-4xl mx-auto">
        <div className="scroll-fade-in">
          {/* Profile Image */}
          <div className="mb-4 sm:mb-8">
            <img
              src="/profile.jpeg"
              alt="Ervhyne R. Dalugdog - Full Stack Developer and AI Solutions Engineer"
              className="w-20 h-20 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-6 animate-float border-4 border-primary/50 shadow-2xl object-cover"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
            Hi, I'm <span className="gradient-text">Ervhyne</span>
          </h1>

          {/* Typing Effect */}
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-300 min-h-[1.5rem] sm:min-h-[2rem]">
            <span className="typing-cursor">{typingText}</span>
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl mb-8 sm:mb-12 text-gray-400 max-w-3xl mx-auto">
            Specializing in AI solutions, automation, and modern web
            applications. I design and deploy intelligent solutions that
            streamline workflows and enhance user experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
            <Button
              onClick={() => handleNavClick("#projects")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:from-blue-600 hover:to-purple-700 hover:scale-105 transform transition-all duration-300 shadow-lg animate-pulse-glow"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavClick("#contact")}
              className="border-2 border-blue-500 text-blue-400 bg-transparent px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              Get In Touch
            </Button>
            <Dialog open={isResumeOpen} onOpenChange={setIsResumeOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-2 border-purple-500 text-purple-400 bg-transparent px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300"
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  View Resume
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-2">
                  <DialogTitle className="gradient-text">
                    {activeResume?.resumeFile?.asset?.originalFilename || "Resume"} - Ervhyne R. Dalugdog
                  </DialogTitle>
                </DialogHeader>
                <div className="p-6 pt-0 h-[70vh]">
                  {resumeLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-400">Loading resume...</div>
                    </div>
                  ) : (
                    <iframe
                      src={resumeUrl}
                      className="w-full h-full rounded-lg border border-gray-700"
                      title={`${activeResume?.resumeFile?.asset?.originalFilename || "Resume"} - Ervhyne R. Dalugdog`}
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-8 sm:mb-12 ">
            <a
              href="https://github.com/Ervhyne"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-800/80 hover:bg-blue-500 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/25"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/ervhyne-dalugdog-867531359"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-800/80 hover:bg-blue-500 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/25"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-primary" />
      </div>
    </section>
  );
}
