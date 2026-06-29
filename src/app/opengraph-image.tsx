/* eslint-disable react-doctor/only-export-components */
// Next.js App Router metadata file conventions: the runtime,
// size, and contentType named exports are required alongside
// the default image-generating component. They are not
// co-located logic — they are Next.js file-level metadata.
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.woff2',
    );
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('font') && !contentType.includes('woff')) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const font = await loadFont();

  const imageConfig: Record<string, unknown> = {
    ...size,
  };

  if (font) {
    imageConfig.fonts = [
      {
        name: 'Inter',
        data: font,
        style: 'normal',
        weight: 400,
      },
    ];
  }

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0b0d12 0%, #1e1b2e 50%, #2a1a35 100%)',
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: 'linear-gradient(90deg, #ff63a5, #a78bfa, #06b6d4)',
        }}
      />

      {/* Glow effects */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -60,
          width: 400,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,99,165,0.3) 0%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: -40,
          width: 380,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 80px',
          position: 'relative',
          flex: 1,
        }}
      >
        {/* Badge + tagline row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          {/* JN Badge */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 14,
              background: '#ff63a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
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

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: -2,
            marginBottom: 12,
          }}
        >
          Jhon Keneth
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            marginBottom: 20,
          }}
        >
          <span style={{ color: '#ff63a5' }}>Ryan</span>{' '}
          <span style={{ color: '#ffffff' }}>Namias</span>
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: '#a78bfa',
            marginBottom: 24,
          }}
        >
          Full Stack Engineer &amp; AI Automation Specialist
        </div>

        {/* Divider */}
        <div
          style={{
            width: 140,
            height: 3,
            background: '#ff63a5',
            marginBottom: 28,
          }}
        />

        {/* Tech tags */}
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Next.js', color: '#ff63a5' },
            { label: 'TypeScript', color: '#a78bfa' },
            { label: 'Sanity', color: '#06b6d4' },
            { label: 'Cloudflare', color: '#22c55e' },
          ].map((tag) => (
            <div
              key={tag.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 20px',
                borderRadius: 20,
                border: `1px solid ${tag.color}`,
                background: `${tag.color}15`,
                fontSize: 16,
                fontWeight: 500,
                color: tag.color,
              }}
            >
              {tag.label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 80px 40px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#22c55e',
            }}
          />
          <span style={{ fontSize: 15, color: '#94a3b8' }}>
            Available for new work
          </span>
        </div>
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#06b6d4',
            letterSpacing: 1,
          }}
        >
          namias.tech
        </span>
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: 'linear-gradient(90deg, #ff63a5, #a78bfa, #06b6d4)',
        }}
      />
    </div>,
    imageConfig,
  );
}
