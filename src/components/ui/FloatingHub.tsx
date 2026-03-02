'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { HubMenu } from './HubMenu';
import { ChatPanel } from './ChatPanel';
import type { ChatMessage as ChatMessageType, HubState } from '@/types';

export function FloatingHub() {
  const [hubState, setHubState] = useState<HubState>('closed');
  const [messages, setMessages] = useState<ChatMessageType[]>([]);

  const close = useCallback(() => setHubState('closed'), []);
  const openMenu = useCallback(() => setHubState('menu'), []);
  const openChat = useCallback(() => setHubState('chat'), []);

  // Escape key handling: chat → menu → closed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (hubState === 'chat') setHubState('menu');
      else if (hubState === 'menu') setHubState('closed');
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hubState]);

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {hubState === 'closed' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openMenu}
            className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-accent-pink text-white shadow-lg flex items-center justify-center hover:bg-accent-pink-hover transition-colors"
            aria-label="Open quick actions"
          >
            <Sparkles className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence mode="wait">
        {hubState !== 'closed' && (
          <motion.div
            key={hubState}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={hubState === 'menu' ? 'Quick Actions' : "Chat with Keneth's AI"}
            className="fixed z-50 bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:w-96 sm:h-[520px] sm:rounded-2xl flex flex-col overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-2xl"
          >
            {hubState === 'menu' && (
              <HubMenu onClose={close} onOpenChat={openChat} />
            )}
            {hubState === 'chat' && (
              <ChatPanel
                onBack={openMenu}
                onClose={close}
                messages={messages}
                setMessages={setMessages}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
