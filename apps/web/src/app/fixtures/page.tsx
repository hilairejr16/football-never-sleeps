import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Trophy, Clock, ArrowRight } from 'lucide-react';
import type { Match } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Fixtures & Schedule — World Cup 2026',
  description: 'Full FIFA World Cup 2026 fixture schedule, upcoming matches, and results from the knockout stages.',
  alternates: { canonical: '/fixtures' },
};

export const revalidate = 300;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

async function fetchFixtures(path: string): Promise<Match[]> {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: 300 } });
    if (res.ok) { const { data } = await res.json(); return data ?? []; }
  } catch {}
  return [];
}

const WC_SCHEDULE = [
  { round: 'Quarter-Final 1', date: 'Fri 10 Jul', time: '21:00 UTC', home: 'TBD', away: 'TBD', venue: 'SoFi Stadium, LA' },
  { round: 'Quarter-Final 2', date: 'Fri 10 Jul', time: '01:00 UTC', home: 'TBD', away: 'TBD', venue: 'AT&T Stadium, Dallas' },
  { round: 'Quarter-Final 3', date: 'Sat 11 Jul', time: '21:00 UTC', home: 'TBD', away: 'TBD', venue: 'MetLife Stadium, NJ' },
  { round: 'Quarter-Final 4', date: 'Sat 12 Jul', time: '01:00 UTC', home: 'TBD', away: 'TBD', venue: 'Levi\'s Stadium, SF' },
  { round: 'Semi-Final 1',    date: 'Wed 15 Jul', time: '21:00 UTC', home: 'TBD', away: 'TBD', venue: 'MetLife Stadium, NJ' },
  { round: 'Semi-Final 2',    date: 'Thu 16 Jul', time: '21:00 UTC', home: 'TBD', away: 'TBD', venue: 'SoFi Stadium, LA' },
  { round: '3rd Place',       date: 'Sat 18 Jul', time: '19:00 UTC', home: 'TBD', away: 'TBD', venue: 'Estadio Azteca, MX' },
  { round: '🏆 THE FINAL',    date: 'Sun 19 Jul', time: '21:00 UTC', home: 'TBD', away: 'TBD', venue: 'MetLife Stadium, NJ' },
];

function MatchRow({ match }: { match: Match }) {
  const done = ['FT','AET','PEN'].includes(match.status);
  return (
    <div className="flex items-center gap-3 px-5 py-4 hover:bg-brand-dark/50 border-b border-brand-border/40 last:border-0">
      <div className="w-20 flex-shrink-0 text-center">
        {match.status === 'LIVE' || match.status === 'HT'
          ? <span className="text-live text-xs font-bold flex items-center gap-1 justify-center"><span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot"/>{match.status === 'HT' ? 'HT' : `${match.minute}′`}</span>
          : done ? <span className="text-brand-gray text-xs font-bold">FT</span>
          : <span className="text-brand-gray text-xs">{new Date(match.date).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'})} UTC</span>}
      </div>
      <div className="flex-1 flex items-center justify-between gap-2">
        <span className={`text-sm font-semibold truncate ${done && (match.homeScore??0)>(match.awayScore??0)?'text-white':'text-brand-gray'}`}>{match.homeTeam.name}</span>
        <span className="font-display text-xl text-white flex-shrink-0 w-16 text-center tabular-nums">{match.homeScore??'–'} : {match.awayScore??'–'}</span>
        <span className={`text-sm font-semibold truncate text-right ${done && (match.awayScore??0)>(match.homeScore??0)?'text-white':'text-brand-gray'}`}>{match.awayTeam.name}</span>
      </div>
    </div>
  );
}

export default async function FixturesPage() {
  const [wcToday, wcResults, wcUpcoming] = await Promise.all([
    fetchFixtures('/world-cup/today'),
    fetchFixtures('/world-cup/results'),
    fetchFixtures('/world-cup/upcoming'),
  ]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white flex items-center gap-3 mb-2">
          <Calendar className="w-7 h-7 text-brand-gold" /> FIXTURES
        </h1>
        <p className="text-brand-gray">World Cup 2026 schedule · Club fixtures on hold for summer break</p>
      </div>

      {/* WC Schedule card */}
      <div className="gr-card mb-8 border border-yellow-500/20" style={{background:'linear-gradient(135deg,#0a2a1a,#1a3a0a 60%,#0f1923)'}}>
        <div className="px-5 py-4 border-b border-yellow-500/20 flex items-center justify-between">
          <h2 className="text-yellow-400 font-semibold flex items-center gap-2"><Trophy className="w-4 h-4"/>World Cup 2026 — Remaining Schedule</h2>
          <Link href="/world-cup" className="text-yellow-400 text-xs flex items-center gap-1 hover:text-yellow-300">Full Hub <ArrowRight className="w-3 h-3"/></Link>
        </div>
        <div className="divide-y divide-yellow-500/10">
          {WC_SCHEDULE.map(r => (
            <div key={r.round} className={`flex items-center gap-4 px-5 py-4 ${r.round.includes('FINAL') ? 'bg-yellow-500/5' : ''}`}>
              <div className="w-32 flex-shrink-0">
                <div className={`text-xs font-bold ${r.round.includes('FINAL') ? 'text-yellow-400' : 'text-yellow-400/70'}`}>{r.round}</div>
                <div className="text-white/40 text-xs mt-0.5">{r.date}</div>
              </div>
              <div className="flex-1 flex items-center justify-between gap-4">
                <span className="text-white/60 text-sm">{r.home}</span>
                <span className="text-white/30 text-xs flex items-center gap-1"><Clock className="w-3 h-3"/>{r.time}</span>
                <span className="text-white/60 text-sm text-right">{r.away}</span>
              </div>
              <div className="text-white/30 text-xs hidden md:block flex-shrink-0 w-40 text-right">{r.venue}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today */}
        <div className="gr-card">
          <div className="px-5 py-4 border-b border-brand-border">
            <h2 className="text-white font-semibold">Today</h2>
          </div>
          {wcToday.length > 0
            ? wcToday.map(m => <MatchRow key={m.id} match={m}/>)
            : <div className="px-5 py-10 text-center text-brand-gray text-sm">No matches today · Next: QF July 10</div>}
        </div>

        {/* Recent Results */}
        <div className="gr-card">
          <div className="px-5 py-4 border-b border-brand-border">
            <h2 className="text-white font-semibold">Recent Results</h2>
          </div>
          {wcResults.slice(0,8).length > 0
            ? wcResults.slice(0,8).map(m => <MatchRow key={m.id} match={m}/>)
            : <div className="px-5 py-10 text-center text-brand-gray text-sm">No recent results</div>}
        </div>
      </div>

      {/* Upcoming */}
      {wcUpcoming.length > 0 && (
        <div className="gr-card mt-8">
          <div className="px-5 py-4 border-b border-brand-border">
            <h2 className="text-white font-semibold">Upcoming World Cup Fixtures</h2>
          </div>
          {wcUpcoming.map(m => <MatchRow key={m.id} match={m}/>)}
        </div>
      )}
    </div>
  );
}
