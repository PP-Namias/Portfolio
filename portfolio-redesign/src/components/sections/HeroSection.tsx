'use client';

import { Calendar, Mail, Download, MapPin, ExternalLink } from 'lucide-react';
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
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const badges = [
    { text: 'PHP Developer Expert', color: 'chip' },
    { text: 'DICT OpenGov HacKathon 2025 Champion', color: 'chip-accent' },
    { text: 'Available for Projects', color: 'chip-success' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', href: '#', icon: ExternalLink },
    { name: 'GitHub', href: '#', icon: ExternalLink },
    { name: 'Twitter', href: '#', icon: ExternalLink },
  ];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-black dark:to-gray-900" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-green-500 p-1">
              <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">PN</span>
              </div>
            </div>
          </motion.div>

          {/* Name and Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                PP Namias
              </span>
            </h1>
            <div className="text-xl md:text-2xl text-secondary font-medium mb-2">
              {displayText}
              <span className="animate-pulse">|</span>
            </div>
          </motion.div>

          {/* Location and Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center space-x-6 mb-8 text-secondary"
          >
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Manila, Philippines</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Available for work</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
          >
            <button className="btn-primary group">
              <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Schedule a Call
            </button>
            <button className="btn-secondary group">
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Send Email
            </button>
            <button className="btn-secondary group">
              <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Download Resume
            </button>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {badges.map((badge, index) => (
              <motion.span
                key={badge.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color} backdrop-blur-sm`}
              >
                {badge.text}
              </motion.span>
            ))}
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex items-center justify-center space-x-6"
          >
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-lg transition-all hover:scale-110 hover:bg-surface"
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5 text-secondary" />
                </a>
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
            <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-bounce" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-4000" />
    </section>
  );
};
