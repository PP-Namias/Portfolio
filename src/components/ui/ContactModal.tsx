'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Mail, MessageSquareText, Send } from 'lucide-react';
import { profile } from '@/data/profile';
import { socialLinks } from '@/data/socials';
import { Modal } from './Modal';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

interface ContactFormState {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const INITIAL_FORM_STATE: ContactFormState = {
  name: '',
  email: '',
  topic: '',
  message: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactModal({ open, onClose }: Readonly<ContactModalProps>) {
  const [formState, setFormState] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const bookingLink = useMemo(
    () => socialLinks.find((link) => link.name === 'cal')?.link ?? 'https://cal.com/pp-namias',
    []
  );

  useEffect(() => {
    if (!open) return;
    setStatus('idle');
    setStatusMessage('');
    setFormState(INITIAL_FORM_STATE);
  }, [open]);

  const handleInputChange =
    (field: keyof ContactFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      if (status !== 'idle') {
        setStatus('idle');
        setStatusMessage('');
      }
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = formState.name.trim();
    const trimmedEmail = formState.email.trim();
    const trimmedTopic = formState.topic.trim();
    const trimmedMessage = formState.message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setStatus('error');
      setStatusMessage('Please enter your full name.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setStatus('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      setStatus('error');
      setStatusMessage('Please add a message with at least 10 characters.');
      return;
    }

    const subject = `[Portfolio Contact] ${trimmedTopic || 'New inquiry'} — ${trimmedName}`;
    const body = [
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      `Topic: ${trimmedTopic || 'General inquiry'}`,
      '',
      'Message:',
      trimmedMessage,
    ].join('\n');

    const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      globalThis.location.href = mailtoHref;
      setStatus('success');
      setStatusMessage('Your email draft has been opened. If it did not open, use the fallback links below.');
    } catch {
      setStatus('error');
      setStatusMessage('Could not open your email app automatically. Please use the fallback links below.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Contact Keneth">
      <div className="px-5 py-4 sm:px-6 sm:py-5 space-y-4">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          Share your project details, timeline, and goals. I usually respond within 24 hours.
        </p>

        <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark">Name</span>
              <input
                type="text"
                value={formState.name}
                onChange={handleInputChange('name')}
                className="h-10 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-3 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-accent-pink/40 focus:border-accent-pink"
                placeholder="Your name"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark">Email</span>
              <input
                type="email"
                value={formState.email}
                onChange={handleInputChange('email')}
                className="h-10 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-3 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-accent-pink/40 focus:border-accent-pink"
                placeholder="name@email.com"
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark">Topic (optional)</span>
            <input
              type="text"
              value={formState.topic}
              onChange={handleInputChange('topic')}
              className="h-10 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-3 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-accent-pink/40 focus:border-accent-pink"
              placeholder="Automation, full-stack build, consulting..."
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark">Message</span>
            <textarea
              value={formState.message}
              onChange={handleInputChange('message')}
              rows={5}
              className="rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-2.5 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-accent-pink/40 focus:border-accent-pink resize-y min-h-[130px]"
              placeholder="Tell me about your project, scope, timeline, and goals."
              required
            />
          </label>

          {status !== 'idle' && (
            <div
              className={`rounded-lg px-3 py-2 text-xs font-medium ${
                status === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}
              aria-live="polite"
            >
              {statusMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors"
            >
              <Send className="h-4 w-4" />
              Open email draft
            </button>

            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink hover:text-accent-pink transition-colors"
            >
              <Mail className="h-4 w-4" />
              Send direct email
            </a>

            <a
              href={bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink hover:text-accent-pink transition-colors"
            >
              <MessageSquareText className="h-4 w-4" />
              Book on Cal.com
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </form>
      </div>
    </Modal>
  );
}
