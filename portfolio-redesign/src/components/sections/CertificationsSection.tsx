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
    <div className="space-y-8">
      {/* Recent Certifications */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="card"
        id="certifications"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="heading-sm text-primary">Recent Certifications</h2>
              <p className="text-sm text-muted">Professional credentials and achievements</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary"
          >
            <ExternalLink className="w-4 h-4" />
            View All
          </motion.button>
        </div>

        <div className="grid-mobile-cards">
          {certifications.map((cert, index) => (
            <CertificationCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>
      </motion.section>

      {/* Recommendations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="card"
        id="recommendations"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="heading-sm text-primary">Professional Recommendations</h2>
            <p className="text-sm text-muted">What colleagues say about working with me</p>
          </div>
        </div>

        <div className="grid-mobile-cards">
          {recommendations.map((rec, index) => (
            <RecommendationCard key={rec.id} recommendation={rec} index={index} />
          ))}
        </div>
      </motion.section>
    </div>
  );
};
