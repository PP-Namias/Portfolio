'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Send, 
  Download, 
  Copy,
  CheckCircle,
  MessageCircle,
  Clock,
  Star,
  Zap,
  ArrowUpRight,
  Users
} from 'lucide-react';
import { personalInfo } from '@/data/personal';

export const ContactSection = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.profile.email,
      href: `mailto:${personalInfo.profile.email}`,
      primary: true,
      description: 'Available 24/7',
      canCopy: true
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+63 123 456 7890',
      href: 'tel:+631234567890',
      description: 'Mon-Fri, 9AM-6PM PST',
      canCopy: true
    },
    {
      icon: MapPin,
      label: 'Location',
      value: personalInfo.profile.location,
      href: '#',
      description: 'Open to remote work'
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      label: 'Schedule a Call',
      description: 'Book a 30-minute consultation',
      href: 'https://calendly.com/pp-namias',
      className: 'hover:bg-gradient-to-r hover:from-[var(--color-accent)]/5 hover:to-[var(--color-primary)]/5',
      badge: 'Popular',
      stats: '~15 min response'
    },
    {
      icon: Send,
      label: 'Send Email',
      description: 'Reach out directly',
      href: `mailto:${personalInfo.profile.email}`,
      className: 'hover:bg-gradient-to-r hover:from-[var(--color-primary)]/5 hover:to-[var(--color-accent)]/5',
      stats: '~2 hr response'
    },
    {
      icon: Download,
      label: 'Download Resume',
      description: 'View my latest CV',
      href: '/resume.pdf',
      className: 'hover:bg-gradient-to-r hover:from-[var(--color-accent)]/5 hover:to-[var(--color-primary)]/5',
      stats: 'Updated Nov 2024'
    }
  ];

  const responseMetrics = [
    { label: 'Average Response Time', value: '< 2 hours', icon: Clock },
    { label: 'Client Satisfaction', value: '5.0/5.0', icon: Star },
    { label: 'Project Success Rate', value: '100%', icon: Zap }
  ];

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="card relative overflow-hidden" id="contact">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-primary)]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Header */}
          <div className="glass-card card-compact text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 chip chip-success mb-6"
            >
              <MessageCircle className="w-4 h-4" />
              Let's Connect
            </motion.div>
            
            <h2 className="heading-lg mb-6">
              <span className="bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-accent)] to-[var(--color-text-primary)] bg-clip-text text-transparent">
                Ready to Build Something Amazing?
              </span>
            </h2>
            
            <p className="body-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
              I'm always interested in discussing new opportunities, innovative projects, 
              and ways to leverage technology for positive impact. Let's connect and explore 
              how we can work together to bring your ideas to life.
            </p>
          </div>

          {/* Response Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {responseMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
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
                    className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <metric.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="body-xl font-bold text-[var(--color-text-primary)] mb-2">{metric.value}</div>
                  <div className="body-sm text-[var(--color-text-muted)]">{metric.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="heading-md text-[var(--color-text-primary)]">Get In Touch</h3>
                <p className="body-sm text-[var(--color-text-muted)]">Multiple ways to connect</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="glass-card card-compact group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 flex items-start gap-4">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                        method.primary 
                          ? 'bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)]' 
                          : 'bg-gradient-to-br from-[var(--color-surface-light)] to-[var(--color-surface)]'
                      }`}
                    >
                      <method.icon className={`w-6 h-6 ${method.primary ? 'text-white' : 'text-[var(--color-text-secondary)]'}`} />
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="body-md font-semibold text-[var(--color-text-primary)]">{method.label}</h4>
                        {method.canCopy && (
                          <motion.button
                            onClick={() => handleCopy(method.value, method.label)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 glass-card hover:bg-[var(--color-surface-light)] transition-colors flex items-center justify-center"
                            title="Copy to clipboard"
                          >
                            {copiedField === method.label ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-[var(--color-text-secondary)]" />
                            )}
                          </motion.button>
                        )}
                      </div>
                      
                      <div className="body-sm font-medium text-[var(--color-text-secondary)] mb-1">{method.value}</div>
                      <div className="body-xs text-[var(--color-text-muted)]">{method.description}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="heading-md text-[var(--color-text-primary)]">Quick Actions</h3>
                <p className="body-sm text-[var(--color-text-muted)]">Fast-track our connection</p>
              </div>
            </div>
            
            <div className="space-y-4">
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
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`group glass-card card-compact flex items-center gap-4 cursor-pointer relative overflow-hidden ${action.className}`}
                >
                  {action.badge && (
                    <div className="absolute top-4 right-4 chip chip-success text-xs">
                      {action.badge}
                    </div>
                  )}
                  
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="body-md font-semibold text-[var(--color-text-primary)]">{action.label}</h4>
                      {action.href.startsWith('http') && (
                        <ArrowUpRight className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors" />
                      )}
                    </div>
                    <div className="body-sm text-[var(--color-text-secondary)] mb-1">{action.description}</div>
                    <div className="body-xs text-[var(--color-text-muted)]">{action.stats}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="glass-card card-compact mt-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
                  </div>
                  <span className="body-md font-semibold text-green-400">Available for new projects</span>
                </div>
                <p className="body-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Currently accepting new client work and collaboration opportunities. 
                  Let's discuss how we can work together!
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
