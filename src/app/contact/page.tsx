'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clipboard, Mail, Send, Sparkles, Trash2 } from 'lucide-react';
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

const DRAFT_STORAGE_KEY = 'contact-page-draft-v2';

const TOPIC_PRESETS = [
  {
    label: 'Project Collaboration',
    subject: 'Project collaboration inquiry',
    starter:
      'I would like to discuss a potential project collaboration with you. Here are the details:',
  },
  {
    label: 'Freelance Work',
    subject: 'Freelance availability inquiry',
    starter:
      'I have a freelance opportunity and would like to know your availability and rates.',
  },
  {
    label: 'Consultation',
    subject: 'Consultation request',
    starter:
      'I would like to book a technical consultation regarding this challenge:',
  },
  {
    label: 'Speaking',
    subject: 'Speaking engagement inquiry',
    starter:
      'I would like to invite you to speak at our event/workshop. Here are the details:',
  },
] as const;

function buildEmailLinks(form: ContactFormState, recipient: string) {
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

  const encodedRecipient = encodeURIComponent(recipient);
  const encodedSubject = encodeURIComponent(subject);
  const encodedMessage = encodeURIComponent(message);

  return {
    subject,
    message,
    mailto: `mailto:${recipient}?subject=${encodedSubject}&body=${encodedMessage}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedRecipient}&su=${encodedSubject}&body=${encodedMessage}`,
    outlook: `https://outlook.office.com/mail/deeplink/compose?to=${encodedRecipient}&subject=${encodedSubject}&body=${encodedMessage}`,
  };
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<
    'idle' | 'opening' | 'invalid' | 'copied' | 'copy-failed'
  >('idle');
  const [draftRestored, setDraftRestored] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

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

  useEffect(() => {
    let restoredSubject = '';

    try {
      const rawDraft = globalThis.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft) as Partial<ContactFormState>;
        const nextDraft: ContactFormState = {
          name: typeof parsed.name === 'string' ? parsed.name : '',
          email: typeof parsed.email === 'string' ? parsed.email : '',
          subject: typeof parsed.subject === 'string' ? parsed.subject : '',
          message: typeof parsed.message === 'string' ? parsed.message : '',
        };

        if (
          nextDraft.name ||
          nextDraft.email ||
          nextDraft.subject ||
          nextDraft.message
        ) {
          restoredSubject = nextDraft.subject;
          setForm(nextDraft);
          setDraftRestored(true);
        }
      }
    } catch {
      // Ignore malformed local draft and continue with clean form.
    }

    const subjectParam = new URLSearchParams(globalThis.location.search).get('subject')?.trim();
    if (!subjectParam || restoredSubject.trim().length > 0) {
      return;
    }

    setForm((prev) => ({ ...prev, subject: subjectParam }));
  }, []);

  useEffect(() => {
    const hasContent =
      form.name.trim().length > 0 ||
      form.email.trim().length > 0 ||
      form.subject.trim().length > 0 ||
      form.message.trim().length > 0;

    try {
      if (!hasContent) {
        globalThis.localStorage.removeItem(DRAFT_STORAGE_KEY);
        return;
      }

      globalThis.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Ignore storage write errors.
    }
  }, [form]);

  const bookingLink = useMemo(
    () => socialLinks.find((link) => link.name === 'cal')?.link ?? null,
    []
  );

  const calendarShortcuts = useMemo(() => {
    if (!bookingLink) {
      return {
        fifteen: null,
        thirty: null,
      };
    }

    const base = bookingLink.replace(/\/+$/, '');
    return {
      fifteen: `${base}/15min`,
      thirty: `${base}/30min`,
    };
  }, [bookingLink]);

  const emailLinks = useMemo(() => buildEmailLinks(form, profile.email), [form]);

  const statusMessage = useMemo(() => {
    if (status === 'opening') {
      return (
        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <Mail className="h-3.5 w-3.5" />
          Opening your email app with pre-filled details.
        </span>
      );
    }

    if (status === 'copied') {
      return <span className="text-emerald-600 dark:text-emerald-400">Draft copied to clipboard.</span>;
    }

    if (status === 'copy-failed') {
      return <span className="text-amber-600 dark:text-amber-400">Couldn&apos;t copy automatically. Use the email app buttons below.</span>;
    }

    if (status === 'invalid') {
      return <span>Please fix the highlighted fields before continuing.</span>;
    }

    return (
      <span>
        Don&apos;t have a desktop email app configured? Use Gmail/Outlook options below or send directly to{' '}
        <a href={`mailto:${profile.email}`} className="text-accent-pink hover:underline">
          {profile.email}
        </a>.
      </span>
    );
  }, [status]);

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

  const handleTopicPreset = (preset: (typeof TOPIC_PRESETS)[number]) => {
    setForm((prev) => ({
      ...prev,
      subject: preset.subject,
      message: prev.message.trim().length > 0 ? prev.message : `${preset.starter}\n\n`,
    }));
    setStatus('idle');
  };

  const handleCopyDraft = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('invalid');
      return;
    }

    try {
      await globalThis.navigator.clipboard.writeText(
        `To: ${profile.email}\nSubject: ${emailLinks.subject}\n\n${emailLinks.message}`
      );
      setStatus('copied');
    } catch {
      setStatus('copy-failed');
    }
  };

  const handleClearDraft = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus('idle');
    setDraftRestored(false);
    setLastSavedAt(null);
    try {
      globalThis.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore storage cleanup errors.
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
    globalThis.location.href = emailLinks.mailto;
  };

  return (
    <main id="main-content" className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto space-y-6">
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

        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03, duration: 0.3 }}
            className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-5 sm:p-6 shadow-sm space-y-4"
          >
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                Let&apos;s connect
              </h1>
              <p className="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark">
                This is your dedicated contact page: faster email drafting, smarter presets, and fewer clicks.
              </p>
            </div>

            <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-3.5 space-y-2">
              <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark inline-flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-accent-pink" />
                Quick process
              </p>
              <ol className="text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1 list-decimal pl-4">
                <li>Pick a topic preset (optional).</li>
                <li>Complete your details and message.</li>
                <li>Open draft in your email app (or Gmail/Outlook).</li>
              </ol>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Need a call instead?</p>
              <div className="flex flex-wrap gap-2">
                {calendarShortcuts.fifteen ? (
                  <a
                    href={calendarShortcuts.fifteen}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-light dark:border-border-dark px-3 py-2 text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    15 min meeting
                  </a>
                ) : null}

                {calendarShortcuts.thirty ? (
                  <a
                    href={calendarShortcuts.thirty}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-light dark:border-border-dark px-3 py-2 text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    30 min meeting
                  </a>
                ) : null}
              </div>
            </div>

            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {draftRestored ? (
                <span>Draft restored from your previous session.</span>
              ) : (
                <span>We save your draft locally while you type.</span>
              )}
              {lastSavedAt ? <span className="ml-1">Last saved at {lastSavedAt}.</span> : null}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3 }}
            className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-5 sm:p-7 shadow-sm"
          >
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                Send me a message
              </h2>
              <p className="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark">
                Fill this out and I&apos;ll generate a ready-to-send email draft. Quick, clean, and no copy-paste gymnastics.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <p className="mb-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  Quick topic presets
                </p>
                <div className="flex flex-wrap gap-2">
                  {TOPIC_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleTopicPreset(preset)}
                      className="rounded-full border border-border-light dark:border-border-dark px-3 py-1.5 text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink hover:text-accent-pink dark:hover:border-accent-pink dark:hover:text-accent-pink transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

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

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="inline-flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors"
                >
                  <Clipboard className="h-4 w-4" />
                  Copy draft
                </button>

                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="inline-flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-rose-500 hover:border-rose-400 dark:hover:text-rose-400 dark:hover:border-rose-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
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

              <div className="flex flex-wrap gap-2">
                <a
                  href={emailLinks.gmail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-3 py-2 text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors"
                >
                  Open in Gmail
                </a>

                <a
                  href={emailLinks.outlook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-3 py-2 text-xs sm:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors"
                >
                  Open in Outlook
                </a>
              </div>

              <div
                aria-live="polite"
                className="rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-xs sm:text-sm text-text-muted-light dark:text-text-muted-dark"
              >
                {statusMessage}
              </div>
            </form>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
