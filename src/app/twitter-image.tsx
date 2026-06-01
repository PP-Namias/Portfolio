import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: '#111827',
        color: '#ffffff',
        fontSize: 72,
        fontWeight: 700,
      }}
    >
      PP Namias Portfolio
    </div>,
    size
  );
}
