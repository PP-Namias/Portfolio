import { personalInfo } from '@/data/personal';

export function FooterMinimalist() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section-sm border-t border-gray-200 dark:border-gray-800">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="body-small">
              © {currentYear} {personalInfo.profile.name}. All rights reserved.
            </p>
          </div>
          
          {/* Simple Links */}
          <div className="flex items-center gap-6">
            <a 
              href="#about" 
              className="body-small hover:text-blue-600 transition-colors"
            >
              About
            </a>
            <a 
              href="#projects" 
              className="body-small hover:text-blue-600 transition-colors"
            >
              Projects
            </a>
            <a 
              href="#contact" 
              className="body-small hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
