'use client';

import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { IS_CHAT_THREADING_ENABLED } from '@/lib/features';

interface ThreadToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ThreadToggle({ isOpen, onToggle }: Readonly<ThreadToggleProps>) {
  if (!IS_CHAT_THREADING_ENABLED) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="h-7 w-7 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors relative"
      aria-label={isOpen ? 'Close thread sidebar' : 'Open thread sidebar'}
      title={isOpen ? 'Close conversations' : 'Conversations'}
    >
      {isOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
    </button>
  );
}
