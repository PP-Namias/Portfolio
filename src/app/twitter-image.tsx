import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'radial-gradient(circle at top left, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0) 40%), linear-gradient(160deg, rgb(17,24,39) 0%, rgb(15,23,42) 100%)',
          color: 'white',
          padding: '64px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 30, color: 'rgb(191,219,254)' }}>namias.tech</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.03 }}>
            Jhon Keneth Namias
          </div>
          <div style={{ fontSize: 40, color: 'rgb(219,234,254)' }}>
            Portfolio king of stuff
          </div>
        </div>

        <div style={{ fontSize: 30, color: 'rgb(148,163,184)' }}>
          Full Stack Engineer and AI Automation Specialist
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}