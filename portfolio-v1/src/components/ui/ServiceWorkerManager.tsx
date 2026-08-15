'use client';

import { useEffect } from 'react';
import { registerSW } from '@/lib/sw-register';

export function ServiceWorkerManager() {
  useEffect(() => {
    registerSW();
  }, []);

  return null;
}
