'use client';

import { certificationsCollection } from '@/data/certifications';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';

export function CertificationsCard() {
  // Get the most recent certifications (first 6)
  const recentCertifications = certificationsCollection.certifications?.slice(0, 6) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">Certifications</h2>
      </div>
      
      <div className="card-content">
        {recentCertifications.length > 0 ? (
          <div className="space-y-4">
            {recentCertifications.map((cert: any, index: number) => (
              <motion.div
                key={cert._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 border border-subtle rounded-md hover:border-accent transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Award size={16} className="text-accent" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="heading-5 mb-1">{cert.title || cert.name || 'Certification'}</h3>
                  <p className="body-small text-secondary mb-1">
                    {cert.issuer || cert.organization || 'Unknown Issuer'}
                  </p>
                  
                  {cert.issueDate && (
                    <p className="body-xs text-muted">
                      Issued: {new Date(cert.issueDate).getFullYear()}
                    </p>
                  )}
                  
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-accent hover:text-accent-hover text-sm"
                    >
                      <ExternalLink size={12} />
                      View Credential
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <Award size={24} className="text-muted" />
            </div>
            <p className="body-base text-muted">No certifications available at the moment.</p>
          </div>
        )}
        
        {/* Summary */}
        {recentCertifications.length > 0 && (
          <div className="mt-6 pt-4 border-t border-subtle">
            <div className="grid grid-2 text-center">
              <div>
                <div className="heading-3 text-accent">{recentCertifications.length}+</div>
                <div className="body-small">Certifications</div>
              </div>
              <div>
                <div className="heading-3 text-accent">5+</div>
                <div className="body-small">Specializations</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
