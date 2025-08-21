'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

const navigation = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleSectionChange = () => {
      const sections = navigation.map(item => item.href.slice(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleSectionChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleSectionChange);
    };
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'backdrop-blur-md bg-white/80 dark:bg-black/80 shadow-md' 
            : 'bg-transparent'
        }`}
        style={{
          backgroundColor: isScrolled ? 'var(--color-bg-primary)' : 'transparent',
          borderBottom: isScrolled ? '1px solid var(--color-border)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Name */}
            <div className="flex-shrink-0">
              <button
                onClick={() => scrollToSection('#hero')}
                className="text-lg font-semibold transition-colors hover:text-blue-600 dark:hover:text-green-400"
                style={{ color: 'var(--color-text-primary)' }}
              >
                PP Namias
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md relative ${
                    activeSection === item.href.slice(1)
                      ? 'text-blue-600 dark:text-green-400'
                      : 'hover:text-blue-600 dark:hover:text-green-400'
                  }`}
                  style={{ 
                    color: activeSection === item.href.slice(1) 
                      ? 'var(--color-accent)' 
                      : 'var(--color-text-secondary)' 
                  }}
                >
                  {item.name}
                  {activeSection === item.href.slice(1) && (
                    <span 
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="absolute top-16 left-0 right-0 p-4"
            style={{ 
              backgroundColor: 'var(--color-bg-primary)',
              borderBottom: '1px solid var(--color-border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left px-4 py-3 text-base font-medium rounded-md transition-colors ${
                    activeSection === item.href.slice(1)
                      ? 'bg-blue-50 text-blue-600 dark:bg-green-900/20 dark:text-green-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  style={{ 
                    color: activeSection === item.href.slice(1) 
                      ? 'var(--color-accent)' 
                      : 'var(--color-text-primary)',
                    backgroundColor: activeSection === item.href.slice(1) 
                      ? 'var(--color-bg-secondary)' 
                      : 'transparent'
                  }}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16" />
    </>
  );
};
