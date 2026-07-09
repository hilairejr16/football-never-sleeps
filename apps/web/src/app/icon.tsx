import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32, height: 32,
          borderRadius: '50%',
          background: '#091410',
          border: '2px solid #f4a261',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 900,
          color: '#f4a261',
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: '-0.5px',
        }}
      >
        G
      </div>
    ),
    { ...size },
  );
}
