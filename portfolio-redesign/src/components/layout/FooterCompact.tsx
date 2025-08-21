'use client';

import React from 'react';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { personalInfo } from '@/data/personal';

export const Footer = () => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/pp-namias',
      icon: Linkedin,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/PP-Namias',
      icon: Github,
    },
    {
      name: 'Email',
      href: `mailto:${personalInfo.profile.email}`,
      icon: Mail,
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-surface border-t border-default">
      <div className="container">
        <div className="flex flex-col items-center space-y-4">
          {/* Email */}
          <div className="text-center">
            <h3 className="text-sm font-medium text-primary mb-1">Email</h3>
            <a 
              href={`mailto:${personalInfo.profile.email}`}
              className="text-sm text-secondary hover:text-accent transition-colors"
            >
              {personalInfo.profile.email}
            </a>
          </div>

          {/* Let's Talk */}
          <div className="text-center">
            <p className="text-xs text-muted mb-2">Let&apos;s Talk</p>
            <a 
              href="#contact"
              className="btn-secondary btn-sm"
            >
              Schedule a Call
            </a>
          </div>

          {/* Speaking Engagements */}
          <div className="text-center">
            <p className="text-xs text-secondary">
              Available for speaking at events about
            </p>
            <p className="text-xs text-secondary">
              software development and emerging technologies.
            </p>
            <a 
              href="#contact"
              className="text-xs text-accent hover:underline inline-flex items-center gap-1 mt-1"
            >
              Get in touch
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-card transition-colors"
                  aria-label={social.name}
                >
                  <Icon className="w-4 h-4 text-secondary hover:text-accent transition-colors" />
                </a>
              );
            })}
          </div>

          {/* Memberships */}
          <div className="text-center pt-4 border-t border-default w-full max-w-md">
            <p className="text-xs text-muted mb-2">🏆 A member of</p>
            <div className="space-y-1">
              <p className="text-xs text-secondary">Analytics and Artificial Intelligence</p>
              <p className="text-xs text-secondary">Association of the Philippines (A4P)</p>
              <br />
              <p className="text-xs text-secondary">Philippine Software Industry Association</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-4 border-t border-default w-full">
            <p className="text-xs text-muted">
              © {currentYear} PP Namias. All rights reserved.
            </p>
            <div className="flex justify-center mt-2">
              <a href="#" className="text-xs text-secondary hover:text-accent">Feedback</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
