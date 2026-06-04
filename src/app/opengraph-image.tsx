/* eslint-disable react-doctor/only-export-components */
// Next.js App Router metadata file conventions: the runtime,
// size, and contentType named exports are required alongside
// the default image-generating component. They are not
// co-located logic — they are Next.js file-level metadata.
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: '#0f172a',
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
