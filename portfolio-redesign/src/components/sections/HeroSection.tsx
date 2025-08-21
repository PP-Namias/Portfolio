'use client';

import { Calendar, Mail, Download, MapPin, ExternalLink, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Full-Stack Software Engineer';
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, []);

  const badges = [
    { text: 'PHP Developer Expert', color: 'chip-primary', icon: Trophy },
    { text: 'DICT OpenGov HacKathon 2025 Champion', color: 'chip-accent', icon: Sparkles },
    { text: 'Available for Projects', color: 'chip-success', icon: null },
  ];

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://linkedin.com/in/pp-namias', icon: ExternalLink },
    { name: 'GitHub', href: 'https://github.com/PP-Namias', icon: ExternalLink },
    { name: 'Twitter', href: '#', icon: ExternalLink },
  ];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary rounded-full opacity-10 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-secondary rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Enhanced Profile Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="w-36 h-36 mx-auto rounded-full bg-gradient-primary p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                  <img 
                    src="/profile.jpeg" 
                    alt="PP Namias" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              {/* Status Indicator */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-success rounded-full border-4 border-background animate-pulse" />
            </div>
          </motion.div>

          {/* Enhanced Name and Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="heading-xl mb-4">
              <span className="text-gradient">
                PP Namias
              </span>
            </h1>
            <div className="heading-md text-secondary mb-4">
              {displayText}
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-accent"
              >
                |
              </motion.span>
            </div>
          </motion.div>

          {/* Enhanced Location and Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8"
          >
            <div className="flex items-center gap-2 chip">
              <MapPin className="w-4 h-4" />
              <span>Manila, Philippines</span>
            </div>
            <div className="flex items-center gap-2 chip-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>Available for work</span>
            </div>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary group relative overflow-hidden"
            >
              <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Schedule a Call
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Send Email
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-accent group"
            >
              <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Download Resume
            </motion.button>
          </motion.div>

          {/* Enhanced Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {badges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`chip ${badge.color} cursor-pointer group`}
                >
                  {IconComponent && <IconComponent className="w-3 h-3 group-hover:scale-110 transition-transform" />}
                  <span className="font-medium">{badge.text}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Enhanced Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex items-center justify-center gap-4"
          >
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-surface border border-default hover:border-accent transition-all duration-300 group shadow-sm hover:shadow-md"
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5 text-secondary group-hover:text-accent transition-colors" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1 h-3 bg-accent rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
