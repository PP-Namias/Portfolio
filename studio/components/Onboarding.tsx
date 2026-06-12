import React, {useEffect, useState} from 'react'

const TASKS = [
  {
    id: 'edit-profile',
    title: 'Edit your profile',
    body: 'Open Homepage > Hero & Profile. Change the headline, your name, or role rotator. Save. Your change is visible on the live site within a second.',
    target: '/studio/structure/singleton%3Aprofile;profile',
    cta: 'Open profile',
  },
  {
    id: 'write-about',
    title: 'Write about yourself',
    body: 'Open Homepage > About Section. Write your bio in Portable Text. Add education details and honors. Your change appears on the homepage About section.',
    target: '/studio/structure/singleton%3AaboutSection;aboutSectionSingleton',
    cta: 'Open about',
  },
  {
    id: 'add-project',
    title: 'Add a project',
    body: 'Open Collections > Projects. Click + to create a new project. Use the "Featured" template and fill title + summary.',
    target: '/studio/structure/project',
    cta: 'Open projects',
  },
  {
    id: 'add-cert',
    title: 'Add a certification',
    body: 'Open Collections > Certifications. Click +. Fill title, issuer, and issue date. The expiry badge will track the renewal date automatically.',
    target: '/studio/structure/certification',
    cta: 'Open certifications',
  },
  {
    id: 'publish-something',
    title: 'Publish something',
    body: 'Open a document. Edit a field. Click "Publish & revalidate". Confirm the modal. The marketing site revalidates the affected route within a second.',
    target: '/studio/structure/singleton%3Aprofile;profile',
    cta: 'Open editor',
  },
]

const STORAGE_KEY = 'namias-onboarding-tour-completed'
const REQUEST_KEY = 'namias-onboarding-tour'
const PROGRESS_KEY = 'namias-onboarding-progress'

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

function getCompletedTasks(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  const raw = window.localStorage.getItem(PROGRESS_KEY)
  if (!raw) return new Set()
  try {
    return new Set(JSON.parse(raw))
  } catch {
    return new Set()
  }
}

function persistCompletedTasks(tasks: Set<string>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify([...tasks]))
}

export function OnboardingTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const requested = window.localStorage.getItem(REQUEST_KEY) === 'requested'
    const completed = window.localStorage.getItem(STORAGE_KEY) === 'true'
    if (requested && !completed) {
      setOpen(true)
      setStep(getStep())
      setCompletedTasks(getCompletedTasks())
      window.localStorage.removeItem(REQUEST_KEY)
    }
  }, [])

  const markCompleted = (taskId: string) => {
    const next = new Set(completedTasks)
    next.add(taskId)
    setCompletedTasks(next)
    persistCompletedTasks(next)
  }

  if (!open) return null

  const current = TASKS[step]!
  const isLast = step === TASKS.length - 1
  const progress = (completedTasks.size / TASKS.length) * 100

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

        {/* Progress bar */}
        <div
          style={{
            height: 4,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
            marginBottom: 20,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #ff63a5, #6366f1)',
              borderRadius: 2,
              transition: 'width 300ms ease',
            }}
          />
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

        {/* Task completion checkbox */}
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={() => markCompleted(current.id)}
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              border: `2px solid ${completedTasks.has(current.id) ? '#ff63a5' : 'rgba(255,255,255,0.3)'}`,
              background: completedTasks.has(current.id) ? '#ff63a5' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {completedTasks.has(current.id) && (
              <span style={{color: '#fff', fontSize: 12, fontWeight: 700}}>✓</span>
            )}
          </button>
          <span style={{fontSize: 12, color: 'rgba(255,255,255,0.6)'}}>
            {completedTasks.has(current.id) ? 'Completed' : 'Mark as completed'}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <div style={{display: 'flex', gap: 6}}>
            {TASKS.map((task, i) => (
              <span
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: i === step
                    ? '#ff63a5'
                    : completedTasks.has(task.id)
                    ? '#30bf78'
                    : 'rgba(255,255,255,0.2)',
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

        {/* Progress summary */}
        <div
          style={{
            marginTop: 16,
            textAlign: 'center',
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {completedTasks.size} of {TASKS.length} tasks completed ({Math.round(progress)}%)
        </div>
      </div>
    </div>
  )
}
