'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw } from 'lucide-react';
import MatchCard from '@/components/cards/MatchCard';
import type { Match } from '@/lib/types';

const MOCK_MATCHES: Match[] = [
  {
    id: 101, status: 'LIVE', minute: 72,
    homeTeam: { id: 33, name: 'Manchester United', shortName: 'MAN UTD', logo: '', country: 'England' },
    awayTeam: { id: 34, name: 'Liverpool', shortName: 'LIV', logo: '', country: 'England' },
    homeScore: 2, awayScore: 2,
    date: new Date().toISOString(),
    league: { id: 39, name: 'Premier League', shortName: 'PL', logo: '', country: 'England', season: 2025, type: 'League' },
  },
  {
    id: 102, status: 'LIVE', minute: 41,
    homeTeam: { id: 541, name: 'Real Madrid', shortName: 'RMA', logo: '', country: 'Spain' },
    awayTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '', country: 'Spain' },
    homeScore: 1, awayScore: 0,
    date: new Date().toISOString(),
    league: { id: 140, name: 'La Liga', shortName: 'LL', logo: '', country: 'Spain', season: 2025, type: 'League' },
  },
  {
    id: 103, status: 'HT',
    homeTeam: { id: 85, name: 'PSG', shortName: 'PSG', logo: '', country: 'France' },
    awayTeam: { id: 1, name: 'Bayern Munich', shortName: 'BAY', logo: '', country: 'Germany' },
    homeScore: 1, awayScore: 1,
    date: new Date().toISOString(),
    league: { id: 2, name: 'Champions League', shortName: 'UCL', logo: '', country: 'Europe', season: 2025, type: 'Cup' },
  },
  {
    id: 104, status: 'LIVE', minute: 18,
    homeTeam: { id: 49, name: 'Chelsea', shortName: 'CHE', logo: '', country: 'England' },
    awayTeam: { id: 42, name: 'Arsenal', shortName: 'ARS', logo: '', country: 'England' },
    homeScore: 0, awayScore: 1,
    date: new Date().toISOString(),
    league: { id: 39, name: 'Premier League', shortName: 'PL', logo: '', country: 'England', season: 2025, type: 'League' },
  },
  {
    id: 105, status: 'LIVE', minute: 55,
    homeTeam: { id: 489, name: 'AC Milan', shortName: 'MIL', logo: '', country: 'Italy' },
    awayTeam: { id: 505, name: 'Inter Milan', shortName: 'INT', logo: '', country: 'Italy' },
    homeScore: 0, awayScore: 0,
    date: new Date().toISOString(),
    league: { id: 135, name: 'Serie A', shortName: 'SA', logo: '', country: 'Italy', season: 2025, type: 'League' },
  },
  {
    id: 106, status: 'SCHEDULED',
    homeTeam: { id: 157, name: 'Bayern Munich', shortName: 'BAY', logo: '', country: 'Germany' },
    awayTeam: { id: 165, name: 'Borussia Dortmund', shortName: 'BVB', logo: '', country: 'Germany' },
    homeScore: null, awayScore: null,
    date: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    league: { id: 78, name: 'Bundesliga', shortName: 'BL', logo: '', country: 'Germany', season: 2025, type: 'League' },
  },
];

export default function LiveScoresSection() {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'live' | 'scheduled'>('all');

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/matches/today');
      if (res.ok) {
        const { data } = await res.json();
        if (data?.length) setMatches(data);
        setLastUpdated(new Date());
      }
    } catch { /* keep current data */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const interval = setInterval(fetchMatches, 30_000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === 'all'
    ? matches
    : filter === 'live'
    ? matches.filter(m => m.status === 'LIVE' || m.status === 'HT')
    : matches.filter(m => m.status === 'SCHEDULED');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="gr-section-title">Live Scores</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMatches}
            className={`text-brand-gray hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`}
            aria-label="Refresh scores"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="text-brand-gray text-xs hidden sm:block">
            Updated {lastUpdated.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <Link href="/live-scores" className="text-brand-red text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-4">
        {(['all', 'live', 'scheduled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f
                ? 'bg-brand-red text-white'
                : 'bg-brand-card text-brand-gray border border-brand-border hover:border-brand-muted'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'live' && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-live inline-block animate-live-dot" />
            )}
          </button>
        ))}
      </div>

      {/* Match Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(match => (
          <MatchCard key={match.id} match={match} variant="compact" />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-brand-gray">
          <p className="text-lg">No matches right now</p>
          <p className="text-sm mt-1">Check back soon for live action</p>
        </div>
      )}
    </div>
  );
}
