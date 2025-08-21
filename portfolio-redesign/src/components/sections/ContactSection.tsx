'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Send, Download, ExternalLink } from 'lucide-react';
import { personalInfo } from '@/data/personal';

export const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.profile.email,
      href: `mailto:${personalInfo.profile.email}`,
      primary: true
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+63 123 456 7890',
      href: 'tel:+631234567890'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: personalInfo.profile.location,
      href: '#'
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      label: 'Schedule a Call',
      description: 'Book a 30-minute consultation',
      href: 'https://calendly.com/pp-namias',
      className: 'btn-primary'
    },
    {
      icon: Send,
      label: 'Send Email',
      description: 'Reach out directly',
      href: `mailto:${personalInfo.profile.email}`,
      className: 'btn-secondary'
    },
    {
      icon: Download,
      label: 'Download Resume',
      description: 'View my latest CV',
      href: '/resume.pdf',
      className: 'btn-secondary'
    }
  ];

  return (
    <section className="py-16 bg-surface border-t border-default" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="card text-center"
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-secondary max-w-2xl mx-auto text-lg">
              I&apos;m always interested in discussing new opportunities, innovative projects, 
              and ways to leverage technology for positive impact. Let&apos;s connect and explore 
              how we can work together.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-4 bg-card rounded-lg border border-default hover:border-accent/30 transition-colors"
              >
                <method.icon className={`w-6 h-6 mx-auto mb-3 ${method.primary ? 'text-accent' : 'text-secondary'}`} />
                <h3 className="font-medium text-primary mb-1">{method.label}</h3>
                <p className="text-sm text-secondary">{method.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.label}
                href={action.href}
                target={action.href.startsWith('http') ? '_blank' : undefined}
                rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group flex items-center justify-center space-x-3 p-4 rounded-lg transition-all duration-300 ${action.className}`}
              >
                <action.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
                {action.href.startsWith('http') && (
                  <ExternalLink className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
              </motion.a>
            ))}
          </div>

          {/* Availability Status */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
          >
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-medium">Available for new projects</span>
            </div>
            <p className="text-sm text-text-secondary mt-2">
              Currently accepting new client work and collaboration opportunities
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
