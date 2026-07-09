import type { Metadata } from 'next';
import Link from 'next/link';
import { Flag, Trophy, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Match Results — World Cup 2026',
  description: 'Full FIFA World Cup 2026 match results from the Round of 16, Quarter-Finals and beyond.',
  alternates: { canonical: '/results' },
};

export const revalidate = 300;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

async function fetchResults() {
  try {
    const res = await fetch(`${BASE}/world-cup/results`, { next: { revalidate: 300 } });
    if (res.ok) { const { data } = await res.json(); if (Array.isArray(data) && data.length) return data; }
  } catch {}
  return [];
}

const R16_RESULTS = [
  { id: 'r1', date: 'Sat 4 Jul', home: 'Morocco',     away: 'Canada',    hs: 3, as: 0, venue: 'AT&T Stadium, Dallas',             note: '' },
  { id: 'r2', date: 'Sat 4 Jul', home: 'France',      away: 'Paraguay',  hs: 1, as: 0, venue: 'MetLife Stadium, NJ',              note: '' },
  { id: 'r3', date: 'Sun 5 Jul', home: 'Norway',      away: 'Brazil',    hs: 2, as: 0, venue: 'Rose Bowl, CA',                    note: '' },
  { id: 'r4', date: 'Sun 5 Jul', home: 'England',     away: 'Mexico',    hs: 3, as: 2, venue: 'AT&T Stadium, Dallas',             note: '' },
  { id: 'r5', date: 'Mon 6 Jul', home: 'Spain',       away: 'Portugal',  hs: 1, as: 0, venue: 'SoFi Stadium, Inglewood',         note: '' },
  { id: 'r6', date: 'Mon 6 Jul', home: 'Belgium',     away: 'USA',       hs: 4, as: 1, venue: "Levi's Stadium, SF",              note: '' },
  { id: 'r7', date: 'Tue 7 Jul', home: 'Argentina',   away: 'Egypt',     hs: 3, as: 2, venue: 'Hard Rock Stadium, Miami',        note: '' },
  { id: 'r8', date: 'Tue 7 Jul', home: 'Switzerland', away: 'Colombia',  hs: 0, as: 0, venue: 'Arrowhead Stadium, KC',           note: 'PEN' },
];

const NOTABLE_EXITS = [
  { team: 'Canada',       flag: '🇨🇦', lost_to: 'Morocco',     score: '0–3', round: 'R16' },
  { team: 'Paraguay',     flag: '🇵🇾', lost_to: 'France',      score: '0–1', round: 'R16' },
  { team: 'Brazil',       flag: '🇧🇷', lost_to: 'Norway',      score: '0–2', round: 'R16' },
  { team: 'Mexico',       flag: '🇲🇽', lost_to: 'England',     score: '2–3', round: 'R16' },
  { team: 'Portugal',     flag: '🇵🇹', lost_to: 'Spain',       score: '0–1', round: 'R16' },
  { team: 'USA',          flag: '🇺🇸', lost_to: 'Belgium',     score: '1–4', round: 'R16' },
  { team: 'Egypt',        flag: '🇪🇬', lost_to: 'Argentina',   score: '2–3', round: 'R16' },
  { team: 'Colombia',     flag: '🇨🇴', lost_to: 'Switzerland', score: 'PKs', round: 'R16' },
];

function ResultRow({ r }: { r: typeof R16_RESULTS[0] }) {
  const homeWon = r.hs > r.as;
  const awayWon = r.as > r.hs;
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-border/40 last:border-0 hover:bg-brand-dark/40 transition-colors">
      <div className="w-24 flex-shrink-0 text-brand-gray text-xs">{r.date}</div>
      <div className="flex-1 flex items-center justify-between gap-2">
        <span className={`text-sm font-semibold truncate ${homeWon ? 'text-white' : 'text-brand-gray'}`}>{r.home}</span>
        <div className="flex-shrink-0 text-center">
          <span className="font-display text-xl text-white tabular-nums">{r.hs} – {r.as}</span>
          {r.note && <span className="ml-1 text-xs text-brand-gold">{r.note}</span>}
        </div>
        <span className={`text-sm font-semibold truncate text-right ${awayWon ? 'text-white' : 'text-brand-gray'}`}>{r.away}</span>
      </div>
      <div className="text-brand-muted text-xs hidden md:block w-44 text-right flex-shrink-0 truncate">{r.venue}</div>
    </div>
  );
}

export default async function ResultsPage() {
  const liveResults = await fetchResults();

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white flex items-center gap-3 mb-2">
          <Flag className="w-7 h-7 text-brand-gold"/>RESULTS
        </h1>
        <p className="text-brand-gray">FIFA World Cup 2026 — Knockout Stage Results</p>
      </div>

      {/* WC banner */}
      <div className="gr-card p-4 mb-6 flex items-center gap-4 border border-yellow-500/20">
        <Trophy className="w-6 h-6 text-yellow-400 flex-shrink-0"/>
        <div className="flex-1">
          <div className="text-yellow-400 text-xs font-bold">8 Nations Advance to Quarter-Finals · July 9–11</div>
          <div className="text-brand-gray text-xs mt-0.5">France · Morocco · Spain · Belgium · Norway · England · Argentina · Switzerland</div>
        </div>
        <Link href="/fixtures" className="text-yellow-400 text-xs font-semibold flex items-center gap-1 whitespace-nowrap">QF Fixtures<ArrowRight className="w-3 h-3"/></Link>
      </div>

      {/* Live results from API (if available) */}
      {liveResults.length > 0 && (
        <div className="gr-card mb-8">
          <div className="px-5 py-4 border-b border-brand-border">
            <h2 className="text-white font-semibold">Latest Results</h2>
          </div>
          {liveResults.map((m: { id: number; homeTeam: { name: string }; awayTeam: { name: string }; homeScore: number | null; awayScore: number | null; date: string; status: string }) => (
            <div key={m.id} className="flex items-center gap-3 px-5 py-4 border-b border-brand-border/40 last:border-0">
              <div className="flex-1 flex items-center justify-between gap-4">
                <span className="text-white font-semibold">{m.homeTeam.name}</span>
                <span className="font-display text-xl text-white">{m.homeScore ?? '–'} – {m.awayScore ?? '–'}</span>
                <span className="text-white font-semibold text-right">{m.awayTeam.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Round of 16 */}
      <div className="gr-card mb-8">
        <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="text-white font-semibold flex items-center gap-2"><Flag className="w-4 h-4 text-brand-red"/>Round of 16</h2>
          <span className="text-brand-gray text-xs">July 4–7, 2026 · All 8 matches complete</span>
        </div>
        {R16_RESULTS.map(r => <ResultRow key={r.id} r={r}/>)}
      </div>

      {/* Teams eliminated */}
      <div className="gr-card">
        <div className="px-5 py-4 border-b border-brand-border">
          <h2 className="text-white font-semibold">Teams Eliminated in Round of 16</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/40">
          {NOTABLE_EXITS.map(t => (
            <div key={t.team} className="px-5 py-4 flex items-center gap-3">
              <span className="text-2xl">{t.flag}</span>
              <div>
                <div className="text-white font-semibold text-sm">{t.team}</div>
                <div className="text-brand-gray text-xs">Lost to {t.lost_to} · {t.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/fixtures" className="gr-btn-primary px-8 inline-flex items-center gap-2">
          <Trophy className="w-4 h-4"/>View Quarter-Final Fixtures
        </Link>
      </div>
    </div>
  );
}
