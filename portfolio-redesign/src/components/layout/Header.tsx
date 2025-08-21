'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, X, User, Briefcase, Code, FolderOpen, Mail, Sun, Moon,
  Calendar, Send, Award, MapPin, CheckCircle, Trophy
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { personalInfo } from '@/data/personal';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
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
    Send
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map(item => item.href.slice(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
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

  const getAchievementBadgeClass = (color: string) => {
    const colorClasses = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
  };

  return (
    <>
      {/* Professional Header Section - Bryl Lim Style */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="section bg-background border-b border-default"
        id="home"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  src={personalInfo.profile.avatar || "/profile.jpeg"}
                  alt={personalInfo.profile.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-card"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-sm border-3 border-background">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </motion.div>
              
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary">
                  {personalInfo.profile.name}
                </h1>
                <p className="text-lg sm:text-xl text-secondary font-medium">
                  {personalInfo.profile.title}
                </p>
                <div className="flex items-center text-muted text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {personalInfo.profile.location}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-success font-medium">
                    {personalInfo.profile.availability.message}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs and Achievements */}
            <div className="flex flex-col gap-4 lg:items-end">
              {/* Achievement Badges */}
              <div className="flex flex-wrap gap-2">
                {personalInfo.achievements.map((achievement, index) => {
                  const IconComponent = iconMap[achievement.icon as keyof typeof iconMap];
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="chip chip-accent"
                    >
                      {IconComponent && <IconComponent className="w-3 h-3" />}
                      {achievement.title}
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary"
                  onClick={() => scrollToSection('#contact')}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule a Call
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-secondary"
                  onClick={() => window.open(`mailto:${personalInfo.profile.email}`)}
                >
                  <Send className="w-4 h-4" />
                  Send Email
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Fixed Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-default shadow-card"
      >
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#home')}
              className="font-bold text-xl text-primary hover:text-accent transition-colors duration-200"
            >
              PP Namias
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 text-sm font-medium ${
                      activeSection === item.href.slice(1)
                        ? 'text-accent bg-accent-light shadow-sm'
                        : 'text-secondary hover:text-primary hover:bg-surface hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-2xl bg-surface hover:bg-border transition-all duration-200 shadow-sm hover:shadow-card"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-accent" />
                )}
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-2xl bg-surface hover:bg-border transition-all duration-200 shadow-sm hover:shadow-card"
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

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4 border-t border-default bg-surface/50 backdrop-blur-sm rounded-b-2xl mt-2 shadow-card"
            >
              <div className="flex flex-col space-y-1 px-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => scrollToSection(item.href)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                        activeSection === item.href.slice(1)
                          ? 'text-accent bg-accent-light shadow-sm'
                          : 'text-secondary hover:text-primary hover:bg-background hover:shadow-sm'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </div>
      </motion.header>
    </>
  );
};
