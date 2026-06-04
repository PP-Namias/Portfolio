'use client';

import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useCmsContent } from '@/hooks/useCmsContent';

export function EducationSection() {
  const { profile } = useCmsContent();
  const education = profile.education ?? [];

  if (education.length === 0) {
    return null;
  }

  return (
    <div>
      <h2
        id="education-heading"
        className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-pink border-b border-border-light dark:border-border-dark pb-2 mb-3"
      >
        Education
      </h2>
      <div className="space-y-3">
        {education.map((edu) => {
          const startYear = new Date(edu.startedAt).getFullYear();
          const endLabel = edu.endedAt ? new Date(edu.endedAt).getFullYear() : 'Present';
          return (
            <div
              key={`${edu.institution}-${edu.degree}-${edu.startedAt}`}
              className="flex items-start gap-2"
            >
              <GraduationCap className="h-4 w-4 text-accent-pink mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-text-primary-light dark:text-text-primary-dark leading-snug">
                  {edu.degree}
                </p>
                <p className="text-[12px] text-text-muted-light dark:text-text-muted-dark">
                  {edu.institution}
                </p>
                <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark mt-0.5">
                  {startYear} &ndash; {endLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
