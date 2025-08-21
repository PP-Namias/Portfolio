'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ExternalLink, 
  Heart, 
  ArrowUp, 
  Code,
  Coffee,
  MapPin,
  Calendar,
  Star,
  Zap
} from 'lucide-react';
import { personalInfo } from '@/data/personal';

export const Footer = () => {
  const [emailCopied, setEmailCopied] = useState(false);

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/PP-Namias',
      icon: Github,
      username: '@PP-Namias',
      followers: '1.2k',
      description: 'Open source projects'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/pp-namias',
      icon: Linkedin,
      username: 'PP Namias',
      followers: '500+',
      description: 'Professional network'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/pp_namias',
      icon: Twitter,
      username: '@pp_namias',
      followers: '300+',
      description: 'Tech insights & updates'
    },
    {
      name: 'Email',
      href: `mailto:${personalInfo.profile.email}`,
      icon: Mail,
      username: personalInfo.profile.email,
      description: 'Direct contact',
      canCopy: true
    }
  ];

  const quickLinks = [
    { name: 'About', href: '#about', emoji: '👨‍💻' },
    { name: 'Experience', href: '#experience', emoji: '🚀' },
    { name: 'Skills', href: '#skills', emoji: '⚡' },
    { name: 'Projects', href: '#projects', emoji: '🛠️' },
    { name: 'Blog', href: '#blog', emoji: '📝' },
    { name: 'Contact', href: '#contact', emoji: '📞' }
  ];

  const stats = [
    { label: 'Years of Experience', value: '5+', icon: Calendar },
    { label: 'Projects Completed', value: '50+', icon: Code },
    { label: 'Happy Clients', value: '25+', icon: Star },
    { label: 'Coffee Consumed', value: '∞', icon: Coffee }
  ];

  const techStack = [
    'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'
  ];

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.profile.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <footer className="py-12 bg-primary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                {personalInfo.profile.name}
              </h3>
              <p className="text-sm text-secondary mb-4">
                {personalInfo.profile.title}
              </p>
              <p className="text-sm text-secondary">
                Building the future of technology through innovative solutions and meaningful applications. 
                Passionate about AI, full-stack development, and creating positive impact.
              </p>
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-secondary hover:text-accent transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Social Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-primary mb-4">Connect</h3>
            <div className="space-y-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center space-x-3 text-sm text-secondary hover:text-accent transition-colors duration-200 group"
                >
                  <social.icon className="w-4 h-4" />
                  <span>{social.username}</span>
                  {social.href.startsWith('http') && (
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-tertiary">
              <span>© {currentYear} {personalInfo.profile.name}. All rights reserved.</span>
            </div>

            {/* Tech Stack & Love */}
            <div className="flex items-center space-x-2 text-sm text-tertiary">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>using Next.js, TypeScript & Tailwind CSS</span>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">
                {personalInfo.profile.availability.message}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Easter Egg */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-tertiary/60 font-mono">
            console.log(&quot;Thanks for visiting! 🚀&quot;);
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
