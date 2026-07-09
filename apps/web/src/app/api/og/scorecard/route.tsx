import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const home      = searchParams.get('home')      || 'Home';
  const away      = searchParams.get('away')      || 'Away';
  const homeScore = searchParams.get('homeScore') ?? null;
  const awayScore = searchParams.get('awayScore') ?? null;
  const league    = searchParams.get('league')    || 'GoalRush Global';
  const status    = searchParams.get('status')    || 'SCHEDULED';

  const hasScore  = homeScore !== null && homeScore !== '' && awayScore !== null && awayScore !== '';
  const isLive    = status === 'LIVE' || status === 'HT';
  const isFinal   = ['FT', 'AET', 'PEN'].includes(status);
  const isPreview = status === 'SCHEDULED' || !hasScore;

  const statusLabel = status === 'HT' ? 'HALF TIME'
    : status === 'LIVE' ? 'LIVE'
    : status === 'FT'   ? 'FULL TIME'
    : status === 'AET'  ? 'AFTER EXTRA TIME'
    : status === 'PEN'  ? 'PENALTIES'
    : 'KICK-OFF';

  const statusColor = isLive ? '#ef4444' : isFinal ? '#22c55e' : '#f4a261';
  const statusBg    = isLive ? 'rgba(239,68,68,0.15)' : isFinal ? 'rgba(34,197,94,0.15)' : 'rgba(244,162,97,0.15)';

  function initials(name: string) {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return name.slice(0, 3).toUpperCase();
    return words.map(w => w[0]).join('').slice(0, 3).toUpperCase();
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080, height: 1080,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(160deg, #091410 0%, #0f1f16 50%, #091410 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(34,197,94,0.06) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }} />

        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 5,
          background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)',
        }} />

        {/* Vertical side bars */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'rgba(34,197,94,0.3)' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 4, background: 'rgba(34,197,94,0.3)' }} />

        {/* ─── Header ─── */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 52, gap: 16, width: '100%',
        }}>
          {/* Brand logo */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>⚡</div>
            <span style={{
              fontSize: 22, fontWeight: 800, letterSpacing: '0.22em',
              color: '#e8f0ff',
            }}>GOALRUSH GLOBAL</span>
          </div>

          {/* League */}
          <div style={{
            fontSize: 18, color: '#86efac', letterSpacing: '0.1em',
            fontWeight: 600, textTransform: 'uppercase',
          }}>
            {league}
          </div>
        </div>

        {/* ─── Score card ─── */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 0, flex: 1, justifyContent: 'center', width: '100%',
          paddingBottom: 20,
        }}>
          {/* Status badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 28px',
            background: statusBg,
            border: `1.5px solid ${statusColor}`,
            borderRadius: 50,
            marginBottom: 44,
          }}>
            {isLive && (
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: '#ef4444',
              }} />
            )}
            <span style={{
              fontSize: 20, fontWeight: 800, color: statusColor,
              letterSpacing: '0.14em',
            }}>
              {statusLabel}
            </span>
          </div>

          {/* Teams + score row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', gap: 0,
          }}>
            {/* Home team */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 20, flex: 1, paddingLeft: 60,
            }}>
              {/* Team circle */}
              <div style={{
                width: 130, height: 130, borderRadius: '50%',
                background: 'linear-gradient(135deg, #142a1c 0%, #1a3322 100%)',
                border: '2px solid rgba(34,197,94,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 42, fontWeight: 900, color: '#86efac',
                letterSpacing: '0.04em',
              }}>
                {initials(home)}
              </div>
              <span style={{
                fontSize: 38, fontWeight: 800, color: '#ffffff',
                textAlign: 'center', maxWidth: 260,
                lineHeight: 1.15,
              }}>
                {home}
              </span>
            </div>

            {/* Score */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 12, minWidth: 240,
            }}>
              {hasScore ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <span style={{
                    fontSize: 120, fontWeight: 900, color: '#ffffff',
                    lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                  }}>
                    {homeScore}
                  </span>
                  <span style={{
                    fontSize: 64, color: 'rgba(134,239,172,0.4)',
                    fontWeight: 300, alignSelf: 'center',
                  }}>
                    –
                  </span>
                  <span style={{
                    fontSize: 120, fontWeight: 900, color: '#ffffff',
                    lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                  }}>
                    {awayScore}
                  </span>
                </div>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(244,162,97,0.3)',
                    border: '2px solid #f4a261',
                  }} />
                  <span style={{
                    fontSize: 52, color: '#f4a261', fontWeight: 700,
                    letterSpacing: '0.06em',
                  }}>VS</span>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(244,162,97,0.3)',
                    border: '2px solid #f4a261',
                  }} />
                </div>
              )}
            </div>

            {/* Away team */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 20, flex: 1, paddingRight: 60,
            }}>
              <div style={{
                width: 130, height: 130, borderRadius: '50%',
                background: 'linear-gradient(135deg, #142a1c 0%, #1a3322 100%)',
                border: '2px solid rgba(34,197,94,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 42, fontWeight: 900, color: '#86efac',
                letterSpacing: '0.04em',
              }}>
                {initials(away)}
              </div>
              <span style={{
                fontSize: 38, fontWeight: 800, color: '#ffffff',
                textAlign: 'center', maxWidth: 260,
                lineHeight: 1.15,
              }}>
                {away}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', paddingBottom: 48,
          borderTop: '1px solid rgba(34,197,94,0.12)',
          paddingTop: 28, gap: 24,
        }}>
          <span style={{ fontSize: 20, color: 'rgba(148,163,184,0.7)', letterSpacing: '0.08em' }}>
            goalrushglobal.com
          </span>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(34,197,94,0.5)' }} />
          <span style={{ fontSize: 20, color: '#86efac', letterSpacing: '0.06em', fontWeight: 600 }}>
            ⚽ Football Never Sleeps
          </span>
        </div>

        {/* Bottom accent */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
          background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)',
        }} />
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    }
  );
}
