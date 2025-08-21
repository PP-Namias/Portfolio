// Import clean JSON data
import certificationsData from './json/certifications-clean.json';

// Certification Interface
export interface Certification {
  _id: string;
  _type: string;
  title: string;
  issuer: string;
  issuerLogo: {
    url: string;
    alt: string;
  };
  category: string;
  level: string;
  status: string;
  issueDate: string;
  expirationDate: string;
  credentialId: string;
  verificationUrl: string;
  description: string;
  skills: string[];
  validFor: string;
  difficulty: string;
  hoursRequired: number;
  examScore: string;
  featured: boolean;
  priority: number;
  color: string;
}

// Certifications Collection Interface
export interface CertificationsCollection {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _version: number;
  certifications: Certification[];
  categories: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    count: number;
  }>;
  levels: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    order: number;
    count: number;
  }>;
  statistics: {
    totalCertifications: number;
    activeCertifications: number;
    expiredCertifications: number;
    featuredCertifications: number;
    averageScore: string;
    totalHoursInvested: number;
    upcomingRenewals: number;
  };
  upcomingRenewals: Array<{
    certificationId: string;
    title: string;
    expirationDate: string;
    daysUntilExpiry: number;
    renewalRequired: boolean;
  }>;
}

// Export typed data
export const certificationsCollection: CertificationsCollection = certificationsData as CertificationsCollection;
export const certificationsList: Certification[] = certificationsCollection.certifications;
