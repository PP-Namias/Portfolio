'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, X, User, Briefcase, Code, FolderOpen, Mail, Sun, Moon,
  Calendar, Send, Award, MapPin, CheckCircle, Trophy, Download,
  Star, Globe
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { personalInfo } from '@/data/personal';
import Image from 'next/image';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigation = useMemo(() => [
    { name: 'Home', href: '#home', icon: User },
    { name: 'About', href: '#about', icon: User },
    { name: 'Experience', href: '#experience', icon: Briefcase },
    { name: 'Skills', href: '#skills', icon: Code },
    { name: 'Projects', href: '#projects', icon: FolderOpen },
    { name: 'Contact', href: '#contact', icon: Mail },
  ], []);

  const iconMap = {
    Award,
    Trophy,
    CheckCircle,
    User,
    Calendar,
    Send,
    Star,
    Globe
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
      
      // Update active section
      const sections = navigation.map(item => item.href.slice(1));
      const scrollY = scrollPosition + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigation]);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Enhanced Professional Header Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="section-lg bg-background relative overflow-hidden"
        id="home"
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-primary rounded-full opacity-5 blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-secondary rounded-full opacity-5 blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Enhanced Profile Section */}
            <div className="lg:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-primary p-1 shadow-xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-surface">
                    <Image
                      src={personalInfo.profile.avatar || "/profile.jpeg"}
                      alt={personalInfo.profile.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
                {/* Enhanced Status Indicator */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-success rounded-full flex items-center justify-center shadow-lg border-4 border-background animate-pulse">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </motion.div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="heading-lg text-primary mb-2"
                  >
                    {personalInfo.profile.name}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="heading-sm text-secondary font-medium mb-3"
                  >
                    {personalInfo.profile.title}
                  </motion.p>
                </div>
                
                <div className="space-y-3">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center gap-2 chip"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{personalInfo.profile.location}</span>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-center gap-2 chip-success"
                  >
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="font-medium">
                      {personalInfo.profile.availability.message}
                    </span>
                  </motion.div>
                </div>

                {/* Enhanced Achievement Badges */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-wrap gap-2"
                >
                  {personalInfo.achievements.map((achievement, index) => {
                    const IconComponent = iconMap[achievement.icon as keyof typeof iconMap];
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="chip chip-accent cursor-pointer"
                      >
                        {IconComponent && <IconComponent className="w-3 h-3" />}
                        <span className="font-medium">{achievement.title}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>

            {/* Enhanced CTAs Section */}
            <div className="flex flex-col gap-6 lg:items-end">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary group relative overflow-hidden"
                  onClick={() => scrollToSection('#contact')}
                >
                  <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Schedule a Call</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary group"
                  onClick={() => window.open(`mailto:${personalInfo.profile.email}`)}
                >
                  <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Send Email</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-accent group"
                  onClick={() => window.open('/resume.pdf', '_blank')}
                >
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Download Resume</span>
                </motion.button>
              </motion.div>

              {/* Social Proof */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="glass-card card-compact"
              >
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-muted">5.0 rating • 50+ projects delivered</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Fixed Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-default shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#home')}
              className="font-bold text-xl text-gradient hover:scale-105 transition-transform"
            >
              PP Namias
            </motion.button>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                      activeSection === item.href.slice(1)
                        ? 'text-accent bg-accent-light shadow-sm border border-accent/20'
                        : 'text-secondary hover:text-primary hover:bg-surface/50 hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* Enhanced Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-surface/50 hover:bg-surface border border-default hover:border-accent/50 transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-accent" />
                )}
              </motion.button>

              {/* Enhanced Mobile Menu */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-3 rounded-xl bg-surface/50 hover:bg-surface border border-default hover:border-accent/50 transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-primary" />
                ) : (
                  <Menu className="w-5 h-5 text-primary" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="md:hidden py-4 border-t border-default"
            >
              <div className="glass-card card-compact">
                <div className="flex flex-col gap-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.name}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => scrollToSection(item.href)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeSection === item.href.slice(1)
                            ? 'text-accent bg-accent-light border border-accent/20'
                            : 'text-secondary hover:text-primary hover:bg-surface'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.nav>
          )}
        </div>
      </motion.header>
    </>
  );
};
