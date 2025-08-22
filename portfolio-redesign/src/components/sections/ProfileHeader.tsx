'use client';

import { personalInfo } from '@/data/personal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function ProfileHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="profile-card"
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <Image
          src={personalInfo.profile.avatar}
          alt={personalInfo.profile.name}
          width={120}
          height={120}
          className="profile-avatar"
        />
        
        <div className="profile-info">
          <h1>{personalInfo.profile.name}</h1>
          
          <div className="title">
            {personalInfo.profile.title}
          </div>
          
          <div className="location">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {personalInfo.profile.location}
          </div>
          
          {/* Achievement Badge */}
          <div className="mt-4">
            <div className="badge badge-warning">
              🏆 DICT OpenGov HacKathon 2025 Champion
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button className="btn btn-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule a Call
        </button>
        
        <a 
          href={`mailto:${personalInfo.profile.email}`}
          className="btn btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Send Email
        </a>
      </div>

      {/* Availability Status */}
      {personalInfo.profile.availability && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              personalInfo.profile.availability.status === 'available' 
                ? 'bg-green-400' 
                : 'bg-yellow-400'
            }`}></div>
            <span className="body-small">
              {personalInfo.profile.availability.message}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
