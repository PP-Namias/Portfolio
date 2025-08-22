'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, MessageSquare, Star, ExternalLink, CheckCircle, Calendar } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  status: 'active' | 'expired' | 'in-progress';
  credentialId?: string;
  logo?: string;
  verificationUrl?: string;
}

interface Recommendation {
  id: string;
  text: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating: number;
}

const certifications: Certification[] = [
  {
    id: 'huawei-developer-expert',
    title: 'Huawei Developer Expert',
    issuer: 'Huawei',
    date: '2024',
    status: 'active',
    credentialId: 'HDE-2024-001',
    verificationUrl: '#'
  },
  {
    id: 'generative-ai-leader',
    title: 'Generative AI Leader',
    issuer: 'Google',
    date: '2024',
    status: 'active',
    credentialId: 'GAIL-2024-789',
    verificationUrl: '#'
  },
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    issuer: 'TechTree',
    date: '2023',
    status: 'active',
    credentialId: 'SE-2023-456',
    verificationUrl: '#'
  },
  {
    id: 'generative-ai-professional',
    title: 'Generative AI Professional',
    issuer: 'Oracle',
    date: '2024',
    status: 'active',
    credentialId: 'GAIP-2024-123',
    verificationUrl: '#'
  }
];

const recommendations: Recommendation[] = [
  {
    id: '1',
    text: "Bryl was the most talented software engineer I've mentored in a long time. He's a fast learner, and he always makes sure to deliver quality output given a period of time. He is also very keen on learning new technologies, and I find him to be very objective and analytical in his approach to problem-solving.",
    author: 'Cris Lawrence Adrian Militante',
    role: 'CTO Director',
    company: 'GCM',
    rating: 5
  }
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'active':
      return {
        color: 'chip-success',
        icon: CheckCircle,
        text: 'Active'
      };
    case 'expired':
      return {
        color: 'chip-warning',
        icon: Calendar,
        text: 'Expired'
      };
    case 'in-progress':
      return {
        color: 'chip-primary',
        icon: Calendar,
        text: 'In Progress'
      };
    default:
      return {
        color: 'chip',
        icon: CheckCircle,
        text: 'Active'
      };
  }
};

const CertificationCard = ({ cert, index }: { cert: Certification; index: number }) => {
  const statusConfig = getStatusConfig(cert.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="glass-card card-compact relative overflow-hidden cursor-pointer">
        {/* Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="mobile-heading text-primary group-hover:text-gradient transition-colors duration-300 line-clamp-1 font-semibold">
                  {cert.title}
                </h3>
                <p className="text-sm text-secondary font-medium">
                  {cert.issuer}
                </p>
              </div>
            </div>
            
            {cert.verificationUrl && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-surface hover:bg-card border border-default transition-colors duration-200 opacity-0 group-hover:opacity-100"
                onClick={() => window.open(cert.verificationUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 text-accent" />
              </motion.button>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`chip ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3" />
                <span>{statusConfig.text}</span>
              </div>
              <span className="text-xs text-muted">{cert.date}</span>
            </div>
            
            {cert.credentialId && (
              <div className="p-2 bg-surface rounded-lg border border-light">
                <p className="text-xs text-muted">Credential ID</p>
                <p className="text-sm font-mono text-primary">{cert.credentialId}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RecommendationCard = ({ recommendation, index }: { recommendation: Recommendation; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="glass-card card-compact relative overflow-hidden">
        {/* Quote Background Pattern */}
        <div className="absolute top-4 right-4 text-6xl text-accent/10 font-serif leading-none select-none">&ldquo;</div>
        
        <div className="relative z-10 space-y-4">
          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < recommendation.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-muted'
                }`}
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-secondary leading-relaxed italic">
            <span className="text-lg text-accent/60 font-serif">&ldquo;</span>
            {recommendation.text}
            <span className="text-lg text-accent/60 font-serif">&rdquo;</span>
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-3 pt-3 border-t border-light">
            <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {recommendation.author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{recommendation.author}</p>
              <p className="text-xs text-muted">
                {recommendation.role}
                {recommendation.company && ` at ${recommendation.company}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CertificationsSection = () => {
  return (
    <section className="card relative overflow-hidden" id="certifications">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-primary)]/10 rounded-full opacity-50 -translate-y-12 translate-x-12" />
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="heading-md text-[var(--color-text-primary)]">Certifications & Recognition</h2>
            <p className="body-sm text-[var(--color-text-muted)]">Professional achievements and endorsements</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Enhanced Certifications Grid */}
          <div>
            <h3 className="body-lg font-semibold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--color-accent)]" />
              Professional Certifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, index) => {
                const statusConfig = getStatusConfig(cert.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="glass-card card-compact group cursor-pointer relative overflow-hidden"
                  >
                    {/* Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      {/* Header with Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="body-sm font-semibold text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                            {cert.title}
                          </h4>
                          <p className="body-xs text-[var(--color-text-secondary)] font-medium">
                            {cert.issuer}
                          </p>
                        </div>
                        <span className={`chip ${statusConfig.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.text}
                        </span>
                      </div>

                      {/* Credential Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between body-xs text-[var(--color-text-muted)]">
                          <span>Issued: {cert.date}</span>
                        </div>
                        
                        {cert.credentialId && (
                          <div className="body-xs text-[var(--color-text-muted)]">
                            ID: <span className="font-mono text-[var(--color-text-secondary)]">{cert.credentialId}</span>
                          </div>
                        )}

                        {cert.verificationUrl && (
                          <button className="flex items-center gap-1 body-xs text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors">
                            <ExternalLink className="w-3 h-3" />
                            Verify Credential
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Recommendations */}
          <div>
            <h3 className="body-lg font-semibold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--color-accent)]" />
              Professional Recommendations
            </h3>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card card-compact relative overflow-hidden"
                >
                  {/* Quote Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 via-transparent to-[var(--color-primary)]/5" />
                  
                  <div className="relative z-10">
                    {/* Quote Icon */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-lg flex items-center justify-center opacity-20">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="pt-6">
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(rec.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                        ))}
                      </div>

                      {/* Quote Text */}
                      <blockquote className="body-sm text-[var(--color-text-secondary)] leading-relaxed mb-6 italic">
                        "{rec.text}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-full flex items-center justify-center">
                          <span className="body-sm font-bold text-white">
                            {rec.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="body-sm font-semibold text-[var(--color-text-primary)]">
                            {rec.author}
                          </div>
                          <div className="body-xs text-[var(--color-text-muted)]">
                            {rec.role}{rec.company && ` at ${rec.company}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Professional Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-card card-compact relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 via-transparent to-[var(--color-primary)]/5" />
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="body-lg font-bold text-[var(--color-accent)] mb-1">
                    {certifications.filter(c => c.status === 'active').length}
                  </div>
                  <div className="body-xs text-[var(--color-text-muted)]">Active Certifications</div>
                </div>
                <div>
                  <div className="body-lg font-bold text-[var(--color-primary)] mb-1">
                    {recommendations.length}
                  </div>
                  <div className="body-xs text-[var(--color-text-muted)]">Professional Recommendations</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
