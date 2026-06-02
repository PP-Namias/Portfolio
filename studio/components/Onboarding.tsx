import React, {useEffect, useState} from 'react'

const TASKS = [
  {
    id: 'edit-hero',
    title: 'Edit your hero',
    body: 'Open Pages > Homepage > Hero Section. Change the headline or your name. Save. Your change is visible on the live site within a second.',
    target: '/studio/structure/singleton%3AheroSection;heroSection',
    cta: 'Open hero',
  },
  {
    id: 'add-project',
    title: 'Add a project',
    body: 'Open Pages > Homepage > Projects. Click + to create a new project. Use the "Featured" template and fill title + summary.',
    target: '/studio/structure/project',
    cta: 'Open projects',
  },
  {
    id: 'add-cert',
    title: 'Add a certification',
    body: 'Open Pages > Homepage > Certifications. Click +. Fill title, issuer, and issue date. The expiry badge will track the renewal date automatically.',
    target: '/studio/structure/certification',
    cta: 'Open certifications',
  },
  {
    id: 'publish-something',
    title: 'Publish something',
    body: 'Open a document. Edit a field. Click "Publish & revalidate". Confirm the modal. The marketing site revalidates the affected route within a second.',
    target: '/studio/structure/singleton%3AheroSection;heroSection',
    cta: 'Open editor',
  },
]

const STORAGE_KEY = 'namias-onboarding-tour-completed'
const REQUEST_KEY = 'namias-onboarding-tour'

function getStep(): number {
  if (typeof window === 'undefined') return 0
  const raw = window.localStorage.getItem(REQUEST_KEY + '-step')
  if (!raw) return 0
  const n = Number(raw)
  return Number.isFinite(n) ? Math.max(0, Math.min(TASKS.length - 1, n)) : 0
}

function persistStep(n: number) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(REQUEST_KEY + '-step', String(n))
}

export function OnboardingTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const requested = window.localStorage.getItem(REQUEST_KEY) === 'requested'
    const completed = window.localStorage.getItem(STORAGE_KEY) === 'true'
    if (requested && !completed) {
      setOpen(true)
      setStep(getStep())
      window.localStorage.removeItem(REQUEST_KEY)
    }
  }, [])

  if (!open) return null

  const current = TASKS[step]!
  const isLast = step === TASKS.length - 1

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 540,
          background: '#0e0e10',
          color: '#fff',
          borderRadius: 16,
          padding: 28,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: '#ff63a5',
            }}
          >
            Onboarding · task {step + 1} of {TASKS.length}
          </div>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, 'true')
              setOpen(false)
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Skip tour
          </button>
        </div>
        <h2 style={{fontSize: 22, fontWeight: 700, margin: 0}}>{current.title}</h2>
        <p
          style={{
            marginTop: 12,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          {current.body}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <div style={{display: 'flex', gap: 6}}>
            {TASKS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: i === step ? '#ff63a5' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
          <div style={{display: 'flex', gap: 8}}>
            {step > 0 ? (
              <button
                type="button"
              onClick={() => {
                const next = step - 1
                setStep(next)
                persistStep(next)
              }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (isLast) {
                  window.localStorage.setItem(STORAGE_KEY, 'true')
                  setOpen(false)
                } else {
                  const next = step + 1
                  setStep(next)
                  persistStep(next)
                  window.location.href = current.target
                }
              }}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(90deg, #ff63a5, #6366f1)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isLast ? 'Done' : current.cta + ' →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
