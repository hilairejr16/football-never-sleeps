import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180, height: 180,
          borderRadius: 36,
          background: 'linear-gradient(135deg, #091410 0%, #0f1f16 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Gold accent ring */}
        <div
          style={{
            width: 120, height: 120,
            borderRadius: '50%',
            border: '3px solid #f4a261',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 900, color: '#f4a261', lineHeight: 1, letterSpacing: '-1px' }}>
            GRG
          </div>
          <div style={{ fontSize: 9, color: '#22c55e', letterSpacing: '2px', fontWeight: 700, marginTop: 2 }}>
            GLOBAL
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
