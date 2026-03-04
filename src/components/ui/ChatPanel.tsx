'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X, Send, RotateCcw, ArrowLeft, Trash2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { useModal } from '@/hooks/useModal';
import type { ChatMessage as ChatMessageType } from '@/types';

const SUGGESTED_QUESTIONS = [
  'What are your top skills?',
  'Tell me about your AI automation work',
  'What projects have you shipped?',
  'I\'d like to schedule a meeting',
];

const FOLLOW_UP_SUGGESTIONS = [
  'What certifications do you have?',
  'Tell me about your education',
  'What companies have you worked with?',
  'Can I see your resume?',
  'How can I contact Keneth?',
  'What tech stack do you specialize in?',
];

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-white dark:bg-card-bg-dark border border-border-light dark:border-border-dark rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-accent-pink"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface ChatPanelProps {
  onBack: () => void;
  onClose: () => void;
  messages: ChatMessageType[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
}

export function ChatPanel({ onBack, onClose, messages, setMessages }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useModal();

  const handleAction = useCallback((action: string) => {
    if (action === 'booking') {
      openModal('booking');
    } else if (action === 'resume') {
      openModal('resume');
    } else if (action === 'email') {
      window.open('mailto:pp.namias@gmail.com', '_blank');
    }
  }, [openModal]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, [setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

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
          setIsLoading(false);
          return;
        }

        const botMsg: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        setError('Failed to connect. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, setMessages]
  );

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
            onClick={onBack}
            className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            aria-label="Back to menu"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="h-8 w-8 rounded-full bg-accent-pink flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
              Keneth&apos;s AI
            </p>
            <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
              Ask me anything about Keneth
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark hover:text-red-500 transition-colors"
              aria-label="Clear chat history"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Pink accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-accent-pink via-accent-pink-hover-dark to-accent-pink" />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="h-12 w-12 rounded-full bg-accent-pink/10 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-accent-pink" />
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center">
              Hi! I&apos;m Keneth&apos;s AI assistant.
              <br />
              Ask me about his skills, projects, or experience.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink hover:text-accent-pink transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onAction={handleAction} />
        ))}

        {/* Follow-up suggestion chips after AI response */}
        {messages.length > 0 && !isLoading && messages[messages.length - 1].role === 'assistant' && (
          <div className="flex flex-wrap gap-1.5 mb-3 mt-1">
            {FOLLOW_UP_SUGGESTIONS
              .filter((q) => !messages.some((m) => m.role === 'user' && m.content === q))
              .slice(0, 3)
              .map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink hover:text-accent-pink transition-colors"
                >
                  {q}
                </button>
              ))}
          </div>
        )}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="flex justify-center mb-3">
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2">
              <span>{error}</span>
              <button
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
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          maxLength={500}
          disabled={isLoading}
          className="flex-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-1 focus:ring-accent-pink disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="h-9 w-9 rounded-lg bg-accent-pink text-white flex items-center justify-center hover:bg-accent-pink-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </>
  );
}
