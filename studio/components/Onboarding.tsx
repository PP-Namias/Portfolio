import React, {useEffect, useState} from 'react'

const STEPS = [
  {
    title: 'Edit a field',
    body: 'Open "Hero Section" from the sidebar. Change the headline. Save. The marketing site will reflect this within a second.',
    target: '/studio/structure/singleton%3AheroSection;heroSection',
  },
  {
    title: 'See it live',
    body: 'Click "Open preview" to open the live marketing site with draft mode enabled. The change you just made is visible without a refresh.',
    target: '/studio/presentation',
  },
  {
    title: 'Publish and revalidate',
    body: 'Back in the studio, click "Publish & revalidate" on Hero Section. Confirm the modal. The site revalidates and the live URL updates.',
    target: '/studio/structure/singleton%3AheroSection;heroSection',
  },
  {
    title: 'Schedule a post',
    body: 'Create a new post from the Blog list. Set publishAt to 5 minutes from now. Save. The Sanity Function will publish it on time.',
    target: '/studio/structure/post',
  },
]

const STORAGE_KEY = 'namias-onboarding-tour-completed'

export function OnboardingTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const requested = window.localStorage.getItem('namias-onboarding-tour') === 'requested'
    const completed = window.localStorage.getItem(STORAGE_KEY) === 'true'
    if (requested && !completed) {
      setOpen(true)
      window.localStorage.removeItem('namias-onboarding-tour')
    }
  }, [])

  if (!open) return null

  const current = STEPS[step]!

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
          maxWidth: 520,
          background: '#0e0e10',
          color: '#fff',
          borderRadius: 16,
          padding: 28,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
          <div style={{fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#ff63a5'}}>
            Tour · step {step + 1} of {STEPS.length}
          </div>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, 'true')
              setOpen(false)
            }}
            style={{background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer'}}
          >
            Skip
          </button>
        </div>
        <h2 style={{fontSize: 22, fontWeight: 700, margin: 0}}>{current.title}</h2>
        <p style={{marginTop: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, fontSize: 14}}>{current.body}</p>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24}}>
          <div style={{display: 'flex', gap: 6}}>
            {STEPS.map((_, i) => (
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
                onClick={() => setStep((s) => s - 1)}
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
                if (step === STEPS.length - 1) {
                  window.localStorage.setItem(STORAGE_KEY, 'true')
                  setOpen(false)
                } else {
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
              {step === STEPS.length - 1 ? 'Done' : 'Open'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
