'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  FileText,
  Github,
  GraduationCap,
  Layers,
  Linkedin,
  Mail,
  Medal,
  Terminal,
  Trophy,
} from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/types';

// Action tags the AI can include in responses
const ACTION_PATTERNS: Array<{
  tag: string;
  label: string;
  icon: typeof Calendar;
  action: string;
}> = [
  { tag: '[ACTION:skills]', label: 'Explore Skills', icon: Terminal, action: 'skills' },
  { tag: '[ACTION:projects]', label: 'View Projects', icon: Layers, action: 'projects' },
  { tag: '[ACTION:experience]', label: 'View Experience', icon: Briefcase, action: 'experience' },
  { tag: '[ACTION:certifications]', label: 'View Certifications', icon: Medal, action: 'certifications' },
  { tag: '[ACTION:email]', label: 'Send Email', icon: Mail, action: 'email' },
  { tag: '[ACTION:achievements]', label: 'Key Achievements', icon: Trophy, action: 'achievements' },
  { tag: '[ACTION:education]', label: 'Education Details', icon: GraduationCap, action: 'education' },
  { tag: '[ACTION:linkedin]', label: 'Open LinkedIn', icon: Linkedin, action: 'linkedin' },
  { tag: '[ACTION:github]', label: 'Open GitHub', icon: Github, action: 'github' },
  { tag: '[ACTION:booking]', label: 'Schedule a Meeting', icon: Calendar, action: 'booking' },
  { tag: '[ACTION:resume]', label: 'View Resume', icon: FileText, action: 'resume' },
  { tag: '[ACTION:profile]', label: 'About Keneth', icon: Trophy, action: 'profile' },
  { tag: '[ACTION:contact]', label: 'Contact Info', icon: Mail, action: 'contact' },
];

function parseActions(content: string) {
  let cleanContent = content;
  const actions: typeof ACTION_PATTERNS = [];

  for (const pattern of ACTION_PATTERNS) {
    if (cleanContent.includes(pattern.tag)) {
      cleanContent = cleanContent.replace(pattern.tag, '').trim();
      actions.push(pattern);
    }
  }

  return { cleanContent, actions };
}

const WELCOME_TOPIC_CARDS = [
  { icon: Trophy, label: 'About Keneth', question: 'Who is Keneth? Tell me about him.', color: 'text-blue-500', bg: 'bg-blue-500/10', action: 'profile' },
  { icon: Terminal, label: 'Skills & Tech', question: 'What are Keneth\'s top skills and technologies?', color: 'text-emerald-500', bg: 'bg-emerald-500/10', action: 'skills' },
  { icon: Briefcase, label: 'Experience', question: 'Tell me about Keneth\'s work experience and roles', color: 'text-amber-500', bg: 'bg-amber-500/10', action: 'experience' },
  { icon: Layers, label: 'Projects', question: 'What projects has Keneth built?', color: 'text-violet-500', bg: 'bg-violet-500/10', action: 'projects' },
  { icon: Calendar, label: 'Schedule Call', question: 'How can I schedule a meeting with Keneth?', color: 'text-teal-500', bg: 'bg-teal-500/10', action: 'booking' },
  { icon: Medal, label: 'Certifications', question: 'What certifications does Keneth have?', color: 'text-rose-500', bg: 'bg-rose-500/10', action: 'certifications' },
];

interface ChatMessageProps {
  message: ChatMessageType;
  onAction?: (action: string) => void;
}

export const ChatMessage = React.memo(function ChatMessage({ message, onAction }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const hasWelcomeTopics = !isUser && message.content.includes('[WELCOME_TOPICS]');
  const { cleanContent, actions } = isUser
    ? { cleanContent: message.content, actions: [] }
    : parseActions(message.content.replace('[WELCOME_TOPICS]', '').trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2.5`}
    >
      <div
        className={`${
          isUser
            ? 'max-w-[82%] bg-accent-pink text-white rounded-2xl rounded-br-md'
            : 'max-w-[95%] bg-white dark:bg-card-bg-dark border border-border-light/60 dark:border-border-dark/60 text-text-primary-light dark:text-text-primary-dark rounded-2xl rounded-bl-md'
        }`}
      >
        <div className="px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap">
          {cleanContent}
        </div>
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-3 pb-2.5">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.action}
                  type="button"
                  onClick={() => onAction?.(a.action)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20 transition-colors"
                >
                  <Icon className="h-3 w-3" />
                  {a.label}
                </button>
              );
            })}
          </div>
        )}
        {hasWelcomeTopics && (
          <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
            {WELCOME_TOPIC_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.action}
                  type="button"
                  onClick={() => onAction?.(card.action)}
                  className={`flex items-center gap-2 p-2 rounded-lg border border-border-light/60 dark:border-border-dark/60 hover:border-accent-pink/30 hover:bg-accent-pink/5 transition-[border-color,background-color] text-left group`}
                >
                  <div className={`h-7 w-7 rounded-md ${card.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-3.5 w-3.5 ${card.color}`} />
                  </div>
                  <span className="text-[11px] font-medium text-text-secondary-light dark:text-text-secondary-dark group-hover:text-text-primary-light dark:group-hover:text-text-primary-dark transition-colors leading-tight">
                    {card.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
});
