'use client';

import React from 'react';
import { BadgeCheck } from 'lucide-react';

export function VerifiedBadge() {
  return (
    <BadgeCheck
      className="inline-block h-5 w-5 text-accent-pink fill-accent-pink stroke-white ml-1.5"
      aria-label="Verified"
    />
  );
}
