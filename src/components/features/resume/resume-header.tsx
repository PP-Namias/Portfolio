import { Mail, Phone, MapPin, Download, Github, Linkedin } from 'lucide-react';
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
}

interface ResumeHeaderProps {
  name: string;
  title: string;
  contact: ContactInfo;
  onDownloadPDF?: () => void;
}

export const ResumeHeader = ({ 
  name, 
  title, 
  contact, 
  onDownloadPDF 
}: ResumeHeaderProps) => {
  return (
    <motion.header 
      className="resume-section bg-gradient-to-r from-resume-bg to-resume-bg-alt"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Name & Title */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-resume-primary mb-2">
            {name}
          </h1>
          <p className="text-xl md:text-2xl text-resume-secondary font-medium">
            {title}
          </p>
        </div>

        {/* Download Resume Button */}
        <div className="flex-shrink-0 no-print">
          <Button
            color="primary"
            variant="solid"
            startContent={<Download size={18} />}
            onPress={onDownloadPDF}
            className="font-semibold"
          >
            Download Resume
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-resume-secondary">
        <a 
          href={`mailto:${contact.email}`}
          className="flex items-center gap-2 hover:text-resume-accent transition-colors"
        >
          <Mail size={16} />
          <span>{contact.email}</span>
        </a>
        
        <a 
          href={`tel:${contact.phone}`}
          className="flex items-center gap-2 hover:text-resume-accent transition-colors"
        >
          <Phone size={16} />
          <span>{contact.phone}</span>
        </a>
        
        <span className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{contact.location}</span>
        </span>
        
        <div className="flex items-center gap-4 ml-auto">
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-resume-accent transition-colors"
            aria-label="GitHub Profile"
          >
            <Github size={20} />
          </a>
          
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-resume-accent transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </motion.header>
  );
};
