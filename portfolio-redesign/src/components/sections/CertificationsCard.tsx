'use client';

import { certificationsCollection, type Certification } from '@/data/certifications';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function CertificationsCard() {
  const recentCertifications = certificationsCollection.certifications
    .sort((a: Certification, b: Certification) => 
      new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    )
    .slice(0, 5);

  const getLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      'expert': 'text-red-400',
      'advanced': 'text-orange-400',
      'intermediate': 'text-yellow-400',
      'beginner': 'text-green-400',
      'foundational': 'text-blue-400'
    };
    return colors[level.toLowerCase()] || colors['intermediate'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
    >
      <div className="card-header">
        <h2 className="card-title">
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Certifications
        </h2>
        <p className="text-muted">Recent achievements</p>
      </div>

      <div className="card-content">
        <div className="space-y-4">
          {recentCertifications.map((cert: Certification, index: number) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="certification-item group"
            >
              <div className="flex items-start gap-3">
                {/* Institution Logo/Icon */}
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
                  {cert.issuerLogo?.url ? (
                    <Image 
                      src={cert.issuerLogo.url} 
                      alt={cert.issuerLogo.alt || cert.issuer}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  ) : (
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  )}
                </div>

                {/* Certification Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="certification-title group-hover:text-blue-400 transition-colors">
                      {cert.title}
                    </h3>
                    {cert.level && (
                      <span className={`badge badge-outline text-xs ${getLevelColor(cert.level)}`}>
                        {cert.level}
                      </span>
                    )}
                  </div>
                  
                  <div className="certification-issuer">
                    {cert.issuer}
                  </div>
                  
                  <div className="certification-date">
                    Earned {new Date(cert.issueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>

                  {/* Certification ID */}
                  {cert.credentialId && (
                    <div className="mt-2 text-xs text-muted font-mono">
                      ID: {cert.credentialId.slice(0, 12)}...
                    </div>
                  )}

                  {/* Skills */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cert.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                        <span key={skillIndex} className="badge badge-outline text-xs">
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 3 && (
                        <span className="badge badge-outline text-xs">
                          +{cert.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Verification Link */}
                  {cert.verificationUrl && (
                    <div className="mt-2">
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Verify
                      </a>
                    </div>
                  )}

                  {/* Expiration Warning */}
                  {cert.expirationDate && new Date(cert.expirationDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && (
                    <div className="mt-2 text-xs text-orange-400">
                      Expires {new Date(cert.expirationDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-semibold">
              {certificationsCollection.statistics.totalCertifications}
            </span>
            <span className="text-muted text-sm">Total</span>
          </div>
          <button className="btn btn-ghost btn-sm">
            View All
          </button>
        </div>
      </div>
    </motion.div>
  );
}
