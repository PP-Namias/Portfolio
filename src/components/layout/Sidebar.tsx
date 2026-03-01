'use client';

import React from 'react';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { RecommendationsCarousel } from '@/components/sections/RecommendationsCarousel';
import { MembershipsSection } from '@/components/sections/MembershipsSection';
import { SocialLinksSection } from '@/components/sections/SocialLinksSection';
import { SpeakingSection } from '@/components/sections/SpeakingSection';
import { ContactSection } from '@/components/sections/ContactSection';

export function Sidebar() {
  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <div className="space-y-0">
        <ExperienceTimeline />
        <RecommendationsCarousel />
        <MembershipsSection />
        <SocialLinksSection />
        <SpeakingSection />
        <ContactSection />
      </div>
    </aside>
  );
}
