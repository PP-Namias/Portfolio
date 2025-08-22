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
  Zap,
  Copy,
  CheckCircle
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
    <footer className="relative border-t border-[var(--color-border)] overflow-hidden bg-[var(--color-background)]">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-primary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 rounded-full blur-3xl" />
      </div>

      {/* Enhanced Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 right-6 z-10 w-12 h-12 glass-card group transition-all duration-300 flex items-center justify-center"
        title="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-[var(--color-accent)]" />
      </motion.button>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="glass-card card-compact text-center group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg"
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </motion.div>
                <div className="body-xl font-bold text-[var(--color-text-primary)] mb-1">{stat.value}</div>
                <div className="body-sm text-[var(--color-text-muted)]">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Enhanced About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card card-compact relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="body-lg font-bold text-white">P</span>
                  </div>
                  <div>
                    <h3 className="body-lg font-bold text-[var(--color-text-primary)]">
                      {personalInfo.profile.name}
                    </h3>
                    <p className="body-sm text-[var(--color-accent)] font-medium">
                      {personalInfo.profile.title}
                    </p>
                  </div>
                </div>
                
                <p className="body-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  Building the future of technology through innovative solutions and meaningful applications. 
                  Passionate about AI, full-stack development, and creating positive impact through code.
                </p>

                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="body-sm">{personalInfo.profile.location}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card card-compact">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="body-md font-bold text-[var(--color-text-primary)]">Quick Navigation</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, x: 4 }}
                    className="flex items-center gap-2 body-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200 p-2 rounded-lg hover:bg-[var(--color-surface-light)]"
                  >
                    <span>{link.emoji}</span>
                    <span>{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Social Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card card-compact">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-lg flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="body-md font-bold text-[var(--color-text-primary)]">Let&apos;s Connect</h3>
              </div>
              
              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={social.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    {social.canCopy ? (
                      <motion.button
                        onClick={handleEmailCopy}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-[var(--color-surface-light)] transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <social.icon className="w-5 h-5 text-[var(--color-accent)]" />
                          <div className="text-left">
                            <div className="body-sm font-medium text-[var(--color-text-primary)]">{social.name}</div>
                            <div className="body-xs text-[var(--color-text-secondary)]">{social.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {emailCopied ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-[var(--color-text-muted)]" />
                          )}
                          <span className="body-xs text-[var(--color-accent)] font-medium">
                            {emailCopied ? 'Copied!' : 'Copy'}
                          </span>
                        </div>
                      </motion.button>
                    ) : (
                      <motion.a
                        href={social.href}
                        target={social.href.startsWith('http') ? '_blank' : undefined}
                        rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-surface-light)] transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <social.icon className="w-5 h-5 text-[var(--color-accent)]" />
                          <div>
                            <div className="body-sm font-medium text-[var(--color-text-primary)]">{social.name}</div>
                            <div className="body-xs text-[var(--color-text-secondary)]">{social.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="body-xs text-[var(--color-accent)] font-medium">{social.followers}</span>
                          <ExternalLink className="w-3 h-3 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors" />
                        </div>
                      </motion.a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="glass-card card-compact relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 via-transparent to-[var(--color-primary)]/5" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-0">
              {/* Copyright */}
              <div className="flex items-center gap-2 body-sm text-[var(--color-text-secondary)]">
                <span>© {currentYear} {personalInfo.profile.name}. All rights reserved.</span>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap items-center justify-center gap-2 body-sm">
                <span className="text-[var(--color-text-secondary)]">Built with</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse mx-1" />
                <span className="text-[var(--color-text-secondary)]">using</span>
                <div className="flex flex-wrap items-center gap-2 ml-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="chip chip-primary body-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75" />
                </div>
                <span className="body-sm text-green-400 font-medium">
                  {personalInfo.profile.availability.message}
                </span>
              </div>
            </div>

            {/* Easter Egg */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-8 text-center border-t border-[var(--color-border)] pt-6"
            >
              <p className="body-xs text-[var(--color-text-muted)] font-mono mb-2">
                console.log(&quot;Thanks for visiting! 🚀&quot;);
              </p>
              <p className="body-xs text-[var(--color-text-muted)]">
                Made with passion, fueled by ☕ and driven by the desire to create amazing things.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
