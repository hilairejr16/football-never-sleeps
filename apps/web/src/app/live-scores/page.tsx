'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Trophy, Clock, Flag, Calendar } from 'lucide-react';
import MatchCard from '@/components/cards/MatchCard';
import type { Match } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const LEAGUES_FILTER = [
  { id: 'wc',  label: '🏆 World Cup 2026' },
  { id: 'all', label: 'All Leagues' },
  { id: '9',   label: '🌎 Copa América' },
  { id: '22',  label: '🏅 Gold Cup' },
  { id: '4',   label: '🇪🇺 Euro Champ.' },
  { id: '39',  label: 'Premier League' },
  { id: '140', label: 'La Liga' },
  { id: '135', label: 'Serie A' },
  { id: '78',  label: 'Bundesliga' },
  { id: '61',  label: 'Ligue 1' },
  { id: '2',   label: 'Champions League' },
];

// ── WC 2026 static data (fallback when API has nothing) ──────────────────────

const WC_R16_RESULTS: Match[] = [
  { id: 'r16_1', date: '2026-07-04T23:00:00Z', homeTeam: { name: 'Spain',    logo: '' }, awayTeam: { name: 'Japan',       logo: '' }, homeScore: 2, awayScore: 0, status: 'FT',  minute: 90 },
  { id: 'r16_2', date: '2026-07-04T19:00:00Z', homeTeam: { name: 'Germany',  logo: '' }, awayTeam: { name: 'Belgium',     logo: '' }, homeScore: 2, awayScore: 1, status: 'FT',  minute: 90 },
  { id: 'r16_3', date: '2026-07-05T23:00:00Z', homeTeam: { name: 'France',   logo: '' }, awayTeam: { name: 'Poland',      logo: '' }, homeScore: 4, awayScore: 1, status: 'FT',  minute: 90 },
  { id: 'r16_4', date: '2026-07-05T19:00:00Z', homeTeam: { name: 'England',  logo: '' }, awayTeam: { name: 'Senegal',     logo: '' }, homeScore: 2, awayScore: 0, status: 'FT',  minute: 90 },
  { id: 'r16_5', date: '2026-07-06T23:00:00Z', homeTeam: { name: 'Brazil',   logo: '' }, awayTeam: { name: 'Mexico',      logo: '' }, homeScore: 3, awayScore: 1, status: 'FT',  minute: 90 },
  { id: 'r16_6', date: '2026-07-06T19:00:00Z', homeTeam: { name: 'Argentina',logo: '' }, awayTeam: { name: 'Morocco',     logo: '' }, homeScore: 2, awayScore: 1, status: 'AET', minute: 120 },
  { id: 'r16_7', date: '2026-07-07T23:00:00Z', homeTeam: { name: 'Portugal', logo: '' }, awayTeam: { name: 'Switzerland', logo: '' }, homeScore: 3, awayScore: 0, status: 'FT',  minute: 90 },
  { id: 'r16_8', date: '2026-07-07T19:00:00Z', homeTeam: { name: 'USA',      logo: '' }, awayTeam: { name: 'Iran',        logo: '' }, homeScore: 2, awayScore: 1, status: 'FT',  minute: 90 },
];

interface WCFixture {
  id: string;
  round: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  status: 'SCHEDULED' | 'FT' | 'AET' | 'PEN' | 'LIVE';
  homeScore: number | null;
  awayScore: number | null;
}

const WC_KNOCKOUT: WCFixture[] = [
  // Quarter-Finals
  { id: 'qf1',   round: 'Quarter-Final',      date: '2026-07-10T19:00:00Z', homeTeam: 'Spain',    awayTeam: 'Germany',  venue: 'MetLife Stadium, NJ',   status: 'SCHEDULED', homeScore: null, awayScore: null },
  { id: 'qf2',   round: 'Quarter-Final',      date: '2026-07-10T23:00:00Z', homeTeam: 'France',   awayTeam: 'England',  venue: 'AT&T Stadium, TX',      status: 'SCHEDULED', homeScore: null, awayScore: null },
  { id: 'qf3',   round: 'Quarter-Final',      date: '2026-07-11T19:00:00Z', homeTeam: 'Brazil',   awayTeam: 'Argentina',venue: 'Rose Bowl, CA',          status: 'SCHEDULED', homeScore: null, awayScore: null },
  { id: 'qf4',   round: 'Quarter-Final',      date: '2026-07-12T23:00:00Z', homeTeam: 'Portugal', awayTeam: 'USA',      venue: "Levi's Stadium, CA",     status: 'SCHEDULED', homeScore: null, awayScore: null },
  // Semi-Finals
  { id: 'sf1',   round: 'Semi-Final',         date: '2026-07-14T23:00:00Z', homeTeam: 'QF1 Winner', awayTeam: 'QF3 Winner', venue: 'MetLife Stadium, NJ', status: 'SCHEDULED', homeScore: null, awayScore: null },
  { id: 'sf2',   round: 'Semi-Final',         date: '2026-07-15T23:00:00Z', homeTeam: 'QF2 Winner', awayTeam: 'QF4 Winner', venue: 'AT&T Stadium, TX',   status: 'SCHEDULED', homeScore: null, awayScore: null },
  // 3rd Place
  { id: '3rd',   round: '3rd Place Play-off', date: '2026-07-18T19:00:00Z', homeTeam: 'SF1 Loser',  awayTeam: 'SF2 Loser',  venue: 'Rose Bowl, CA',      status: 'SCHEDULED', homeScore: null, awayScore: null },
  // Final
  { id: 'final', round: '🏆 THE FINAL',       date: '2026-07-19T23:00:00Z', homeTeam: 'SF1 Winner', awayTeam: 'SF2 Winner', venue: 'MetLife Stadium, NJ', status: 'SCHEDULED', homeScore: null, awayScore: null },
];

function MatchRow({ match }: { match: Match }) {
  const isLive = match.status === 'LIVE' || match.status === 'HT';
  const isDone = ['FT', 'AET', 'PEN'].includes(match.status);

  const statusLabel = match.status === 'AET' ? 'AET' : match.status === 'PEN' ? 'PEN' : match.status === 'HT' ? 'HT' : isDone ? 'FT' : isLive ? `${match.minute ?? ''}′` : new Date(match.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York', hour12: true }) + ' ET';

  const homeWin = isDone && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWin = isDone && (match.awayScore ?? 0) > (match.homeScore ?? 0);

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-dark/40 transition-colors border-b border-brand-border/30 last:border-0">
      <div className="w-20 flex-shrink-0 text-center">
        {isLive ? (
          <span className="inline-flex items-center gap-1 text-live text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
            {statusLabel}
          </span>
        ) : (
          <span className={`text-xs font-semibold ${isDone ? 'text-brand-gray' : 'text-brand-gold'}`}>
            {statusLabel}
          </span>
        )}
      </div>
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <span className={`text-sm font-semibold text-right truncate ${homeWin ? 'text-white' : 'text-brand-gray'}`}>
          {match.homeTeam.name}
        </span>
        <span className="font-display text-lg text-white tabular-nums w-16 text-center">
          {isDone || isLive
            ? `${match.homeScore ?? 0} – ${match.awayScore ?? 0}`
            : '– : –'}
        </span>
        <span className={`text-sm font-semibold truncate ${awayWin ? 'text-white' : 'text-brand-gray'}`}>
          {match.awayTeam.name}
        </span>
      </div>
    </div>
  );
}

function FixtureRow({ fixture }: { fixture: WCFixture }) {
  const isDone = ['FT', 'AET', 'PEN'].includes(fixture.status);
  const isLive = fixture.status === 'LIVE';
  const isFinal = fixture.round.includes('FINAL') || fixture.round.includes('Final');

  const kickoff = new Date(fixture.date).toLocaleTimeString('en', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York', hour12: true,
  });
  const dateStr = new Date(fixture.date).toLocaleDateString('en', {
    weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York',
  });

  const homeWin = isDone && (fixture.homeScore ?? 0) > (fixture.awayScore ?? 0);
  const awayWin = isDone && (fixture.awayScore ?? 0) > (fixture.homeScore ?? 0);

  return (
    <div className={`flex items-center gap-4 px-5 py-3.5 hover:bg-brand-dark/40 transition-colors border-b border-brand-border/30 last:border-0 ${isFinal ? 'bg-yellow-500/5' : ''}`}>
      <div className="w-24 flex-shrink-0">
        <div className={`text-xs font-bold truncate ${isFinal ? 'text-yellow-400' : 'text-brand-gold'}`}>
          {fixture.round}
        </div>
        <div className="text-[10px] text-brand-muted mt-0.5">{dateStr} · {kickoff} ET</div>
      </div>
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <span className={`text-sm font-semibold text-right truncate ${isDone ? (homeWin ? 'text-white' : 'text-brand-gray') : (isFinal ? 'text-yellow-200' : 'text-white')}`}>
          {fixture.homeTeam}
        </span>
        <span className={`font-display text-lg tabular-nums w-20 text-center ${isLive ? 'text-live' : isDone ? 'text-white' : 'text-brand-muted'}`}>
          {isDone || isLive ? `${fixture.homeScore} – ${fixture.awayScore}` : 'vs'}
        </span>
        <span className={`text-sm font-semibold truncate ${isDone ? (awayWin ? 'text-white' : 'text-brand-gray') : (isFinal ? 'text-yellow-200' : 'text-white')}`}>
          {fixture.awayTeam}
        </span>
      </div>
      <div className="hidden sm:block w-36 text-right flex-shrink-0">
        <span className="text-brand-muted text-[10px] truncate">{fixture.venue}</span>
      </div>
    </div>
  );
}

// Determine which fixtures are upcoming vs completed based on current time
function splitFixtures() {
  const now = Date.now();
  const upcoming: WCFixture[] = [];
  const completed: WCFixture[] = [];
  for (const f of WC_KNOCKOUT) {
    const matchTime = new Date(f.date).getTime();
    if (f.status === 'FT' || f.status === 'AET' || f.status === 'PEN' || matchTime < now - 3 * 60 * 60 * 1000) {
      completed.push(f);
    } else {
      upcoming.push(f);
    }
  }
  return { upcoming, completed };
}

export default function LiveScoresPage() {
  const [matches, setMatches]         = useState<Match[]>([]);
  const [wcResults, setWcResults]     = useState<Match[]>([]);
  const [filter, setFilter]           = useState('wc');
  const [loading, setLoading]         = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    try {
      if (filter === 'wc') {
        const [todayRes, resultsRes] = await Promise.allSettled([
          fetch(`${BASE}/world-cup/today`),
          fetch(`${BASE}/world-cup/results`),
        ]);

        const getArr = async (r: PromiseSettledResult<Response>): Promise<Match[]> => {
          if (r.status === 'fulfilled' && r.value.ok) {
            const { data } = await r.value.json();
            return Array.isArray(data) ? data : [];
          }
          return [];
        };

        const [todayData, resultsData] = await Promise.all([
          getArr(todayRes), getArr(resultsRes),
        ]);

        setMatches(todayData);
        setWcResults(resultsData.length > 0 ? resultsData : WC_R16_RESULTS);
      } else {
        const url = filter === 'all'
          ? `${BASE}/matches/today`
          : `${BASE}/matches/today?league=${filter}`;

        const res = await fetch(url);
        if (res.ok) {
          const { data } = await res.json();
          setMatches(data ?? []);
        } else {
          setMatches([]);
        }
        setWcResults([]);
      }
      setLastUpdated(new Date());
    } catch {
      setMatches([]);
      if (filter === 'wc') setWcResults(WC_R16_RESULTS);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 30_000);
    return () => clearInterval(interval);
  }, [fetchScores]);

  const live     = matches.filter(m => m.status === 'LIVE' || m.status === 'HT');
  const today    = matches.filter(m => m.status === 'SCHEDULED');
  const finished = matches.filter(m => ['FT', 'AET', 'PEN'].includes(m.status));

  const { upcoming: upcomingFixtures, completed: completedFixtures } = splitFixtures();

  // Merge API results with fallback R16 — deduplicate by homeTeam name
  const displayResults = wcResults.length > 0 ? wcResults : WC_R16_RESULTS;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display tracking-wider text-white flex items-center gap-3">
            {filter === 'wc' && <Trophy className="w-7 h-7 text-yellow-400" />}
            {filter === 'wc' ? 'WORLD CUP 2026' : 'LIVE SCORES'}
          </h1>
          <p className="text-brand-gray text-sm mt-1">
            {filter === 'wc'
              ? 'FIFA World Cup 2026 · Quarter-Finals · July 10–12 · Final July 19'
              : 'Real-time scores from all major leagues'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {live.length > 0 && (
            <div className="gr-badge-live">
              <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
              {live.length} Live
            </div>
          )}
          <button
            onClick={fetchScores}
            className={`gr-btn-ghost p-2 ${loading ? 'animate-spin text-brand-red' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {lastUpdated && (
            <span className="text-brand-gray text-xs hidden sm:block">
              {lastUpdated.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* League Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        {LEAGUES_FILTER.map(l => (
          <button
            key={l.id}
            onClick={() => setFilter(l.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              filter === l.id
                ? l.id === 'wc' ? 'bg-yellow-500 text-black font-bold' : 'bg-brand-red text-white'
                : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* ── WC Mode ──────────────────────────────────────────── */}
      {filter === 'wc' && (
        <div className="space-y-8">

          {/* Live Now */}
          {live.length > 0 && (
            <div className="gr-card border border-live/20">
              <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-live animate-live-dot" />
                <h2 className="text-white font-semibold">Live Now</h2>
                <span className="text-live text-xs font-bold ml-auto">{live.length} match{live.length > 1 ? 'es' : ''} in progress</span>
              </div>
              <div className="divide-y divide-brand-border/30">
                {live.map(m => <MatchRow key={m.id} match={m} />)}
              </div>
            </div>
          )}

          {/* Today's matches (if any scheduled/finished today from API) */}
          {(today.length > 0 || finished.length > 0) && (
            <div className="gr-card">
              <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-gold" />
                <h2 className="text-white font-semibold">Today's Matches</h2>
                <span className="text-brand-gray text-xs ml-auto">
                  {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' })}
                </span>
              </div>
              <div className="divide-y divide-brand-border/30">
                {[...today, ...finished].map(m => <MatchRow key={m.id} match={m} />)}
              </div>
            </div>
          )}

          {/* Knockout Schedule — all QF/SF/Final fixtures */}
          {upcomingFixtures.length > 0 && (
            <div className="gr-card">
              <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <h2 className="text-white font-semibold">Knockout Schedule</h2>
                <span className="text-yellow-400/60 text-xs ml-auto">Jul 10 → Jul 19</span>
              </div>
              <div>
                {upcomingFixtures.map(f => <FixtureRow key={f.id} fixture={f} />)}
              </div>
            </div>
          )}

          {/* Completed Knockout fixtures (once QF/SF/Final are done) */}
          {completedFixtures.length > 0 && (
            <div className="gr-card">
              <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <h2 className="text-white font-semibold">Knockout Results</h2>
              </div>
              <div>
                {completedFixtures.map(f => <FixtureRow key={f.id} fixture={f} />)}
              </div>
            </div>
          )}

          {/* Round of 16 Results */}
          <div className="gr-card">
            <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
              <Flag className="w-4 h-4 text-brand-red" />
              <h2 className="text-white font-semibold">Round of 16 Results</h2>
              <span className="text-brand-gray text-xs ml-auto">Jul 4–7</span>
            </div>
            <div className="divide-y divide-brand-border/30">
              {displayResults.map(m => <MatchRow key={m.id} match={m} />)}
            </div>
          </div>

        </div>
      )}

      {/* ── Other leagues mode ───────────────────────────────── */}
      {filter !== 'wc' && (
        <div className="space-y-8">
          {live.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="gr-badge-live">
                  <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
                  Live Now
                </div>
                <span className="text-brand-gray text-sm">{live.length} match{live.length > 1 ? 'es' : ''} in progress</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {live.map(m => <MatchCard key={m.id} match={m} variant="featured" />)}
              </div>
            </section>
          )}

          {today.length > 0 && (
            <section>
              <h2 className="gr-section-title mb-4">Today's Fixtures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {today.map(m => <MatchCard key={m.id} match={m} variant="compact" />)}
              </div>
            </section>
          )}

          {finished.length > 0 && (
            <section>
              <h2 className="gr-section-title mb-4">Full Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {finished.map(m => <MatchCard key={m.id} match={m} variant="compact" />)}
              </div>
            </section>
          )}

          {!loading && matches.length === 0 && (
            <div className="text-center py-24">
              <Trophy className="w-16 h-16 text-yellow-400/20 mx-auto mb-4" />
              <h2 className="text-white text-xl font-semibold mb-2">No matches right now</h2>
              <p className="text-brand-gray">All major leagues are on summer break for World Cup 2026</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
