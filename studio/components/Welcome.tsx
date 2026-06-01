import React from 'react'

const QUICK_ACTIONS = [
  {title: 'New project', description: 'Start from a featured or draft template.', type: 'project', tone: '#ff63a5'},
  {title: 'New post', description: 'Spin up a draft post with smart defaults.', type: 'post', tone: '#6366f1'},
  {title: 'New certification', description: 'Add a certification with a 90-day expiry nudge.', type: 'certification', tone: '#22c55e'},
]

export function Welcome() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0a0a0c 0%, #14121a 100%)',
        color: '#f5f5f7',
        padding: '64px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: '#ff63a5',
          marginBottom: 12,
        }}
      >
        Namias CMS
      </div>
      <h1 style={{fontSize: 44, fontWeight: 800, lineHeight: 1.1, maxWidth: 720, margin: 0}}>
        The portfolio is a content surface. <br />
        This is the cockpit.
      </h1>
      <p style={{marginTop: 16, maxWidth: 540, color: 'rgba(245,245,247,0.7)', fontSize: 16, lineHeight: 1.6}}>
        Real-time preview, visual editing on the live site, smart workflows, AI assist,
        and scheduled publishing. Built to show editorial craft.
      </p>

      <div
        style={{
          marginTop: 40,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          width: '100%',
          maxWidth: 880,
        }}
      >
        {QUICK_ACTIONS.map((action) => (
          <a
            key={action.title}
            href={`/studio/intent/create?type=${action.type}`}
            style={{
              padding: 20,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'left',
              color: 'inherit',
              textDecoration: 'none',
              transition: 'transform 120ms ease, background 120ms ease',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: action.tone,
                marginBottom: 8,
              }}
            >
              {action.type}
            </div>
            <div style={{fontSize: 18, fontWeight: 700, marginBottom: 6}}>{action.title}</div>
            <div style={{fontSize: 13, color: 'rgba(245,245,247,0.6)'}}>{action.description}</div>
          </a>
        ))}
      </div>

      <div
        style={{
          marginTop: 40,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          padding: 14,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span style={{fontSize: 12, color: 'rgba(245,245,247,0.7)'}}>Want to see it in action?</span>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem('namias-onboarding-tour', 'requested')
            window.location.href = '/studio/structure/intent/beginDemo'
          }}
          style={{
            padding: '8px 16px',
            borderRadius: 999,
            border: 'none',
            background: 'linear-gradient(90deg, #ff63a5, #6366f1)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Show me the demo →
        </button>
      </div>

      <div style={{marginTop: 64, fontSize: 11, color: 'rgba(245,245,247,0.4)'}}>
        v1.0.0 - code name <code style={{color: '#ff63a5'}}>atlas</code>
      </div>
    </div>
  )
}
