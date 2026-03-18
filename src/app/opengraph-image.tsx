import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
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
            'radial-gradient(circle at top right, rgb(244,114,182) 0%, rgba(244,114,182,0.05) 35%), linear-gradient(135deg, rgb(17,24,39) 0%, rgb(31,41,55) 100%)',
          color: 'white',
          padding: '64px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: 28,
            color: 'rgb(253,242,248)',
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: 'rgb(244,114,182)',
            }}
          />
          namias.tech
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.03 }}>
            Jhon Keneth Namias
          </div>
          <div style={{ fontSize: 40, color: 'rgb(253,242,248)' }}>
            Portfolio king of stuff
          </div>
        </div>

        <div style={{ fontSize: 30, color: 'rgb(209,213,219)' }}>
          Full Stack Engineer and AI Automation Specialist
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}