'use client';

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
  Sparkles,
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
  { tag: '[ACTION:contact]', label: 'Contact Options', icon: Sparkles, action: 'contact' },
  { tag: '[ACTION:achievements]', label: 'Key Achievements', icon: Trophy, action: 'achievements' },
  { tag: '[ACTION:education]', label: 'Education Details', icon: GraduationCap, action: 'education' },
  { tag: '[ACTION:linkedin]', label: 'Open LinkedIn', icon: Linkedin, action: 'linkedin' },
  { tag: '[ACTION:github]', label: 'Open GitHub', icon: Github, action: 'github' },
  { tag: '[ACTION:booking]', label: 'Schedule a Meeting', icon: Calendar, action: 'booking' },
  { tag: '[ACTION:resume]', label: 'View Resume', icon: FileText, action: 'resume' },
  { tag: '[ACTION:email]', label: 'Send Email', icon: Mail, action: 'email' },
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

interface ChatMessageProps {
  message: ChatMessageType;
  onAction?: (action: string) => void;
}

export function ChatMessage({ message, onAction }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const { cleanContent, actions } = isUser
    ? { cleanContent: message.content, actions: [] }
    : parseActions(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'bg-accent-pink text-white rounded-2xl rounded-br-md'
            : 'bg-white dark:bg-card-bg-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark rounded-2xl rounded-bl-md'
        }`}
      >
        <div className="px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
          {cleanContent}
        </div>
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3.5 pb-2.5">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.action}
                  onClick={() => onAction?.(a.action)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {a.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
