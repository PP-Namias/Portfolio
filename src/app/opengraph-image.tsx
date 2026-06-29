/* eslint-disable react-doctor/only-export-components */
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#0b0d12',
      }}
    >
      <div
        style={{
          display: 'flex',
          height: 6,
          width: '100%',
          background: 'linear-gradient(90deg, #ff63a5, #a78bfa, #06b6d4)',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 80px',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: '#ff63a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            JN
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: '#06b6d4',
              letterSpacing: 3,
            }}
          >
            PORTFOLIO — 2026
          </div>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          Jhon Keneth
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 72, fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
          <span style={{ color: '#ff63a5' }}>Ryan</span>
          <span style={{ color: '#ffffff' }}>Namias</span>
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: '#a78bfa',
            marginBottom: 20,
          }}
        >
          Full Stack Engineer &amp; AI Automation Specialist
        </div>
        <div style={{ width: 140, height: 3, backgroundColor: '#ff63a5', marginBottom: 24 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          {['Next.js', 'TypeScript', 'Sanity', 'Cloudflare'].map((label) => (
            <div
              key={label}
              style={{
                display: 'flex',
                padding: '8px 20px',
                borderRadius: 20,
                border: '1px solid #a78bfa',
                fontSize: 16,
                fontWeight: 500,
                color: '#a78bfa',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 80px 40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#22c55e' }} />
          <span style={{ fontSize: 15, color: '#94a3b8' }}>Available for new work</span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 600, color: '#06b6d4', letterSpacing: 1 }}>namias.tech</span>
      </div>
      <div
        style={{
          display: 'flex',
          height: 6,
          width: '100%',
          background: 'linear-gradient(90deg, #ff63a5, #a78bfa, #06b6d4)',
        }}
      />
    </div>,
    size,
  );
}
