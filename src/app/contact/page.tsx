'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Mail, Send } from 'lucide-react';
import { profile } from '@/data/profile';
import { socialLinks } from '@/data/socials';

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM: ContactFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function buildMailtoUrl(form: ContactFormState, recipient: string) {
  const subject = form.subject.trim() || `Inquiry from ${form.name.trim()}`;
  const message = [
    `Hi ${profile.name},`,
    '',
    form.message.trim(),
    '',
    '—',
    `${form.name.trim()}`,
    `${form.email.trim()}`,
  ].join('\n');

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'opening' | 'invalid'>('idle');

  useEffect(() => {
    const subjectParam = new URLSearchParams(globalThis.location.search).get('subject')?.trim();
    if (!subjectParam) return;

    setForm((prev) => {
      if (prev.subject.trim().length > 0) {
        return prev;
      }
      return { ...prev, subject: subjectParam };
    });
  }, []);

  const bookingLink = useMemo(
    () => socialLinks.find((link) => link.name === 'cal')?.link ?? null,
    []
  );

  const statusMessage = useMemo(() => {
    if (status === 'opening') {
      return (
        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <Mail className="h-3.5 w-3.5" />
          Opening your email app with pre-filled details.
        </span>
      );
    }

    if (status === 'invalid') {
      return <span>Please fix the highlighted fields before continuing.</span>;
    }

    return (
      <span>
        Don&apos;t have a desktop email app configured? You can send directly to{' '}
        <a href={`mailto:${profile.email}`} className="text-accent-pink hover:underline">
          {profile.email}
        </a>
        {'.'}
      </span>
    );
  }, [status]);

  const validate = (currentForm: ContactFormState): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};

    if (currentForm.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name.';
    }

    if (!EMAIL_REGEX.test(currentForm.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (currentForm.subject.trim().length < 3) {
      nextErrors.subject = 'Please enter a short subject.';
    }

    if (currentForm.message.trim().length < 15) {
      nextErrors.message = 'Please add a bit more detail (at least 15 characters).';
    }

    return nextErrors;
  };

  const handleChange = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('invalid');
      return;
    }

    setStatus('opening');
    const mailtoUrl = buildMailtoUrl(form, profile.email);
    globalThis.location.href = mailtoUrl;
  };

  return (
    <main id="main-content" className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-5 sm:p-7 shadow-sm"
        >
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              Send me a message
            </h1>
            <p className="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark">
              Fill this out and I&apos;ll open your email app with a ready-to-send draft. Quick, clean, and no copy-paste gymnastics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  className="w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-pink"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                />
                {errors.name ? (
                  <p id="contact-name-error" className="mt-1 text-xs text-red-500">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
                >
                  Your email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  className="w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-pink"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                />
                {errors.email ? (
                  <p id="contact-email-error" className="mt-1 text-xs text-red-500">
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={(event) => handleChange('subject', event.target.value)}
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-pink"
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
              />
              {errors.subject ? (
                <p id="contact-subject-error" className="mt-1 text-xs text-red-500">
                  {errors.subject}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={7}
                value={form.message}
                onChange={(event) => handleChange('message', event.target.value)}
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-pink"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
              />
              {errors.message ? (
                <p id="contact-message-error" className="mt-1 text-xs text-red-500">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-accent-pink px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-pink-hover dark:hover:bg-accent-pink-hover-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent-pink focus:ring-offset-2 dark:focus:ring-offset-background-dark"
              >
                <Send className="h-4 w-4" />
                Open email draft
              </button>

              {bookingLink ? (
                <a
                  href={bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Prefer to talk live?
                </a>
              ) : null}
            </div>

            <div className="rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-xs sm:text-sm text-text-muted-light dark:text-text-muted-dark">
              {statusMessage}
            </div>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
