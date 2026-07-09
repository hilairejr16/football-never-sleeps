'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import MatchCard from '@/components/cards/MatchCard';
import type { Match } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

const FILTERS = [
  { id: 'wc',  label: '🏆 World Cup',    leagueId: '1'  },
  { id: 'all', label: 'All Leagues',     leagueId: ''   },
  { id: '39',  label: 'Premier League',  leagueId: '39' },
  { id: '140', label: 'La Liga',         leagueId: '140'},
  { id: '135', label: 'Serie A',         leagueId: '135'},
  { id: '2',   label: 'Champions League',leagueId: '2'  },
] as const;

export default function LiveScoresSection() {
  const [matches, setMatches]       = useState<Match[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading]       = useState(false);
  const [filter, setFilter]         = useState<'wc' | 'all' | string>('wc');

  const fetchMatches = async () => {
    setLoading(true);
    try {
      // World Cup filter: use /world-cup/today, others use /matches/today
      const leagueParam = FILTERS.find(f => f.id === filter)?.leagueId ?? filter;
      const url = filter === 'wc'
        ? `${BASE}/world-cup/today`
        : leagueParam
          ? `${BASE}/matches/today?league=${leagueParam}`
          : `${BASE}/matches/today`;

      const res = await fetch(url);
      if (res.ok) {
        const { data } = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMatches(data);
          setLastUpdated(new Date());
        }
      }
    } catch { /* keep current data */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const live      = matches.filter(m => m.status === 'LIVE' || m.status === 'HT');
  const upcoming  = matches.filter(m => m.status === 'SCHEDULED');
  const finished  = matches.filter(m => m.status === 'FT' || m.status === 'AET' || m.status === 'PEN');
  const displayed = filter === 'wc'
    ? matches
    : matches.slice(0, 6);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="gr-section-title">
          {filter === 'wc' ? (
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              World Cup Live
            </span>
          ) : 'Live Scores'}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMatches}
            className={`text-brand-gray hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`}
            aria-label="Refresh scores"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="text-brand-gray text-xs hidden sm:block">
            {lastUpdated.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {live.length > 0 && (
            <span className="gr-badge-live text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
              {live.length} Live
            </span>
          )}
          <Link href="/live-scores" className="text-brand-red text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
              filter === f.id
                ? f.id === 'wc'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-brand-red text-white'
                : 'bg-brand-card text-brand-gray border border-brand-border hover:border-brand-muted'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Match Grid */}
      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayed.map(match => (
            <MatchCard key={match.id} match={match} variant="compact" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-brand-card rounded-xl border border-brand-border">
          {filter === 'wc' ? (
            <>
              <Trophy className="w-10 h-10 text-yellow-400/30 mx-auto mb-3" />
              <p className="text-white font-semibold">No World Cup matches right now</p>
              <p className="text-brand-gray text-sm mt-1">Quarter-Finals begin July 10</p>
              <Link href="/world-cup" className="inline-flex items-center gap-1 text-yellow-400 text-xs font-semibold mt-3 hover:text-yellow-300">
                View Full Schedule <ArrowRight className="w-3 h-3" />
              </Link>
            </>
          ) : (
            <>
              <p className="text-brand-gray text-lg">No matches right now</p>
              <p className="text-brand-gray text-sm mt-1">All major leagues are on summer break for World Cup 2026</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
