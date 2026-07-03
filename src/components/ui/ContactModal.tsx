'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar, Check, Clipboard, Mail, MessageSquare, Send, Trash2 } from 'lucide-react'
import { useModal } from '@/hooks/useModal'
import { useCmsContent } from '@/hooks/useCmsContent'
import { DISCORD_PROFILE_URL } from '@/lib/constants'
import { Modal } from './Modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ContactModalProps {
  open: boolean
  onClose: () => void
}

type ContactFormState = {
  name: string
  email: string
  topic: string
  subject: string
  message: string
}

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL_FORM: ContactFormState = {
  name: '',
  email: '',
  topic: '',
  subject: '',
  message: '',
}

const DRAFT_STORAGE_KEY = 'contact-modal-draft-v1'
const BOOKING_MODAL_EVENT_KEY = 'booking-modal-event'

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
    starter: 'I have a freelance opportunity and would like to know your availability and rates.',
  },
  {
    label: 'Consultation',
    subject: 'Consultation request',
    starter: 'I would like to book a technical consultation regarding this challenge:',
  },
  {
    label: 'Speaking',
    subject: 'Speaking engagement inquiry',
    starter: 'I would like to invite you to speak at our event/workshop. Here are the details:',
  },
] as const

function validateForm(form: ContactFormState): ContactFormErrors {
  const nextErrors: ContactFormErrors = {}
  if (form.name.trim().length < 2) nextErrors.name = 'Please enter your name.'
  if (!EMAIL_REGEX.test(form.email.trim())) nextErrors.email = 'Please enter a valid email address.'
  if (form.subject.trim().length < 3) nextErrors.subject = 'Please enter a short subject.'
  if (form.message.trim().length < 15)
    nextErrors.message = 'Please add a bit more detail (at least 15 characters).'
  return nextErrors
}

export function ContactModal({ open, onClose }: Readonly<ContactModalProps>) {
  const { openModal } = useModal()
  const { profile } = useCmsContent()
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [status, setStatus] = useState<'idle' | 'opening' | 'invalid' | 'copied' | 'copy-failed'>(
    'idle'
  )

  const emailLinks = useMemo(() => {
    const subject = form.subject.trim() || `Inquiry from ${form.name.trim()}`
    const message = [
      `Hi ${profile.name},`,
      '',
      form.message.trim(),
      '',
      '--',
      `${form.name.trim()}`,
      `${form.email.trim()}`,
    ].join('\n')
    const encodedRecipient = encodeURIComponent(profile.email)
    const encodedSubject = encodeURIComponent(subject)
    const encodedMessage = encodeURIComponent(message)
    return {
      subject,
      message,
      mailto: `mailto:${profile.email}?subject=${encodedSubject}&body=${encodedMessage}`,
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedRecipient}&su=${encodedSubject}&body=${encodedMessage}`,
      outlook: `https://outlook.office.com/mail/deeplink/compose?to=${encodedRecipient}&subject=${encodedSubject}&body=${encodedMessage}`,
    }
  }, [form, profile.email, profile.name])

  const messagePreview = useMemo(() => {
    const subject = form.subject.trim() || `Inquiry from ${form.name.trim()}`
    return [
      `To: ${profile.email}`,
      `Subject: ${subject}`,
      '',
      `Hi ${profile.name},`,
      '',
      form.message.trim() || '(your message here)',
      '',
      '--',
      form.name.trim() || '(your name)',
      form.email.trim() || '(your email)',
    ].join('\n')
  }, [form, profile.email, profile.name])

  const messageCharCount = form.message.trim().length

  useEffect(() => {
    if (!open) return
    try {
      const rawDraft = globalThis.localStorage.getItem(DRAFT_STORAGE_KEY)
      if (!rawDraft) return
      const parsed = JSON.parse(rawDraft) as Partial<ContactFormState>
      const nextDraft: ContactFormState = {
        name: typeof parsed.name === 'string' ? parsed.name : '',
        email: typeof parsed.email === 'string' ? parsed.email : '',
        topic: typeof parsed.topic === 'string' ? parsed.topic : '',
        subject: typeof parsed.subject === 'string' ? parsed.subject : '',
        message: typeof parsed.message === 'string' ? parsed.message : '',
      }
      if (
        nextDraft.name ||
        nextDraft.email ||
        nextDraft.topic ||
        nextDraft.subject ||
        nextDraft.message
      ) {
        setForm(nextDraft)
      }
    } catch {
      // Ignore malformed local draft.
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const hasContent =
      form.name.trim() ||
      form.email.trim() ||
      form.topic.trim() ||
      form.subject.trim() ||
      form.message.trim()
    try {
      if (!hasContent) {
        globalThis.localStorage.removeItem(DRAFT_STORAGE_KEY)
        return
      }
      globalThis.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form))
    } catch {
      // Ignore storage write errors.
    }
  }, [form, open])

  const handleChange = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    if (status !== 'idle') setStatus('idle')
  }

  const handleTopicSelect = (preset: (typeof TOPIC_PRESETS)[number]) => {
    setForm((prev) => ({
      ...prev,
      topic: preset.label,
      subject: preset.subject,
      message: prev.message.trim().length > 0 ? prev.message : `${preset.starter}\n\n`,
    }))
  }

  const handleCopyDraft = async () => {
    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setStatus('invalid')
      return
    }
    try {
      await globalThis.navigator.clipboard.writeText(
        `To: ${profile.email}\nSubject: ${emailLinks.subject}\n\n${emailLinks.message}`
      )
      setStatus('copied')
    } catch {
      setStatus('copy-failed')
    }
  }

  const handleSubmit = () => {
    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setStatus('invalid')
      return
    }
    setStatus('opening')
    const popup = globalThis.open(emailLinks.mailto, '_blank', 'noopener,noreferrer')
    if (!popup) globalThis.location.href = emailLinks.mailto
  }

  const handleClearDraft = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    setStatus('idle')
    try {
      globalThis.localStorage.removeItem(DRAFT_STORAGE_KEY)
    } catch {
      /* Ignore. */
    }
  }

  const handleBookCall = () => {
    try {
      globalThis.sessionStorage.setItem(BOOKING_MODAL_EVENT_KEY, 'introductory-call')
    } catch {
      /* Ignore. */
    }
    openModal('booking')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      fullScreen
      showCloseButton={false}
      descriptionId="contact-modal-description"
    >
      <div className="flex flex-col bg-surface-light dark:bg-surface-dark transition-colors duration-300">
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

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-light dark:border-border-dark flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
              Send me a message
            </h2>
            <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
              Write to me directly. Pick a topic or freestyle.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-11 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-lg"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Form content */}
        <div id="contact-modal-description">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="max-w-lg mx-auto space-y-5">
              {/* Topic cards */}
              <div>
                <p className="mb-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  What&apos;s this about?
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {TOPIC_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleTopicSelect(preset)}
                      className={`group flex items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition-[border-color,background-color,box-shadow] duration-200 ${
                        form.topic === preset.label
                          ? 'border-accent-pink bg-accent-pink/5 shadow-sm'
                          : 'border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark hover:border-accent-pink/40 hover:shadow-sm'
                      }`}
                    >
                      <span
                        className={`text-sm font-medium leading-tight ${form.topic === preset.label ? 'text-accent-pink' : 'text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink'}`}
                      >
                        {preset.label}
                      </span>
                      {form.topic === preset.label ? (
                        <Check className="h-4 w-4 text-accent-pink ml-auto shrink-0" />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Email row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="contact-modal-name" className="mb-1.5">
                    Name
                  </Label>
                  <Input
                    id="contact-modal-name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'contact-modal-name-error' : undefined}
                  />
                  {errors.name ? (
                    <p id="contact-modal-name-error" className="mt-1.5 text-xs text-red-500">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="contact-modal-email" className="mb-1.5">
                    Email
                  </Label>
                  <Input
                    id="contact-modal-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'contact-modal-email-error' : undefined}
                  />
                  {errors.email ? (
                    <p id="contact-modal-email-error" className="mt-1.5 text-xs text-red-500">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Subject */}
              <div>
                <Label htmlFor="contact-modal-subject" className="mb-1.5">
                  Subject
                </Label>
                <Input
                  id="contact-modal-subject"
                  name="subject"
                  value={form.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  placeholder="What's the topic?"
                  aria-invalid={errors.subject ? 'true' : 'false'}
                  aria-describedby={errors.subject ? 'contact-modal-subject-error' : undefined}
                />
                {errors.subject ? (
                  <p id="contact-modal-subject-error" className="mt-1.5 text-xs text-red-500">
                    {errors.subject}
                  </p>
                ) : null}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-modal-message"
                  className="mb-1.5 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
                >
                  Message
                </label>
                <textarea
                  id="contact-modal-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-accent-pink transition-colors resize-none"
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'contact-modal-message-error' : undefined}
                />
                <div className="flex items-center justify-between mt-1.5">
                  {errors.message ? (
                    <p id="contact-modal-message-error" className="text-xs text-red-500">
                      {errors.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span
                    className={`text-[11px] ${messageCharCount >= 15 ? 'text-emerald-500' : 'text-text-muted-light dark:text-text-muted-dark'}`}
                  >
                    {messageCharCount} / 15 min
                  </span>
                </div>
              </div>

              {/* Email preview */}
              <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-hidden">
                <div className="px-4 py-2 border-b border-border-light dark:border-border-dark flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-text-muted-light dark:text-text-muted-dark" />
                  <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                    Email preview
                  </span>
                </div>
                <pre className="px-4 py-3 text-xs text-text-secondary-light dark:text-text-secondary-dark whitespace-pre-wrap font-sans leading-relaxed max-h-36 overflow-y-auto">
                  {messagePreview}
                </pre>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent-pink px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-pink-hover dark:hover:bg-accent-pink-hover-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent-pink focus:ring-offset-2 dark:focus:ring-offset-background-dark"
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
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-light dark:border-border-dark px-3 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 hover:border-red-400 dark:hover:text-red-400 dark:hover:border-red-400 transition-colors"
                    aria-label="Clear draft"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={emailLinks.gmail}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-light dark:border-border-dark px-3 py-1.5 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink transition-colors"
                  >
                    Open Gmail
                  </a>
                  <a
                    href={emailLinks.outlook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-light dark:border-border-dark px-3 py-1.5 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink transition-colors"
                  >
                    Open Outlook
                  </a>
                </div>
              </div>

              {/* Status */}
              {status !== 'idle' ? (
                <div
                  aria-live="polite"
                  className="rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-xs sm:text-sm"
                >
                  {status === 'opening' && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Mail className="h-3.5 w-3.5" /> Email draft opened.
                    </span>
                  )}
                  {status === 'copied' && (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Draft copied to clipboard.
                    </span>
                  )}
                  {status === 'copy-failed' && (
                    <span className="text-amber-600 dark:text-amber-400">
                      Couldn&apos;t copy. Use the Gmail/Outlook buttons above.
                    </span>
                  )}
                  {status === 'invalid' && (
                    <span className="text-red-500">
                      Please fix the highlighted fields before continuing.
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
