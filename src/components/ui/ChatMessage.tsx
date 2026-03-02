'use client';

import { motion } from 'framer-motion';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-accent-pink text-white rounded-2xl rounded-br-md'
            : 'bg-white dark:bg-card-bg-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark rounded-2xl rounded-bl-md'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
