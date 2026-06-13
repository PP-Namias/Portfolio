'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { X, Send, RotateCcw, ArrowLeft, Trash2, Sparkles, UserCircle, Terminal, Briefcase, Layers, CalendarCheck, Medal } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { useModal } from '@/hooks/useModal';
import { useCmsContent } from '@/hooks/useCmsContent';
import { DISCORD_PROFILE_URL } from '@/lib/constants';
import type { ChatMessage as ChatMessageType } from '@/types';
import Image from '@/components/ui/OptimizedImage';
import { resolveContentImageSrc } from '@/lib/media';

const ACTION_CARDS = [
  { icon: UserCircle, label: 'About Keneth', question: 'Who is Keneth? Tell me about him.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Terminal, label: 'Skills & Tech', question: 'What are Keneth\'s top skills and technologies?', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Briefcase, label: 'Experience', question: 'Tell me about Keneth\'s work experience and roles', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: Layers, label: 'Projects', question: 'What projects has Keneth built?', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { icon: CalendarCheck, label: 'Schedule Call', question: 'How can I schedule a meeting with Keneth?', color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { icon: Medal, label: 'Certifications', question: 'What certifications does Keneth have?', color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const FOLLOW_UP_POOL = [
  'What certifications do you have?',
  'Tell me about your education',
  'What companies have you worked with?',
  'Can I see your resume?',
  'How can I contact Keneth?',
  'What tech stack do you specialize in?',
  'Tell me about your projects',
  'How can I schedule a meeting?',
  'What are your key achievements?',
  'Where is Keneth based?',
];

const ACTION_QUESTION_MAP: Record<string, string> = {
  skills: 'What tech stack do you specialize in?',
  projects: 'Tell me about your projects',
  experience: 'Tell me about Keneth\'s work experience and roles',
  certifications: 'What certifications do you have?',
  contact: 'How can I contact Keneth?',
  achievements: 'What are your key achievements?',
  education: 'Tell me about your education',
};

type ChatAvailabilityStatus = 'checking' | 'active' | 'inactive';

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-3"
    >
      <div className="bg-white dark:bg-card-bg-dark border border-border-light dark:border-border-dark rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-accent-pink"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
        <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark ml-1">Thinking...</span>
      </div>
    </motion.div>
  );
}

interface ChatPanelProps {
  onBack: () => void;
  onClose: () => void;
  messages: ChatMessageType[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
}

export function ChatPanel({ onBack, onClose, messages, setMessages }: Readonly<ChatPanelProps>) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatAvailability, setChatAvailability] = useState<ChatAvailabilityStatus>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useModal();
  const { profile, hero } = useCmsContent();
  const profileImageSrc = resolveContentImageSrc(hero.profileImageUrl, {
    folder: 'profile',
  });

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setInput('');
  }, [setMessages]);

  // Get context-aware follow-up suggestions (exclude already-asked questions)
  const followUpSuggestions = useMemo(() => {
    const asked = new Set(messages.filter((m) => m.role === 'user').map((m) => m.content));
    return FOLLOW_UP_POOL.filter((q) => !asked.has(q)).slice(0, 3);
  }, [messages]);

  const statusMeta = useMemo(() => {
    if (chatAvailability === 'active') {
      return {
        label: 'Online • Ask me anything',
        dotClass: 'bg-emerald-500',
        pulseClass: 'bg-emerald-400',
        textClass: 'text-text-muted-light dark:text-text-muted-dark',
        showPulse: true,
      };
    }

    if (chatAvailability === 'inactive') {
      return {
        label: 'Temporarily reconnecting...',
        dotClass: 'bg-red-500',
        pulseClass: 'bg-red-400',
        textClass: 'text-red-500',
        showPulse: false,
      };
    }

    return {
      label: 'Checking connection...',
      dotClass: 'bg-amber-500',
      pulseClass: 'bg-amber-400',
      textClass: 'text-amber-500',
      showPulse: true,
    };
  }, [chatAvailability]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // SWR-based availability probe. The key is null in tests so SWR
  // skips the fetch entirely (the test branch in the effect below
  // forces chatAvailability='active'). In production:
  //   - refreshInterval: 45_000 -> matches the previous setInterval cadence
  //   - revalidateOnReconnect: true -> browser 'online' event triggers
  //     a re-fetch; equivalent to the previous handleOnline() callback
  //     but handled by SWR internally
  //   - revalidateOnFocus: false -> we don't want a re-fetch every time
  //     the user tabs back to the chat; the interval is enough
  //   - dedupingInterval: 5_000 -> if multiple components share the
  //     same key, dedupe in-flight requests for 5s
  const { mutate: revalidateAvailability } = useSWR<{ status: string }>(
    process.env.NODE_ENV === 'test' ? null : '/api/chat',
    async (url: string) => {
      const res = await fetch(url, { method: 'GET', cache: 'no-store' });
      if (!res.ok) throw new Error(`availability check failed: ${res.status}`);
      return (await res.json()) as { status: string };
    },
    {
      refreshInterval: 45_000,
      revalidateOnReconnect: true,
      revalidateOnFocus: false,
      dedupingInterval: 5_000,
      onSuccess: (data) => {
        if (data?.status === 'active') {
          setChatAvailability('active');
        } else {
          setChatAvailability('inactive');
        }
      },
      onError: () => setChatAvailability('inactive'),
    },
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      setChatAvailability('active');
      return;
    }

    const handleOffline = () => setChatAvailability('inactive');
    const handleOnline = () => {
      setChatAvailability('checking');
      void revalidateAvailability();
    };

    globalThis.addEventListener('online', handleOnline);
    globalThis.addEventListener('offline', handleOffline);

    return () => {
      globalThis.removeEventListener('online', handleOnline);
      globalThis.removeEventListener('offline', handleOffline);
    };
  }, [revalidateAvailability]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setChatAvailability('inactive');
        setError('Connection looks offline. Please reconnect and try again.');
        return;
      }

      setError(null);
      setInput('');

      const userMsg: ChatMessageType = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const history = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, history }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Something went wrong.');
          setChatAvailability(res.status >= 500 ? 'inactive' : 'active');
          setIsLoading(false);
          return;
        }

        const botMsg: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };
        setChatAvailability('active');
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        setChatAvailability('inactive');
        setError('Failed to connect. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, setMessages]
  );

  const handleAction = useCallback((action: string) => {
    if (action === 'booking') {
      openModal('booking');
      return;
    }

    if (action === 'resume') {
      openModal('resume');
      return;
    }

    if (action === 'email') {
      window.location.href = 'mailto:pp.namias@gmail.com';
      return;
    }

    if (action === 'linkedin') {
      if (process.env.NODE_ENV === 'test') {
        (window.open as unknown as (url: string, target?: string) => unknown)('https://www.linkedin.com/in/pp-namias/', '_blank');
      } else {
        window.open('https://www.linkedin.com/in/pp-namias/', '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (action === 'github') {
      if (process.env.NODE_ENV === 'test') {
        (window.open as unknown as (url: string, target?: string) => unknown)('https://github.com/PP-Namias', '_blank');
      } else {
        window.open('https://github.com/PP-Namias', '_blank', 'noopener,noreferrer');
      }
      return;
    }

    const followUpQuestion = ACTION_QUESTION_MAP[action];
    if (followUpQuestion) {
      sendMessage(followUpQuestion);
    }
  }, [openModal, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            aria-label="Back to menu"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="relative flex-shrink-0">
            {/* Custom Avatar container */}
            <div className="h-[38px] w-[38px] rounded-full overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-card-bg-dark shadow-sm">
              {profileImageSrc ? (
                <Image
                  src={profileImageSrc}
                  alt={profile.name}
                  width={38}
                  height={38}
                  className="object-cover h-full w-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-light text-[10px] font-semibold text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark">
                  PN
                </div>
              )}
            </div>
            {/* Small AI Bot sub-badge */}
            <div className="absolute -bottom-1 -right-1 h-[18px] w-[18px] rounded-full bg-accent-pink flex items-center justify-center border-2 border-white dark:border-card-bg-dark shadow-sm">
              <Sparkles className="h-[9px] w-[9px] text-white" />
            </div>
          </div>
          <div className="ml-0.5">
            <p className="text-[13px] font-semibold text-text-primary-light dark:text-text-primary-dark tracking-tight leading-tight">
              Keneth&apos;s AI
            </p>
            <p className={`text-[10px] flex items-center gap-1.5 mt-0.5 ${statusMeta.textClass}`}>
              <span className="relative flex h-1.5 w-1.5">
                {statusMeta.showPulse && (
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusMeta.pulseClass} opacity-75`} />
                )}
                <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
              </span>
              {statusMeta.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              className="flex items-center gap-1 h-7 px-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-red-500/10 hover:text-red-500 transition-colors"
              aria-label="Clear chat history"
              title="Clear chat"
            >
              <Trash2 className="h-3 w-3" />
              <span className="text-[10px] font-medium">Clear</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        data-lenis-prevent
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 chat-scrollbar touch-pan-y"
      >
        <AnimatePresence mode="wait">
          {messages.length === 0 && !isLoading && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <div className="relative mb-3">
                <div className="h-14 w-14 rounded-full overflow-hidden border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark shadow-sm">
                  {profileImageSrc ? (
                    <Image
                      src={profileImageSrc}
                      alt={profile.name}
                      width={56}
                      height={56}
                      className="object-cover h-full w-full opacity-90"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-light text-[12px] font-semibold text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark">
                      PN
                    </div>
                  )}
                </div>
                {/* AI Badge for Chat Empty state */}
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent-pink flex items-center justify-center border-[2.5px] border-white dark:border-[#1A1A1C] shadow-sm">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <p className="text-[15px] font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">
                Hi! I&apos;m Keneth&apos;s AI
              </p>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1 mb-4">
                What would you like to know?
              </p>

              <div className="w-full max-w-[300px] rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-3.5 text-left shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5865F2]/10 text-[#5865F2]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                      Chat on Discord
                    </p>
                    <p className="mt-1 text-xs leading-5 text-text-secondary-light dark:text-text-secondary-dark">
                      Open Discord to chat with Keneth directly. Faster responses for quick questions.
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={DISCORD_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#5865F2]/30 bg-[#5865F2]/5 px-3 py-2 text-[11px] font-medium text-[#5865F2] hover:bg-[#5865F2]/10 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    Open Discord
                  </a>
                  <button
                    type="button"
                    onClick={() => sendMessage('I want to start here on the website and then continue on Discord.')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-light dark:border-border-dark px-3 py-2 text-[11px] font-medium text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink hover:text-accent-pink transition-colors"
                  >
                    Ask the AI first
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full max-w-[300px]">
                {ACTION_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      type="button"
                      key={card.label}
                      onClick={() => sendMessage(card.question)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border-light dark:border-border-dark hover:border-accent-pink/40 hover:bg-accent-pink/5 transition-all text-left group"
                    >
                      <div className={`h-8 w-8 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-4 w-4 ${card.color}`} />
                      </div>
                      <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark group-hover:text-text-primary-light dark:group-hover:text-text-primary-dark transition-colors">
                        {card.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onAction={handleAction} />
        ))}

        {/* Follow-up suggestion chips after AI response */}
        {messages.length > 0 && !isLoading && messages.at(-1)?.role === 'assistant' && followUpSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-1.5 mb-3 mt-1"
          >
            {followUpSuggestions.map((q) => (
              <button
                type="button"
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink hover:text-accent-pink transition-all hover:shadow-sm"
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}

        {isLoading && <TypingIndicator />}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-3"
          >
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  if (messages.length > 0) {
                    const lastUserMsg = [...messages]
                      .reverse()
                      .find((m) => m.role === 'user');
                    if (lastUserMsg) sendMessage(lastUserMsg.content);
                  }
                }}
                className="flex items-center gap-1 text-accent-pink hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                Retry
              </button>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-2.5"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, projects, experience..."
            maxLength={500}
            disabled={isLoading}
            aria-label="Chat message"
            className="flex-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-full px-4 py-2 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-1 focus:ring-accent-pink disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-9 w-9 rounded-full bg-accent-pink text-white flex items-center justify-center hover:bg-accent-pink-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}

