import {ImageResponse} from 'next/og'

export const runtime = 'edge'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #020617 100%)',
          color: '#f8fafc',
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: '-0.04em',
        }}
      >
        Jhon Keneth Ryan Namias
      </div>
    ),
    size,
  )
}