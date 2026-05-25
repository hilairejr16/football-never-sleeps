'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Wifi } from 'lucide-react';
import MatchCard from '@/components/cards/MatchCard';
import type { Match } from '@/lib/types';

const LEAGUES_FILTER = [
  { id: 'all',  label: 'All Leagues' },
  { id: '39',   label: 'Premier League' },
  { id: '140',  label: 'La Liga' },
  { id: '135',  label: 'Serie A' },
  { id: '78',   label: 'Bundesliga' },
  { id: '61',   label: 'Ligue 1' },
  { id: '2',    label: 'Champions League' },
  { id: '3',    label: 'Europa League' },
];

export default function LiveScoresPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagueFilter, setLeagueFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const url = leagueFilter === 'all'
        ? '/api/matches/live'
        : `/api/matches/live?league=${leagueFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const { data } = await res.json();
        setMatches(data ?? []);
        setLastUpdated(new Date());
      }
    } catch {
      // Use fallback mock data
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 30_000);
    return () => clearInterval(interval);
  }, [leagueFilter]);

  const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'HT');
  const upcomingMatches = matches.filter(m => m.status === 'SCHEDULED');
  const finishedMatches = matches.filter(m => m.status === 'FT' || m.status === 'AET');

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display tracking-wider text-white">LIVE SCORES</h1>
          <p className="text-brand-gray text-sm mt-1">Real-time scores from all major leagues</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="gr-badge-live">
            <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
            {liveMatches.length} Live
          </div>
          <button
            onClick={fetchScores}
            className={`gr-btn-ghost p-2 ${loading ? 'animate-spin text-brand-red' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {lastUpdated && (
            <span className="text-brand-gray text-xs hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* League Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        {LEAGUES_FILTER.map(l => (
          <button
            key={l.id}
            onClick={() => setLeagueFilter(l.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              leagueFilter === l.id
                ? 'bg-brand-red text-white'
                : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Live Now */}
      {liveMatches.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="gr-badge-live">
              <Wifi className="w-3 h-3" />
              Live Now
            </div>
            <span className="text-brand-gray text-sm">{liveMatches.length} matches in progress</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map(m => (
              <MatchCard key={m.id} match={m} variant="featured" />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcomingMatches.length > 0 && (
        <section className="mb-10">
          <h2 className="gr-section-title mb-4">Upcoming Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingMatches.map(m => (
              <MatchCard key={m.id} match={m} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* Finished */}
      {finishedMatches.length > 0 && (
        <section>
          <h2 className="gr-section-title mb-4">Finished</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {finishedMatches.map(m => (
              <MatchCard key={m.id} match={m} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {!loading && matches.length === 0 && (
        <div className="text-center py-24">
          <div className="text-brand-gold text-5xl mb-4">⚽</div>
          <h2 className="text-white text-xl font-semibold mb-2">No matches right now</h2>
          <p className="text-brand-gray">Check back soon for live football action</p>
        </div>
      )}
    </div>
  );
}
