'use client';

import React from 'react';
import Image from 'next/image';
import {
  MapPin,
  Building2,
  Calendar,
  Briefcase,
  CheckCircle,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';
import { experiences } from '@/data/experience';

interface ExperienceModalProps {
  open: boolean;
  onClose: () => void;
}

const imageShadow =
  'shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]';

export function ExperienceModal({ open, onClose }: ExperienceModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Work Experience" fullScreen>
      <div className="px-5 py-4 space-y-6">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          A detailed timeline of my professional journey — from hardware repair
          to full-stack development, AI consulting, and enterprise software
          engineering.
        </p>

        {experiences.map((exp, idx) => {
          const startYear = new Date(exp.startedAt).getFullYear();
          const endLabel = exp.endedAt
            ? new Date(exp.endedAt).getFullYear().toString()
            : 'Present';
          const dateLabel =
            startYear === Number(endLabel)
              ? `${startYear}`
              : `${startYear} – ${endLabel}`;
          const images = exp.images || [];

          return (
            <motion.div
              key={`${exp.company}-${exp.position}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="border-b border-border-light dark:border-border-dark pb-6 last:border-0 last:pb-0"
            >
              {/* Header */}
              <div className="mb-3">
                <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
                  {exp.position}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Building2 className="h-3.5 w-3.5 text-accent-pink flex-shrink-0" />
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                    {exp.company}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-[11px] text-text-muted-light dark:text-text-muted-dark">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {dateLabel}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {exp.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {exp.modality}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink font-medium">
                    {exp.type}
                  </span>
                </div>
              </div>

              {/* Summary */}
              {exp.summary && (
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-3 leading-relaxed">
                  {exp.summary}
                </p>
              )}

              {/* Highlights */}
              {exp.highlights.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-accent-pink" />
                    Key Highlights
                  </h4>
                  <ul className="space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark flex gap-1.5"
                      >
                        <span className="text-accent-pink mt-0.5 flex-shrink-0">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              {exp.achievements.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-accent-pink" />
                    Achievements
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.achievements.map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-accent-pink/10 text-accent-pink font-medium border border-accent-pink/20"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {exp.technologies.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-[10px] font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-1.5">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark"
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
                      ? 'grid grid-cols-1 gap-3'
                      : 'grid grid-cols-2 gap-3'
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
                          ? 'h-32 md:h-44'
                          : 'h-20 md:h-36'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Modal>
  );
}
