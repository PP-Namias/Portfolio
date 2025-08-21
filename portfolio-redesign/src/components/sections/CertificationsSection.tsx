'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, Shield } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
  logo?: string;
  skills: string[];
  status: 'active' | 'expired' | 'in-progress';
}

const certifications: Certification[] = [
  {
    id: 'aws-solutions-architect',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2024',
    credentialId: 'AWS-SAA-2024-001',
    verificationUrl: 'https://aws.amazon.com/verification',
    skills: ['Cloud Architecture', 'AWS Services', 'Security', 'Scalability'],
    status: 'active'
  },
  {
    id: 'google-cloud-developer',
    title: 'Google Cloud Professional Developer',
    issuer: 'Google Cloud',
    date: '2023',
    credentialId: 'GCP-PD-2023-002',
    verificationUrl: 'https://cloud.google.com/certification',
    skills: ['GCP Services', 'Kubernetes', 'CI/CD', 'Microservices'],
    status: 'active'
  },
  {
    id: 'microsoft-azure-fundamentals',
    title: 'Microsoft Azure Fundamentals',
    issuer: 'Microsoft',
    date: '2023',
    credentialId: 'AZ-900-2023-003',
    skills: ['Azure Services', 'Cloud Concepts', 'Security', 'Compliance'],
    status: 'active'
  },
  {
    id: 'tensorflow-developer',
    title: 'TensorFlow Developer Certificate',
    issuer: 'TensorFlow',
    date: '2024',
    credentialId: 'TF-DEV-2024-004',
    verificationUrl: 'https://www.tensorflow.org/certificate',
    skills: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'AI'],
    status: 'active'
  }
];

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    expired: 'bg-red-500/20 text-red-400 border-red-500/30',
    'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };
  return colors[status as keyof typeof colors] || colors.active;
};

const getStatusText = (status: string) => {
  const texts = {
    active: 'Active',
    expired: 'Expired',
    'in-progress': 'In Progress'
  };
  return texts[status as keyof typeof texts] || 'Active';
};

interface CertificationCardProps {
  certification: Certification;
  index: number;
}

const CertificationCard = ({ certification, index }: CertificationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-secondary/20 border border-border rounded-lg p-4 hover:border-accent/30 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">
            {certification.title}
          </h3>
          <p className="text-sm text-secondary mt-1">{certification.issuer}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(certification.status)}`}>
            {getStatusText(certification.status)}
          </span>
        </div>
      </div>

      {/* Date and Credential */}
      <div className="flex items-center space-x-4 mb-3 text-sm text-secondary">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{certification.date}</span>
        </div>
        {certification.credentialId && (
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span className="font-mono text-xs">{certification.credentialId}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {certification.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-secondary/30 text-secondary rounded border border-border"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Verification Link */}
      {certification.verificationUrl && (
        <div className="pt-3 border-t border-border">
          <a
            href={certification.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Verify Certificate</span>
          </a>
        </div>
      )}
    </motion.div>
  );
};

export const CertificationsSection = () => {
  const activeCertifications = certifications.filter(c => c.status === 'active');
  const inProgressCertifications = certifications.filter(c => c.status === 'in-progress');

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="certifications"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Award className="w-5 h-5 mr-3 text-accent" />
          <h2 className="text-xl font-semibold text-primary">Recent Certifications</h2>
        </div>
        <div className="text-sm text-accent">
          {activeCertifications.length} Active
        </div>
      </div>

      <div className="space-y-6">
        {/* Active Certifications */}
        {activeCertifications.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-primary mb-4">Current Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCertifications.map((cert, index) => (
                <CertificationCard key={cert.id} certification={cert} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* In Progress Certifications */}
        {inProgressCertifications.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-primary mb-4">In Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgressCertifications.map((cert, index) => (
                <CertificationCard 
                  key={cert.id} 
                  certification={cert} 
                  index={index + activeCertifications.length} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Certification Stats */}
        <div className="pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-accent">{certifications.length}</div>
              <div className="text-sm text-secondary">Total Certifications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{activeCertifications.length}</div>
              <div className="text-sm text-secondary">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {certifications.reduce((acc, cert) => acc + cert.skills.length, 0)}
              </div>
              <div className="text-sm text-secondary">Skills Validated</div>
            </div>
          </div>
        </div>

        {/* Next Certification Goal */}
        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
          <div className="flex items-center mb-2">
            <Award className="w-4 h-4 mr-2 text-accent" />
            <span className="text-sm font-medium text-accent">Next Goal</span>
          </div>
          <p className="text-secondary text-sm">
            Currently preparing for <strong className="text-primary">Kubernetes Certified Application Developer (CKAD)</strong> certification to enhance container orchestration expertise.
          </p>
        </div>
      </div>
    </motion.section>
  );
};
