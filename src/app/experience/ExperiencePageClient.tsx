'use client';

import { experiences } from '@/data/experience';
import { Timeline } from '@/components/ui/timeline';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  Briefcase,
  CheckCircle,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';

const experienceImages: Record<string, string[]> = {
  'MASH - Mushroom Automation': ['/images/experience/mash.svg'],
  'PhoneCraft Cellphone Repair': ['/images/experience/phonecraft.svg'],
  'Ucc-Ingo': [
    '/images/projects/UCC_Student_Portal.png',
    '/images/projects/UCC%20Login%20Portal.png',
    '/images/projects/UCC%20Access%20Module.png',
  ],
  'Aeternitas Chapels & Columbarium': [
    '/images/experience/aeternitas.svg',
    '/images/gallery/Random%20OJT%20Pic.jpg',
  ],
  'Wilshire Financial Network': ['/images/experience/wilshire.svg'],
  'JIMIRENE Clinic Management System': ['/images/experience/jimirene.svg'],
  "J'5 Pharmacy": ['/images/experience/j5pharmacy.svg'],
  'Legal Workflow Manager (CaseMaster)': ['/images/experience/casemaster.svg'],
  'University of Caloocan City': ['/images/experience/ucc-volunteer.svg'],
};

const imageShadow =
  'shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]';

export function ExperiencePageClient() {
  const timelineData = experiences.map((exp) => {
    const startYear = new Date(exp.startedAt).getFullYear();
    const endLabel = exp.endedAt
      ? new Date(exp.endedAt).getFullYear().toString()
      : 'Present';
    const dateLabel =
      startYear === Number(endLabel)
        ? `${startYear}`
        : `${startYear} – ${endLabel}`;
    const images = experienceImages[exp.company] || [];

    return {
      title: dateLabel,
      content: (
        <div>
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg md:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {exp.position}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="h-4 w-4 text-accent-pink flex-shrink-0" />
              <span className="text-sm md:text-base text-text-secondary-light dark:text-text-secondary-dark font-medium">
                {exp.company}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {dateLabel}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {exp.country}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {exp.modality}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink font-medium">
                {exp.type}
              </span>
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm md:text-base text-text-secondary-light dark:text-text-secondary-dark mb-6 leading-relaxed">
            {exp.summary}
          </p>

          {/* Highlights */}
          {exp.highlights.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-accent-pink" />
                Key Highlights
              </h4>
              <ul className="space-y-1.5">
                {exp.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="text-xs md:text-sm text-text-secondary-light dark:text-text-secondary-dark flex gap-2"
                  >
                    <span className="text-accent-pink mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Achievements */}
          {exp.achievements.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center gap-1.5">
                <Star className="h-4 w-4 text-accent-pink" />
                Achievements
              </h4>
              <div className="flex flex-wrap gap-2">
                {exp.achievements.map((a, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-full bg-accent-pink/10 text-accent-pink font-medium border border-accent-pink/20"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {exp.technologies.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-2">
                Technologies & Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] md:text-xs px-2 py-0.5 rounded-full border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {images.length > 0 && (
            <div
              className={
                images.length === 1
                  ? 'grid grid-cols-1 gap-4'
                  : 'grid grid-cols-2 gap-4'
              }
            >
              {images.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`${exp.company} — ${exp.position}`}
                  width={500}
                  height={300}
                  className={`rounded-lg object-cover w-full ${imageShadow} ${
                    images.length === 1
                      ? 'h-32 md:h-52 lg:h-64'
                      : 'h-20 md:h-44 lg:h-60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <main className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12 pb-16">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Portfolio
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
          Work Experience
        </h1>
        <p className="text-sm md:text-base text-text-secondary-light dark:text-text-secondary-dark max-w-2xl">
          A detailed timeline of my professional journey — from hardware repair
          to full-stack development, AI consulting, and enterprise software
          engineering.
        </p>
      </motion.div>

      {/* Timeline */}
      <Timeline data={timelineData} />
    </main>
  );
}
