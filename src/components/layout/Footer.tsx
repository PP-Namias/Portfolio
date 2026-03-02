'use client';

import React from 'react';
import { profile } from '@/data/profile';

export function Footer() {
  return (
    <footer className="mt-12 pb-6 pt-4 border-t border-border-light dark:border-border-dark">
      <p className="text-center text-[11px] text-text-muted-light dark:text-text-muted-dark">
        &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
      </p>
    </footer>
  );
}
