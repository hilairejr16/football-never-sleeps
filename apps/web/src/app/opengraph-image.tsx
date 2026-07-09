import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GoalRush Global — Football Never Sleeps';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #091410 0%, #0f1f16 60%, #091410 100%)',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(34,197,94,0.07) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        {/* Left accent bar */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
          background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
        }} />
        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
          background: 'linear-gradient(90deg, #22c55e, #16a34a, #22c55e)',
        }} />

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo icon */}
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38, marginBottom: 28,
          }}>
            ⚡
          </div>

          {/* Wordmark */}
          <div style={{ fontSize: 82, fontWeight: 900, letterSpacing: '0.14em', color: '#e8f0ff', lineHeight: 1 }}>
            GOALRUSH
          </div>
          <div style={{ fontSize: 22, letterSpacing: '0.55em', color: '#f4a261', fontWeight: 700, marginTop: 8 }}>
            GLOBAL
          </div>

          {/* Divider */}
          <div style={{ width: 72, height: 3, background: '#22c55e', borderRadius: 2, margin: '30px 0' }} />

          {/* Tagline */}
          <div style={{ fontSize: 30, color: '#94a3b8', letterSpacing: '0.06em', fontWeight: 400 }}>
            Football Never Sleeps
          </div>

          {/* Pill tags */}
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            {['Live Scores', 'World Cup 2026', 'Transfers', 'Analysis'].map((label) => (
              <div key={label} style={{
                padding: '10px 22px',
                background: 'rgba(59,130,246,0.14)',
                borderRadius: 8, color: '#86efac', fontSize: 16, fontWeight: 500,
                border: '1px solid rgba(59,130,246,0.3)',
              }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
