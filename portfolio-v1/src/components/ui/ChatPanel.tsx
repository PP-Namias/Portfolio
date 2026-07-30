'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { X, Send, RotateCcw, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { useModal } from '@/hooks/useModal';
import { useCmsContent } from '@/hooks/useCmsContent';
import { useChatStream } from '@/hooks/use-chat-stream';
import { IS_CHAT_STREAMING_ENABLED } from '@/lib/features';
import type { ChatMessage as ChatMessageType } from '@/types';
import Image from '@/components/ui/OptimizedImage';
import { resolveContentImageSrc } from '@/lib/media';

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
  profile: 'Who is Keneth? Tell me about him.',
  booking: 'How can I schedule a meeting with Keneth?',
};

const WELCOME_MESSAGE: ChatMessageType = {
  id: 'welcome-message',
  role: 'assistant',
  content: 'Hi there! I\'m Keneth\'s AI assistant. I can help you learn about Keneth\'s skills, experience, projects, and more. What would you like to know?\n\n[WELCOME_TOPICS]',
  timestamp: new Date(),
};

type ChatAvailabilityStatus = 'checking' | 'active' | 'inactive';

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-2.5"
    >
      <div className="bg-white dark:bg-card-bg-dark border border-border-light/60 dark:border-border-dark/60 rounded-2xl rounded-bl-md px-3.5 py-2.5 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1 w-1 rounded-full bg-accent-pink/60"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.12,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ToolCallIndicator({ name }: Readonly<{ name: string }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-2.5"
    >
      <div className="bg-white dark:bg-card-bg-dark border border-border-light/60 dark:border-border-dark/60 rounded-2xl rounded-bl-md px-3 py-2 flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-3 w-3 rounded-full border-2 border-accent-pink/30 border-t-accent-pink"
        />
        <span className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
          Using {name.replace(/_/g, ' ')}...
        </span>
      </div>
    </motion.div>
  );
}

function StreamingMessage({ content }: Readonly<{ content: string }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-2.5"
    >
      <div className="max-w-[95%] bg-white dark:bg-card-bg-dark border border-border-light/60 dark:border-border-dark/60 text-text-primary-light dark:text-text-primary-dark rounded-2xl rounded-bl-md">
        <div className="px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap">
          {content}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
            className="inline-block h-3.5 w-[2px] bg-accent-pink ml-0.5 align-text-bottom"
          />
        </div>
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
  const [streamingContent, setStreamingContent] = useState('');
  const [currentToolCall, setCurrentToolCall] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useModal();
  const { profile, hero } = useCmsContent();
  const profileImageSrc = resolveContentImageSrc(hero.profileImageUrl, {
    folder: 'profile',
  });

  const streamingContentRef = useRef('');

  useEffect(() => {
    streamingContentRef.current = streamingContent;
  }, [streamingContent]);

  const handleStreamToken = useCallback((token: string) => {
    setStreamingContent((prev) => prev + token);
  }, []);

  const handleStreamToolCall = useCallback((toolCall: { name: string }) => {
    setCurrentToolCall(toolCall.name);
  }, []);

  const handleStreamDone = useCallback((threadId: string) => {
    setCurrentThreadId(threadId);
    const content = streamingContentRef.current;
    setMessages((prev) => {
      if (!content) return prev;
      const exists = prev.some((m) => m.id === 'streaming-msg');
      if (exists) {
        return prev.map((m) =>
          m.id === 'streaming-msg'
            ? { ...m, content }
            : m
        );
      }
      return [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content,
          timestamp: new Date(),
        },
      ];
    });
    setStreamingContent('');
    setCurrentToolCall(null);
  }, [setMessages]);

  const handleStreamError = useCallback((err: string) => {
    setError(err);
  }, []);

  const {
    sendMessage: streamSendMessage,
    isStreaming,
    cancel,
  } = useChatStream({
    onToken: handleStreamToken,
    onToolCall: handleStreamToolCall,
    onDone: handleStreamDone,
    onError: handleStreamError,
  });

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setInput('');
    setStreamingContent('');
    setCurrentToolCall(null);
  }, [setMessages]);

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
  }, [messages, isLoading, streamingContent]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([WELCOME_MESSAGE]);
    }
  }, [messages.length, setMessages]);

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

  const messagesRef = useRef(messages);
  const isLoadingRef = useRef(isLoading);
  const isStreamingRef = useRef(isStreaming);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    isStreamingRef.current = isStreaming;
  }, [isStreaming]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoadingRef.current || isStreamingRef.current) return;

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

      const history = messagesRef.current.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      if (IS_CHAT_STREAMING_ENABLED) {
        try {
          await streamSendMessage(trimmed);
        } catch {
          setError('Failed to stream response.');
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
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
    [setMessages, streamSendMessage]
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

  const hasStreamingMessage = streamingContent.length > 0;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with full image and title context */}
        <div className="relative px-4 pt-4 pb-3 border-b border-border-light/60 dark:border-border-dark/60 bg-white dark:bg-card-bg-dark">
          {/* Background gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent-pink/5 to-transparent pointer-events-none" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Back button */}
              <button
                type="button"
                onClick={onBack}
                className="h-7 w-7 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors flex-shrink-0 mt-0.5"
                aria-label="Back to menu"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>

              {/* Profile section with full context */}
              <div className="flex items-center gap-3">
                {/* Large profile image with status indicator */}
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-white dark:border-card-bg-dark shadow-md">
                    {profileImageSrc ? (
                      <Image
                        src={profileImageSrc}
                        alt={profile.name}
                        width={48}
                        height={48}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-surface-light text-[11px] font-semibold text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark">
                        PN
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent-pink flex items-center justify-center border-2 border-white dark:border-card-bg-dark shadow-sm">
                    <Sparkles className="h-2 w-2 text-white" />
                  </div>
                </div>

                {/* Name, title, and status */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold text-text-primary-light dark:text-text-primary-dark leading-tight truncate">
                      {profile.name}
                    </p>
                  </div>
                  <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark truncate mt-0.5">
                    {profile.title}
                  </p>
                  <p className={`text-[9px] flex items-center gap-1 mt-0.5 ${statusMeta.textClass}`}>
                    <span className="relative flex h-1 w-1 flex-shrink-0">
                      {statusMeta.showPulse && (
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusMeta.pulseClass} opacity-75`} />
                      )}
                      <span className={`relative inline-flex h-1 w-1 rounded-full ${statusMeta.dotClass}`} />
                    </span>
                    {statusMeta.label}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="flex items-center gap-1 h-7 px-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  aria-label="Clear chat history"
                  title="Clear chat"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="h-7 w-7 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                aria-label="Close chat"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages container */}
        <div
          ref={messagesContainerRef}
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 chat-scrollbar touch-pan-y bg-gradient-to-b from-surface-light/30 to-white dark:from-surface-dark/30 dark:to-card-bg-dark"
        >
          <AnimatePresence mode="wait">
            {messages.length === 0 && !isLoading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full px-4"
              >
                <div className="relative mb-4">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white dark:border-card-bg-dark shadow-lg">
                    {profileImageSrc ? (
                      <Image
                        src={profileImageSrc}
                        alt={profile.name}
                        width={64}
                        height={64}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-surface-light text-[13px] font-semibold text-text-muted-light dark:bg-surface-dark dark:text-text-muted-dark">
                        PN
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent-pink flex items-center justify-center border-2 border-white dark:border-card-bg-dark shadow-md">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <p className="text-[15px] font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">
                  Hi! I&apos;m {profile.name}&apos;s AI
                </p>
                <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark mt-1 mb-5 text-center max-w-[200px]">
                  {profile.title} — Ask me anything about skills, experience, or projects
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onAction={handleAction} />
          ))}

          {currentToolCall && <ToolCallIndicator name={currentToolCall} />}

          {hasStreamingMessage && <StreamingMessage content={streamingContent} />}

          {messages.length > 0 && !isLoading && !hasStreamingMessage && messages.at(-1)?.role === 'assistant' && followUpSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-1 mb-2.5 mt-1"
            >
              {followUpSuggestions.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[10px] px-2 py-1 rounded-full border border-border-light/60 dark:border-border-dark/60 text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink/40 hover:text-accent-pink transition-[border-color,color]"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          {isLoading && !hasStreamingMessage && <TypingIndicator />}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mb-2.5"
            >
              <div className="flex items-center gap-2 text-[11px] text-red-500 bg-red-500/8 rounded-lg px-3 py-2">
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
                  className="flex items-center gap-1 text-accent-pink hover:underline font-medium"
                >
                  <RotateCcw className="h-3 w-3" />
                  Retry
                </button>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-border-light/60 dark:border-border-dark/60 bg-white dark:bg-card-bg-dark px-3 py-3">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skills, projects..."
              maxLength={500}
              disabled={isLoading || isStreaming}
              aria-label="Chat message"
              className="flex-1 bg-surface-light/80 dark:bg-surface-dark/80 border border-border-light/60 dark:border-border-dark/60 rounded-full px-4 py-2.5 text-[13px] text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/60 dark:placeholder:text-text-muted-dark/60 focus-visible:outline-none focus-visible:border-accent-pink/40 focus-visible:ring-1 focus-visible:ring-accent-pink/20 disabled:opacity-50 transition-[border-color,box-shadow]"
            />
            <button
              type="submit"
              disabled={isLoading || isStreaming || !input.trim()}
              className="h-9 w-9 rounded-full bg-accent-pink text-white flex items-center justify-center hover:bg-accent-pink-hover transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0 shadow-sm shadow-accent-pink/20 disabled:shadow-none"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
