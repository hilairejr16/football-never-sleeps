import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Trophy, Clock } from 'lucide-react';

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

// ── WC 2026 fallback data ──────────────────────────────────

const WC_LEAGUE = { id: 1, name: 'FIFA World Cup 2026', country: 'World', round: 'Round of 16' };

interface MatchData {
  id: number;
  home: string;
  homeFlag: string;
  away: string;
  awayFlag: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  statusLabel: string;
  date: string;
  time: string;
  venue: string;
  league: typeof WC_LEAGUE;
  note?: string;
}

const KNOWN_MATCHES: Record<string, MatchData> = {
  // R16 Results
  '101': { id: 101, home: 'Morocco',     homeFlag: '🇲🇦', away: 'Canada',    awayFlag: '🇨🇦', homeScore: 3, awayScore: 0, status: 'FT',  statusLabel: 'Full Time',        date: 'Sat 4 Jul 2026', time: '19:00 UTC', venue: 'AT&T Stadium, Dallas',            league: { ...WC_LEAGUE, round: 'Round of 16' } },
  '102': { id: 102, home: 'France',      homeFlag: '🇫🇷', away: 'Paraguay',  awayFlag: '🇵🇾', homeScore: 1, awayScore: 0, status: 'FT',  statusLabel: 'Full Time',        date: 'Sat 4 Jul 2026', time: '23:00 UTC', venue: 'MetLife Stadium, New Jersey',     league: { ...WC_LEAGUE, round: 'Round of 16' } },
  '103': { id: 103, home: 'Norway',      homeFlag: '🇳🇴', away: 'Brazil',    awayFlag: '🇧🇷', homeScore: 2, awayScore: 0, status: 'FT',  statusLabel: 'Full Time',        date: 'Sun 5 Jul 2026', time: '19:00 UTC', venue: 'Rose Bowl, CA',                   league: { ...WC_LEAGUE, round: 'Round of 16' } },
  '104': { id: 104, home: 'England',     homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', away: 'Mexico',    awayFlag: '🇲🇽', homeScore: 3, awayScore: 2, status: 'FT',  statusLabel: 'Full Time',        date: 'Sun 5 Jul 2026', time: '23:00 UTC', venue: 'AT&T Stadium, Dallas',            league: { ...WC_LEAGUE, round: 'Round of 16' } },
  '105': { id: 105, home: 'Spain',       homeFlag: '🇪🇸', away: 'Portugal',  awayFlag: '🇵🇹', homeScore: 1, awayScore: 0, status: 'FT',  statusLabel: 'Full Time',        date: 'Mon 6 Jul 2026', time: '19:00 UTC', venue: 'SoFi Stadium, Inglewood',         league: { ...WC_LEAGUE, round: 'Round of 16' } },
  '106': { id: 106, home: 'Belgium',     homeFlag: '🇧🇪', away: 'USA',       awayFlag: '🇺🇸', homeScore: 4, awayScore: 1, status: 'FT',  statusLabel: 'Full Time',        date: 'Mon 6 Jul 2026', time: '23:00 UTC', venue: "Levi's Stadium, San Francisco",   league: { ...WC_LEAGUE, round: 'Round of 16' } },
  '107': { id: 107, home: 'Argentina',   homeFlag: '🇦🇷', away: 'Egypt',     awayFlag: '🇪🇬', homeScore: 3, awayScore: 2, status: 'FT',  statusLabel: 'Full Time',        date: 'Tue 7 Jul 2026', time: '19:00 UTC', venue: 'Hard Rock Stadium, Miami',        league: { ...WC_LEAGUE, round: 'Round of 16' } },
  '108': { id: 108, home: 'Switzerland', homeFlag: '🇨🇭', away: 'Colombia',  awayFlag: '🇨🇴', homeScore: 0, awayScore: 0, status: 'PEN', statusLabel: 'Pen. Shoot-out',   date: 'Tue 7 Jul 2026', time: '23:00 UTC', venue: 'Arrowhead Stadium, Kansas City',  league: { ...WC_LEAGUE, round: 'Round of 16' } },
  // Quarter-Finals (upcoming)
  '201': { id: 201, home: 'France',      homeFlag: '🇫🇷', away: 'Morocco',     awayFlag: '🇲🇦', homeScore: null, awayScore: null, status: 'SCHEDULED', statusLabel: 'Kick-off 4 PM ET',  date: 'Wed 9 Jul 2026',  time: '20:00 UTC', venue: 'Gillette Stadium, Boston',       league: { ...WC_LEAGUE, round: 'Quarter-Final' } },
  '202': { id: 202, home: 'Spain',       homeFlag: '🇪🇸', away: 'Belgium',     awayFlag: '🇧🇪', homeScore: null, awayScore: null, status: 'SCHEDULED', statusLabel: 'Kick-off 3 PM ET',  date: 'Thu 10 Jul 2026', time: '19:00 UTC', venue: 'SoFi Stadium, Inglewood CA',     league: { ...WC_LEAGUE, round: 'Quarter-Final' } },
  '203': { id: 203, home: 'Norway',      homeFlag: '🇳🇴', away: 'England',     awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', homeScore: null, awayScore: null, status: 'SCHEDULED', statusLabel: 'Kick-off 5 PM ET',  date: 'Fri 11 Jul 2026', time: '21:00 UTC', venue: 'Hard Rock Stadium, Miami',       league: { ...WC_LEAGUE, round: 'Quarter-Final' } },
  '204': { id: 204, home: 'Argentina',   homeFlag: '🇦🇷', away: 'Switzerland', awayFlag: '🇨🇭', homeScore: null, awayScore: null, status: 'SCHEDULED', statusLabel: 'Kick-off 9 PM ET',  date: 'Fri 11 Jul 2026', time: '01:00 UTC', venue: 'Arrowhead Stadium, Kansas City',  league: { ...WC_LEAGUE, round: 'Quarter-Final' } },
};

// ── Data fetching ──────────────────────────────────────────

async function getMatch(id: string): Promise<MatchData | null> {
  // Try live API first
  try {
    const res = await fetch(`${BASE}/matches/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const { data } = await res.json();
      if (data) return data;
    }
  } catch { /* fall through */ }

  // Fall back to known WC matches
  return KNOWN_MATCHES[id] ?? null;
}

// ── Metadata ───────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatch(id);
  if (!match) {
    return { title: 'Match Not Found' };
  }
  const score = match.homeScore !== null ? `${match.homeScore}–${match.awayScore}` : 'vs';
  const title = `${match.home} ${score} ${match.away} — ${match.league.round}`;
  return {
    title,
    description: `${match.league.name} ${match.league.round}: ${match.home} ${score} ${match.away}. ${match.venue}. ${match.date}.`,
    alternates: { canonical: `/match/${id}` },
  };
}

// ── Status helpers ─────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isLive = status === 'LIVE' || status === 'HT';
  const isFinal = ['FT', 'AET', 'PEN'].includes(status);
  const cls = isLive
    ? 'bg-red-500/15 border-red-500/40 text-red-400'
    : isFinal
    ? 'bg-brand-red/15 border-brand-red/40 text-brand-green'
    : 'bg-brand-gold/15 border-brand-gold/40 text-brand-gold';

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold tracking-wide ${cls}`}>
      {isLive && <span className="w-2 h-2 rounded-full bg-red-500 animate-live-dot" />}
      {status}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatch(id);

  if (!match) return notFound();

  const hasScore = match.homeScore !== null && match.awayScore !== null;
  const homeWon = hasScore && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWon = hasScore && (match.awayScore ?? 0) > (match.homeScore ?? 0);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-brand-gray text-sm mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/live-scores" className="hover:text-white transition-colors">Scores</Link>
        <span>/</span>
        <span className="text-white">{match.home} vs {match.away}</span>
      </div>

      {/* Main match card */}
      <div className="gr-card overflow-visible">
        {/* League header */}
        <div className="bg-brand-dark px-6 py-3 flex items-center justify-between border-b border-brand-border">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-gold text-sm font-semibold">{match.league.name}</span>
            <span className="text-brand-border">·</span>
            <span className="text-brand-gray text-sm">{match.league.round}</span>
          </div>
          <StatusBadge status={match.status} />
        </div>

        {/* Score section */}
        <div className="px-6 py-10">
          <div className="flex items-center justify-center gap-4 sm:gap-8">

            {/* Home team */}
            <div className="flex-1 flex flex-col items-center gap-3 min-w-0">
              <div className="text-5xl sm:text-6xl leading-none">{match.homeFlag}</div>
              <h2 className={`text-lg sm:text-xl font-bold text-center leading-tight ${homeWon ? 'text-white' : 'text-brand-gray'}`}>
                {match.home}
              </h2>
              {homeWon && (
                <span className="text-xs bg-brand-red/15 text-brand-green border border-brand-red/30 px-2 py-0.5 rounded font-semibold">
                  WINNER
                </span>
              )}
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-2 px-2 sm:px-6">
              {hasScore ? (
                <div className="font-display text-5xl sm:text-7xl tracking-wider text-white tabular-nums leading-none">
                  {match.homeScore} <span className="text-brand-border">–</span> {match.awayScore}
                </div>
              ) : (
                <div className="font-display text-3xl sm:text-4xl text-brand-gold tracking-widest">
                  VS
                </div>
              )}
              <div className="text-brand-gray text-xs font-medium">{match.statusLabel}</div>
              {match.note && (
                <div className="text-brand-gold text-xs font-semibold">{match.note}</div>
              )}
            </div>

            {/* Away team */}
            <div className="flex-1 flex flex-col items-center gap-3 min-w-0">
              <div className="text-5xl sm:text-6xl leading-none">{match.awayFlag}</div>
              <h2 className={`text-lg sm:text-xl font-bold text-center leading-tight ${awayWon ? 'text-white' : 'text-brand-gray'}`}>
                {match.away}
              </h2>
              {awayWon && (
                <span className="text-xs bg-brand-red/15 text-brand-green border border-brand-red/30 px-2 py-0.5 rounded font-semibold">
                  WINNER
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Match info strip */}
        <div className="border-t border-brand-border px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-brand-gold flex-shrink-0" />
            <div>
              <div className="text-white font-medium">{match.date}</div>
              <div className="text-brand-gray text-xs">{match.time}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0" />
            <div className="text-white font-medium leading-tight">{match.venue}</div>
          </div>
        </div>
      </div>

      {/* Related QF matches (if viewing a R16 result) */}
      {match.league.round === 'Round of 16' && (
        <div className="mt-10">
          <h3 className="text-white font-display text-xl tracking-wider mb-4">⚡ QUARTER-FINALS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['201', '202', '203', '204'].map(qfId => {
              const qf = KNOWN_MATCHES[qfId];
              if (!qf) return null;
              return (
                <Link key={qfId} href={`/match/${qfId}`} className="gr-card-sm p-4 block hover:border-brand-red/40 transition-all">
                  <div className="text-brand-gold text-xs font-semibold mb-2">{qf.league.round} · {qf.date}</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white font-semibold">{qf.homeFlag} {qf.home}</span>
                    <span className="text-brand-gold text-sm font-bold px-3">VS</span>
                    <span className="text-white font-semibold text-right">{qf.away} {qf.awayFlag}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-brand-gray text-xs">
                    <Clock className="w-3 h-3" />
                    {qf.time}
                    <span className="mx-1">·</span>
                    <MapPin className="w-3 h-3" />
                    {qf.venue}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Back buttons */}
      <div className="flex items-center gap-4 mt-10">
        <Link href="/live-scores" className="gr-btn-ghost flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Live Scores
        </Link>
        <Link href="/results" className="gr-btn-ghost flex items-center gap-2 text-sm">
          All Results
        </Link>
        <Link href="/fixtures" className="gr-btn-ghost flex items-center gap-2 text-sm">
          Fixtures
        </Link>
      </div>
    </div>
  );
}
