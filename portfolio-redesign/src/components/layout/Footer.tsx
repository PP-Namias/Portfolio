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
    <footer className="relative bg-gradient-to-br from-surface via-background to-surface border-t border-default overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="absolute top-6 right-6 z-10 p-3 glass-card group hover:scale-110 transition-all duration-300"
        title="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
      </motion.button>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
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
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-white">P</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    {personalInfo.profile.name}
                  </h3>
                  <p className="text-sm text-accent font-medium">
                    {personalInfo.profile.title}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-secondary leading-relaxed mb-4">
                Building the future of technology through innovative solutions and meaningful applications. 
                Passionate about AI, full-stack development, and creating positive impact through code.
              </p>

              <div className="flex items-center space-x-2 text-sm text-secondary">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.profile.location}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-primary mb-6 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-accent" />
                <span>Quick Navigation</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {quickLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-2 text-sm text-secondary hover:text-accent transition-colors duration-200 p-2 rounded-lg hover:bg-surface/50"
                  >
                    <span>{link.emoji}</span>
                    <span>{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Social Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-primary mb-6 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-accent" />
                <span>Let&apos;s Connect</span>
              </h3>
              
              <div className="space-y-4">
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
                      <button
                        onClick={handleEmailCopy}
                        className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-surface/50 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <social.icon className="w-5 h-5 text-accent" />
                          <div className="text-left">
                            <div className="text-sm font-medium text-primary">{social.name}</div>
                            <div className="text-xs text-secondary">{social.description}</div>
                          </div>
                        </div>
                        <div className="text-xs text-accent font-medium">
                          {emailCopied ? 'Copied!' : 'Click to copy'}
                        </div>
                      </button>
                    ) : (
                      <a
                        href={social.href}
                        target={social.href.startsWith('http') ? '_blank' : undefined}
                        rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-surface/50 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <social.icon className="w-5 h-5 text-accent" />
                          <div>
                            <div className="text-sm font-medium text-primary">{social.name}</div>
                            <div className="text-xs text-secondary">{social.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-accent font-medium">{social.followers}</span>
                          <ExternalLink className="w-3 h-3 text-secondary group-hover:text-accent transition-colors" />
                        </div>
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-secondary">
              <span>© {currentYear} {personalInfo.profile.name}. All rights reserved.</span>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap items-center justify-center space-x-2 text-sm">
              <span className="text-secondary">Built with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse mx-1" />
              <span className="text-secondary">using</span>
              <div className="flex flex-wrap items-center space-x-2 ml-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-full text-xs font-medium text-accent"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-sm text-green-400 font-medium">
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
            className="mt-8 text-center border-t border-default pt-6"
          >
            <p className="text-xs text-muted font-mono mb-2">
              console.log(&quot;Thanks for visiting! 🚀&quot;);
            </p>
            <p className="text-xs text-muted">
              Made with passion, fueled by ☕ and driven by the desire to create amazing things.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
