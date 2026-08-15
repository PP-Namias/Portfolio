'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const ONLINE_MSG = 'Back online';

export function OfflineBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const hide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setVisible(false);
      setIsTransitioning(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (wasOffline && isOnline) {
      setVisible(true);
      setIsTransitioning(false);
      const timer = setTimeout(hide, 2500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOnline, wasOffline, hide]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-2 px-4 py-2 rounded-full text-sm
        transition-all duration-300 ease-in-out
        ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        bg-green-600/90 text-white shadow-lg backdrop-blur-sm
      `}
    >
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span>{ONLINE_MSG}</span>
    </div>
  );
}
