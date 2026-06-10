'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Check, Clipboard, Mail, MessageSquare, Send, Sparkles, Trash2, User } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { useCmsContent } from '@/hooks/useCmsContent';
import { DISCORD_PROFILE_URL } from '@/lib/constants';
import { Modal } from './Modal';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

type StepId = 1 | 2 | 3;

type ContactFormState = {
  name: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM: ContactFormState = {
  name: '',
  email: '',
  topic: '',
  subject: '',
  message: '',
};

const DRAFT_STORAGE_KEY = 'contact-modal-draft-v1';
const BOOKING_MODAL_EVENT_KEY = 'booking-modal-event';

const TOPIC_PRESETS = [
  { label: 'Project Collaboration', icon: '💻', subject: 'Project collaboration inquiry', starter: 'I would like to discuss a potential project collaboration with you. Here are the details:' },
  { label: 'Freelance Work', icon: '💼', subject: 'Freelance availability inquiry', starter: 'I have a freelance opportunity and would like to know your availability and rates.' },
  { label: 'Consultation', icon: '🧠', subject: 'Consultation request', starter: 'I would like to book a technical consultation regarding this challenge:' },
  { label: 'Speaking', icon: '🎤', subject: 'Speaking engagement inquiry', starter: 'I would like to invite you to speak at our event/workshop. Here are the details:' },
] as const;

const STEP_LABELS: Record<StepId, string> = {
  1: 'Who are you?',
  2: "What's this about?",
  3: 'Your message',
};

const STEP_FIELDS: Record<StepId, (keyof ContactFormState)[]> = {
  1: ['name', 'email'],
  2: ['subject'],
  3: ['message'],
};

function validateFields(form: ContactFormState, fields: (keyof ContactFormState)[]): ContactFormErrors {
  const nextErrors: ContactFormErrors = {};
  for (const field of fields) {
    switch (field) {
      case 'name':
        if (form.name.trim().length < 2) nextErrors.name = 'Please enter your name.';
        break;
      case 'email':
        if (!EMAIL_REGEX.test(form.email.trim())) nextErrors.email = 'Please enter a valid email address.';
        break;
      case 'subject':
        if (form.subject.trim().length < 3) nextErrors.subject = 'Please enter a short subject.';
        break;
      case 'message':
        if (form.message.trim().length < 15) nextErrors.message = 'Please add a bit more detail (at least 15 characters).';
        break;
    }
  }
  return nextErrors;
}

export function ContactModal({ open, onClose }: Readonly<ContactModalProps>) {
  const { openModal } = useModal();
  const { profile, socialLinks } = useCmsContent();
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const calcomUrl = useMemo(
    () => socialLinks.find((link) => link.name === 'cal')?.link ?? 'https://cal.com/pp-namias/introductory-call',
    [socialLinks]
  );

  const emailLinks = useMemo(() => {
    const subject = form.subject.trim() || `Inquiry from ${form.name.trim()}`;
    const message = [`Hi ${profile.name},`, '', form.message.trim(), '', '--', `${form.name.trim()}`, `${form.email.trim()}`].join('\n');
    const encodedRecipient = encodeURIComponent(profile.email);
    const encodedSubject = encodeURIComponent(subject);
    const encodedMessage = encodeURIComponent(message);
    return {
      subject, message,
      mailto: `mailto:${profile.email}?subject=${encodedSubject}&body=${encodedMessage}`,
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedRecipient}&su=${encodedSubject}&body=${encodedMessage}`,
      outlook: `https://outlook.office.com/mail/deeplink/compose?to=${encodedRecipient}&subject=${encodedSubject}&body=${encodedMessage}`,
    };
  }, [form, profile.email, profile.name]);

  const messagePreview = useMemo(() => {
    const subject = form.subject.trim() || `Inquiry from ${form.name.trim()}`;
    return [`To: ${profile.email}`, `Subject: subject`, '', `Hi ${profile.name},`, '', form.message.trim() || '(your message here)', '', '--', form.name.trim() || '(your name)', form.email.trim() || '(your email)'].join('\n');
  }, [form, profile.email, profile.name]);

  const [status, setStatus] = useState<'idle' | 'opening' | 'invalid' | 'copied' | 'copy-failed'>('idle');

  useEffect(() => {
    if (!open) return;
    try {
      const rawDraft = globalThis.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!rawDraft) return;
      const parsed = JSON.parse(rawDraft) as Partial<ContactFormState>;
      const nextDraft: ContactFormState = {
        name: typeof parsed.name === 'string' ? parsed.name : '',
        email: typeof parsed.email === 'string' ? parsed.email : '',
        topic: typeof parsed.topic === 'string' ? parsed.topic : '',
        subject: typeof parsed.subject === 'string' ? parsed.subject : '',
        message: typeof parsed.message === 'string' ? parsed.message : '',
      };
      if (nextDraft.name || nextDraft.email || nextDraft.topic || nextDraft.subject || nextDraft.message) {
        setForm(nextDraft);
        if (nextDraft.message && nextDraft.subject) setCurrentStep(3);
        else if (nextDraft.name && nextDraft.email) setCurrentStep(2);
      }
    } catch {
      // Ignore malformed local draft.
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const hasContent = form.name.trim() || form.email.trim() || form.topic.trim() || form.subject.trim() || form.message.trim();
    try {
      if (!hasContent) { globalThis.localStorage.removeItem(DRAFT_STORAGE_KEY); return; }
      globalThis.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
    } catch {
      // Ignore storage write errors.
    }
  }, [form, open]);

  const goToStep = useCallback(
    (target: StepId) => {
      if (target === currentStep) return;
      setDirection(target > currentStep ? 1 : -1);
      setErrors({});
      setCurrentStep(target);
    },
    [currentStep]
  );

  const handleNext = useCallback(() => {
    const fields = STEP_FIELDS[currentStep];
    const validationErrors = validateFields(form, fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (currentStep < 3) goToStep((currentStep + 1) as StepId);
  }, [currentStep, form, goToStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) goToStep((currentStep - 1) as StepId);
  }, [currentStep, goToStep]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && currentStep < 3) {
        e.preventDefault();
        handleNext();
      }
    },
    [currentStep, handleNext]
  );

  const handleChange = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const handleTopicSelect = (preset: (typeof TOPIC_PRESETS)[number]) => {
    setForm((prev) => ({
      ...prev,
      topic: preset.label,
      subject: preset.subject,
      message: prev.message.trim().length > 0 ? prev.message : `${preset.starter}\n\n`,
    }));
  };

  const handleCopyDraft = async () => {
    const validationErrors = validateFields(form, ['message']);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); setStatus('invalid'); return; }
    try {
      await globalThis.navigator.clipboard.writeText(`To: ${profile.email}\nSubject: ${emailLinks.subject}\n\n${emailLinks.message}`);
      setStatus('copied');
    } catch { setStatus('copy-failed'); }
  };

  const handleSubmit = () => {
    const allFields: (keyof ContactFormState)[] = ['name', 'email', 'subject', 'message'];
    const validationErrors = validateFields(form, allFields);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); setStatus('invalid'); return; }
    setStatus('opening');
    const popup = globalThis.open(emailLinks.mailto, '_blank', 'noopener,noreferrer');
    if (!popup) globalThis.location.href = emailLinks.mailto;
  };

  const handleClearDraft = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setCurrentStep(1);
    try { globalThis.localStorage.removeItem(DRAFT_STORAGE_KEY); } catch { /* Ignore. */ }
  };

  const handleBookCall = () => {
    try { globalThis.sessionStorage.setItem(BOOKING_MODAL_EVENT_KEY, 'introductory-call'); } catch { /* Ignore. */ }
    openModal('booking');
  };

  return (
    <Modal open={open} onClose={onClose} fullScreen descriptionId="contact-modal-description">
      <div className="flex flex-col h-full bg-surface-light dark:bg-surface-dark transition-colors duration-300">
        {/* Top action bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-light dark:border-border-dark flex-shrink-0 overflow-x-auto">
          <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark mr-1 hidden sm:inline">
            Quick reach:
          </span>
          <a
            href={DISCORD_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors whitespace-nowrap"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Discord
          </a>
          <button
            type="button"
            onClick={handleBookCall}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20 transition-colors whitespace-nowrap"
          >
            <Calendar className="h-3.5 w-3.5" />
            Book a Call
          </button>
          <a
            href={`mailto:${profile.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink transition-colors whitespace-nowrap"
          >
            <Mail className="h-3.5 w-3.5" />
            Direct Email
          </a>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-light dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
              {STEP_LABELS[currentStep]}
            </h2>
            <span className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
              {currentStep} of 3
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {([1, 2, 3] as const).map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => goToStep(step)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === currentStep ? 'w-6 bg-accent-pink'
                      : step < currentStep ? 'w-2 bg-accent-pink/50'
                        : 'w-2 bg-border-light dark:bg-border-dark'
                  }`}
                  aria-label={`Go to step ${step}: ${STEP_LABELS[step]}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-3 h-7 w-7 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-lg"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto" id="contact-modal-description">
          <div className="relative min-h-full" onKeyDown={handleKeyDown}>
            <AnimatePresence mode="wait" custom={direction}>
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="px-5 py-6 sm:px-8 sm:py-8"
                >
                  <div className="max-w-lg mx-auto space-y-6">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 rounded-full bg-accent-pink/10 px-3 py-1 mb-2">
                        <User className="h-3.5 w-3.5 text-accent-pink" />
                        <span className="text-xs font-medium text-accent-pink">Step 1</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                        Who are you?
                      </h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Let me know who I&apos;m speaking with.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="contact-modal-name" className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                          Name
                        </label>
                        <input
                          id="contact-modal-name"
                          name="name"
                          autoComplete="name"
                          autoFocus
                          value={form.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark px-4 py-2.5 text-sm text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-pink transition-colors"
                          aria-invalid={errors.name ? 'true' : 'false'}
                          aria-describedby={errors.name ? 'contact-modal-name-error' : undefined}
                        />
                        {errors.name ? <p id="contact-modal-name-error" className="mt-1.5 text-xs text-red-500">{errors.name}</p> : null}
                      </div>
                      <div>
                        <label htmlFor="contact-modal-email" className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                          Email
                        </label>
                        <input
                          id="contact-modal-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark px-4 py-2.5 text-sm text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-pink transition-colors"
                          aria-invalid={errors.email ? 'true' : 'false'}
                          aria-describedby={errors.email ? 'contact-modal-email-error' : undefined}
                        />
                        {errors.email ? <p id="contact-modal-email-error" className="mt-1.5 text-xs text-red-500">{errors.email}</p> : null}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button type="button" onClick={handleClearDraft} className="inline-flex items-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <Trash2 className="h-3 w-3" />
                        Start over
                      </button>
                      <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 rounded-lg bg-accent-pink px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-pink-hover dark:hover:bg-accent-pink-hover-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent-pink focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                        Next
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="px-5 py-6 sm:px-8 sm:py-8"
                >
                  <div className="max-w-lg mx-auto space-y-6">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 rounded-full bg-accent-pink/10 px-3 py-1 mb-2">
                        <Sparkles className="h-3.5 w-3.5 text-accent-pink" />
                        <span className="text-xs font-medium text-accent-pink">Step 2</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                        What&apos;s this about?
                      </h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Pick a topic to get started faster.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {TOPIC_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleTopicSelect(preset)}
                          className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-4 sm:p-5 text-center transition-all duration-200 ${
                            form.topic === preset.label
                              ? 'border-accent-pink bg-accent-pink/5 shadow-sm'
                              : 'border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark hover:border-accent-pink/40 hover:shadow-sm'
                          }`}
                        >
                          <span className="text-2xl" role="img" aria-hidden="true">{preset.icon}</span>
                          <span className={`text-sm font-medium ${form.topic === preset.label ? 'text-accent-pink' : 'text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink'}`}>
                            {preset.label}
                          </span>
                          {form.topic === preset.label ? <Check className="h-4 w-4 text-accent-pink" /> : null}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label htmlFor="contact-modal-subject" className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                        Subject
                      </label>
                      <input
                        id="contact-modal-subject"
                        name="subject"
                        value={form.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        placeholder="What's the topic?"
                        className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark px-4 py-2.5 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-accent-pink transition-colors"
                        aria-invalid={errors.subject ? 'true' : 'false'}
                        aria-describedby={errors.subject ? 'contact-modal-subject-error' : undefined}
                      />
                      {errors.subject ? <p id="contact-modal-subject-error" className="mt-1.5 text-xs text-red-500">{errors.subject}</p> : null}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors">
                        <span aria-hidden="true">&larr;</span>
                        Back
                      </button>
                      <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 rounded-lg bg-accent-pink px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-pink-hover dark:hover:bg-accent-pink-hover-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent-pink focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                        Next
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="px-5 py-6 sm:px-8 sm:py-8"
                >
                  <div className="max-w-lg mx-auto space-y-6">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 rounded-full bg-accent-pink/10 px-3 py-1 mb-2">
                        <Send className="h-3.5 w-3.5 text-accent-pink" />
                        <span className="text-xs font-medium text-accent-pink">Step 3</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                        Your message
                      </h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Write your message and I&apos;ll prepare a ready-to-send email.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="contact-modal-message" className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                        Message
                      </label>
                      <textarea
                        id="contact-modal-message"
                        name="message"
                        rows={6}
                        autoFocus
                        value={form.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-accent-pink transition-colors resize-none"
                        aria-invalid={errors.message ? 'true' : 'false'}
                        aria-describedby={errors.message ? 'contact-modal-message-error' : undefined}
                      />
                      <div className="flex items-center justify-between mt-1.5">
                        {errors.message ? <p id="contact-modal-message-error" className="text-xs text-red-500">{errors.message}</p> : <span />}
                        <span className={`text-[11px] ${form.message.trim().length >= 15 ? 'text-emerald-500' : 'text-text-muted-light dark:text-text-muted-dark'}`}>
                          {form.message.trim().length} / 15 min
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-hidden">
                      <div className="px-4 py-2 border-b border-border-light dark:border-border-dark flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-text-muted-light dark:text-text-muted-dark" />
                        <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark">Email preview</span>
                      </div>
                      <pre className="px-4 py-3 text-xs text-text-secondary-light dark:text-text-secondary-dark whitespace-pre-wrap font-sans leading-relaxed max-h-40 overflow-y-auto">
                        {messagePreview}
                      </pre>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button type="button" onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-lg bg-accent-pink px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-pink-hover dark:hover:bg-accent-pink-hover-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent-pink focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                          <Send className="h-4 w-4" />
                          Open email draft
                        </button>
                        <button type="button" onClick={handleCopyDraft} className="inline-flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors">
                          <Clipboard className="h-4 w-4" />
                          Copy draft
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a href={emailLinks.gmail} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border-light dark:border-border-dark px-3 py-1.5 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink transition-colors">
                          Open Gmail
                        </a>
                        <a href={emailLinks.outlook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border-light dark:border-border-dark px-3 py-1.5 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink transition-colors">
                          Open Outlook
                        </a>
                      </div>
                    </div>

                    {status !== 'idle' ? (
                      <div aria-live="polite" className="rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-xs sm:text-sm">
                        {status === 'opening' && <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"><Mail className="h-3.5 w-3.5" /> Email draft opened.</span>}
                        {status === 'copied' && <span className="text-emerald-600 dark:text-emerald-400">Draft copied to clipboard.</span>}
                        {status === 'copy-failed' && <span className="text-amber-600 dark:text-amber-400">Couldn&apos;t copy. Use the Gmail/Outlook buttons above.</span>}
                        {status === 'invalid' && <span className="text-red-500">Please fix the highlighted fields before continuing.</span>}
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between pt-2">
                      <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors">
                        <span aria-hidden="true">&larr;</span>
                        Back
                      </button>
                      <button type="button" onClick={handleClearDraft} className="inline-flex items-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <Trash2 className="h-3 w-3" />
                        Start over
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Modal>
  );
}
