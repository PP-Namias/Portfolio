import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: Array<{ href: string; label: string; isRoute?: boolean }> = [
    { href: "#top", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#technical-skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#certifications", label: "Certifications" },
    { href: "#projects", label: "Projects" },
    { href: "#blog-preview", label: "Blog Preview" },
    { href: "#gallery", label: "Gallery" },
    { href: "#contact", label: "Contact" },
    { href: "/blog", label: "Blog", isRoute: true },
  ];

  const handleNavClick = (href: string, isRoute?: boolean) => {
    if (isRoute) {
      // Use Wouter's navigation for route changes
      if (href === '/blog' && location === '/blog') {
        // If already on blog page, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setLocation(href);
      }
    } else {
      // For anchor links, check if we're on the home page
      if (location === '/') {
        // We're on home page, scroll to section
        if (href === '#top') {
          // Scroll to top of page
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      } else {
        // We're on a different page, navigate to home first then scroll
        if (href === '#top') {
          setLocation('/');
        } else {
          setLocation('/' + href);
        }
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glassmorphism" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="text-2xl font-bold gradient-text cursor-pointer">Ervhyne</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Home Section with Sub Navigation */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick("#top")}
                className="hover:text-primary transition-colors duration-300 flex items-center space-x-1"
              >
                <span>Home</span>
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Sub Navigation Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-48 glassmorphism rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2 space-y-1">
                  {navItems.filter(item => !item.isRoute && item.href !== "#top").map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className="block w-full text-left px-3 py-2 rounded hover:text-primary hover:bg-white/10 transition-colors duration-300"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Blog as separate item */}
            <button
              onClick={() => handleNavClick("/blog", true)}
              className="hover:text-primary transition-colors duration-300"
            >
              Blog
            </button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glassmorphism rounded-lg p-4 space-y-4">
            {/* Home Section */}
            <div>
              <button
                onClick={() => handleNavClick("#top")}
                className="block w-full text-left font-semibold hover:text-primary transition-colors duration-300 mb-2"
              >
                Home
              </button>
              <div className="ml-4 space-y-2">
                {navItems.filter(item => !item.isRoute && item.href !== "#top").map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left text-sm hover:text-primary transition-colors duration-300 opacity-80"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Blog Section */}
            <button
              onClick={() => handleNavClick("/blog", true)}
              className="block w-full text-left font-semibold hover:text-primary transition-colors duration-300"
            >
              Blog
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
