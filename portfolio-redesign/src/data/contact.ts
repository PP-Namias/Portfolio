// Import clean JSON data
import contactData from './json/contact-clean.json';

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
export const contactInfo: ContactInfo = contactData as ContactInfo;
