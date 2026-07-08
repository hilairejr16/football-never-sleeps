'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Trophy } from 'lucide-react';
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

export default function LiveScoresPage() {
  const [matches, setMatches]     = useState<Match[]>([]);
  const [filter, setFilter]       = useState('wc');
  const [loading, setLoading]     = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const url = filter === 'wc'
        ? `${BASE}/world-cup/today`
        : filter === 'all'
          ? `${BASE}/matches/today`
          : `${BASE}/matches/today?league=${filter}`;

      const res = await fetch(url);
      if (res.ok) {
        const { data } = await res.json();
        setMatches(data ?? []);
        setLastUpdated(new Date());
      }
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const live     = matches.filter(m => m.status === 'LIVE' || m.status === 'HT');
  const upcoming = matches.filter(m => m.status === 'SCHEDULED');
  const finished = matches.filter(m => ['FT', 'AET', 'PEN'].includes(m.status));

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display tracking-wider text-white flex items-center gap-3">
            {filter === 'wc' && <Trophy className="w-7 h-7 text-yellow-400" />}
            {filter === 'wc' ? 'WORLD CUP SCORES' : 'LIVE SCORES'}
          </h1>
          <p className="text-brand-gray text-sm mt-1">
            {filter === 'wc'
              ? 'FIFA World Cup 2026 · Quarter-Finals · July 10–12'
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
          <button onClick={fetchScores} className={`gr-btn-ghost p-2 ${loading ? 'animate-spin text-brand-red' : ''}`}>
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

      {/* Live Now */}
      {live.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="gr-badge-live"><span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />Live Now</div>
            <span className="text-brand-gray text-sm">{live.length} match{live.length > 1 ? 'es' : ''} in progress</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map(m => <MatchCard key={m.id} match={m} variant="featured" />)}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="gr-section-title mb-4">Today's Fixtures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.map(m => <MatchCard key={m.id} match={m} variant="compact" />)}
          </div>
        </section>
      )}

      {/* Finished */}
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
          <h2 className="text-white text-xl font-semibold mb-2">
            {filter === 'wc' ? 'No World Cup matches today' : 'No matches right now'}
          </h2>
          <p className="text-brand-gray">
            {filter === 'wc'
              ? 'Quarter-Finals begin July 10 · Check back then for live action'
              : 'All major leagues are on summer break for World Cup 2026'}
          </p>
        </div>
      )}
    </div>
  );
}
