'use client';

import { personalInfo } from '@/data/personal';
import { contactInfo } from '@/data/contact';
import { motion } from 'framer-motion';
import { MapPin, Mail, Github, Linkedin, Download } from 'lucide-react';
import Image from 'next/image';

export function ProfileHeader() {
  const primaryEmail = contactInfo.contactMethods.find(
    method => method.type === 'email' && method.primary
  )?.value || personalInfo.profile.email;

  const githubUrl = "https://github.com/ppnamias";
  const linkedinUrl = "https://linkedin.com/in/ppnamias";

  return (
    <motion.div 
      className="profile-header"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="profile-content">
        <div className="profile-main">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src="/profile.jpeg"
              alt={personalInfo.profile.name}
              width={80}
              height={80}
              className="profile-avatar"
              priority
            />
          </motion.div>
          
          <div className="profile-info">
            <h1 className="profile-name">{personalInfo.profile.name}</h1>
            <h2 className="profile-title">{personalInfo.profile.title}</h2>
            
            <div className="profile-location">
              <MapPin size={14} />
              <span>{personalInfo.profile.location}</span>
            </div>
            
            <div className="profile-status">
              <div className="status-dot"></div>
              <span>Available for opportunities</span>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <motion.a
            href={`mailto:${primaryEmail}`}
            className="btn btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail size={14} />
            Contact Me
          </motion.a>
          
          <motion.a
            href="/resume.pdf"
            download
            className="btn btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={14} />
            Download CV
          </motion.a>
          
          <motion.a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Github size={16} />
          </motion.a>
          
          <motion.a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Linkedin size={16} />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
