'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const OFFLINE_MSG = 'You are currently offline. Browsing cached portfolio data.';
const ONLINE_MSG = 'Back online — you are viewing the latest content.';

export function OfflineBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const hide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setVisible(false);
      setIsTransitioning(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setMessage(OFFLINE_MSG);
      setVisible(true);
      setIsTransitioning(false);
    } else if (wasOffline) {
      setMessage(ONLINE_MSG);
      setVisible(true);
      setIsTransitioning(false);
      const timer = setTimeout(hide, 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOnline, wasOffline, hide]);

  if (!visible) return null;

  const isOnlineState = message === ONLINE_MSG;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-0 left-0 right-0 z-50
        px-4 py-3 text-sm text-center
        transition-all duration-300 ease-in-out
        ${isTransitioning ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'}
        ${isOnlineState
          ? 'bg-green-600 text-white'
          : 'bg-amber-500/90 dark:bg-amber-600/90 text-black dark:text-white'
        }
      `}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-center gap-2">
        {isOnlineState ? (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 14a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
