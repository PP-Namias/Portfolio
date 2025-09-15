// Contact data - inline definition since no JSON file exists

// Contact Method Interface
export interface ContactMethod {
  id: string;
  type: string;
  label: string;
  value: string;
  href: string;
  icon: string;
  primary: boolean;
  description: string;
  responseTime: string;
  availability: string;
}

// Social Platform Interface
export interface SocialPlatform {
  id: string;
  name: string;
  username: string;
  url: string;
  icon: string;
  followers?: string;
  connections?: string;
  visitors?: string;
  description: string;
  primary: boolean;
  color: string;
}

// Contact Info Interface
export interface ContactInfo {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _version: number;
  contactMethods: ContactMethod[];
  socialPlatforms: SocialPlatform[];
  availability: {
    status: string;
    message: string;
    lastUpdated: string;
    timezone: string;
    workingHours: {
      [key: string]: {
        start: string | null;
        end: string | null;
        available: boolean;
      };
    };
    responseTime: {
      email: string;
      phone: string;
      meeting: string;
    };
  };
  services: Array<{
    id: string;
    name: string;
    description: string;
    duration: string;
    pricing: string;
    availability: string;
  }>;
  preferredContactMethods: Array<{
    method: string;
    reason: string;
    priority: number;
  }>;
  contactForm: {
    enabled: boolean;
    endpoint: string;
    method: string;
    fields: Array<{
      name: string;
      type: string;
      label: string;
      required: boolean;
      placeholder?: string;
      rows?: number;
      options?: Array<{
        value: string;
        label: string;
      }>;
    }>;
    submitText: string;
    successMessage: string;
    errorMessage: string;
  };
  autoResponder: {
    enabled: boolean;
    subject: string;
    message: string;
  };
}

// Export typed data
export const contactInfo: ContactInfo = {
  _id: 'contact-1',
  _type: 'contactInfo',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
  _version: 1,
  contactMethods: [
    {
      id: 'email-1',
      type: 'email',
      label: 'Email',
      value: 'contact@ppnamias.com',
      href: 'mailto:contact@ppnamias.com',
      icon: 'mail',
      primary: true,
      description: 'Primary email for professional inquiries',
      responseTime: '24 hours',
      availability: 'Always available'
    }
  ],
  socialPlatforms: [
    {
      id: 'github-1',
      name: 'GitHub',
      username: 'ppnamias',
      url: 'https://github.com/ppnamias',
      icon: 'github',
      description: 'Code repositories and open source projects',
      primary: true,
      color: '#333333'
    },
    {
      id: 'linkedin-1',
      name: 'LinkedIn',
      username: 'ppnamias',
      url: 'https://linkedin.com/in/ppnamias',
      icon: 'linkedin',
      description: 'Professional network and career updates',
      primary: true,
      color: '#0077b5'
    }
  ],
  availability: {
    status: 'available',
    message: 'Available for new opportunities',
    lastUpdated: new Date().toISOString(),
    timezone: 'UTC+8',
    workingHours: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: null, end: null, available: false },
      sunday: { start: null, end: null, available: false }
    },
    responseTime: {
      email: '24 hours',
      phone: '4 hours',
      meeting: '48 hours'
    }
  }
} as unknown as ContactInfo;
