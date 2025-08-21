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
  ExternalLink,
  Copy,
  CheckCircle,
  MessageCircle,
  Clock,
  Star,
  Zap
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
      className: 'btn-primary-enhanced',
      badge: 'Popular',
      stats: '~15 min response'
    },
    {
      icon: Send,
      label: 'Send Email',
      description: 'Reach out directly',
      href: `mailto:${personalInfo.profile.email}`,
      className: 'btn-secondary-enhanced',
      stats: '~2 hr response'
    },
    {
      icon: Download,
      label: 'Download Resume',
      description: 'View my latest CV',
      href: '/resume.pdf',
      className: 'btn-secondary-enhanced',
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
    <section className="py-24 bg-gradient-to-br from-background via-surface to-background relative overflow-hidden" id="contact">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Header */}
          <div className="glass-card p-12 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-full mb-6"
            >
              <MessageCircle className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary">Let&apos;s Connect</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Ready to Build Something Amazing?
              </span>
            </h2>
            
            <p className="text-secondary max-w-3xl mx-auto text-lg leading-relaxed">
              I&apos;m always interested in discussing new opportunities, innovative projects, 
              and ways to leverage technology for positive impact. Let&apos;s connect and explore 
              how we can work together to bring your ideas to life.
            </p>
          </div>

          {/* Response Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {responseMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
              >
                <metric.icon className="w-8 h-8 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
                <div className="text-sm text-secondary">{metric.label}</div>
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
            <h3 className="text-2xl font-bold text-primary mb-8">Get In Touch</h3>
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${method.primary ? 'from-accent/20 to-primary/20 border border-accent/30' : 'from-surface to-card border border-default'} group-hover:scale-110 transition-transform`}>
                      <method.icon className={`w-6 h-6 ${method.primary ? 'text-accent' : 'text-secondary'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-primary">{method.label}</h4>
                        {method.canCopy && (
                          <button
                            onClick={() => handleCopy(method.value, method.label)}
                            className="p-2 hover:bg-surface rounded-lg transition-colors group/copy"
                            title="Copy to clipboard"
                          >
                            {copiedField === method.label ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-secondary group-hover/copy:text-primary transition-colors" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      <div className="text-secondary font-medium mb-1">{method.value}</div>
                      <div className="text-xs text-muted">{method.description}</div>
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
            <h3 className="text-2xl font-bold text-primary mb-8">Quick Actions</h3>
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
                  className={`group glass-card p-6 flex items-center space-x-4 hover:scale-[1.02] transition-all duration-300 ${action.className} relative overflow-hidden`}
                >
                  {action.badge && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-accent to-primary text-white text-xs font-medium rounded-full">
                      {action.badge}
                    </div>
                  )}
                  
                  <div className="p-3 bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 rounded-xl group-hover:scale-110 transition-transform">
                    <action.icon className="w-6 h-6 text-accent" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-primary">{action.label}</h4>
                      {action.href.startsWith('http') && (
                        <ExternalLink className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <div className="text-sm text-secondary mb-1">{action.description}</div>
                    <div className="text-xs text-muted">{action.stats}</div>
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
              className="glass-card p-6 mt-8 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
                </div>
                <span className="font-semibold text-green-400">Available for new projects</span>
              </div>
              <p className="text-sm text-secondary">
                Currently accepting new client work and collaboration opportunities. 
                Let&apos;s discuss how we can work together!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
