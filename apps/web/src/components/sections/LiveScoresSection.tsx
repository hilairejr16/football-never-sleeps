'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Trophy, Calendar } from 'lucide-react';
import MatchCard from '@/components/cards/MatchCard';
import type { Match } from '@/lib/types';

const QF_FIXTURES = [
  { home: 'Spain',    homeFlag: '🇪🇸', away: 'Germany',   awayFlag: '🇩🇪', date: 'Thu Jul 10', time: '3:00 PM ET', venue: 'MetLife Stadium, NJ' },
  { home: 'France',   homeFlag: '🇫🇷', away: 'England',   awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', date: 'Thu Jul 10', time: '7:00 PM ET', venue: 'AT&T Stadium, Dallas' },
  { home: 'Brazil',   homeFlag: '🇧🇷', away: 'Argentina', awayFlag: '🇦🇷', date: 'Fri Jul 11', time: '3:00 PM ET', venue: 'Rose Bowl, CA' },
  { home: 'Portugal', homeFlag: '🇵🇹', away: 'USA',       awayFlag: '🇺🇸', date: 'Sun Jul 12', time: '7:00 PM ET', venue: "Levi's Stadium, SF" },
];

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
        <div className="bg-brand-card rounded-xl border border-brand-border overflow-hidden">
          {filter === 'wc' ? (
            <>
              <div className="px-5 py-3 border-b border-brand-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-bold">Quarter-Finals — Up Next</span>
                </div>
                <Link href="/world-cup" className="text-yellow-400/70 text-xs hover:text-yellow-300 transition-colors">
                  Full bracket →
                </Link>
              </div>
              <div className="divide-y divide-brand-border/40">
                {QF_FIXTURES.map((m, i) => (
                  <Link key={i} href="/fixtures" className="flex items-center gap-3 px-5 py-3.5 hover:bg-brand-dark/50 transition-colors group">
                    <div className="w-20 flex-shrink-0">
                      <div className="text-brand-gold text-[11px] font-bold">{m.date}</div>
                      <div className="text-brand-muted text-[10px]">{m.time}</div>
                    </div>
                    <div className="flex-1 grid grid-cols-[1fr_28px_1fr] items-center gap-1 min-w-0">
                      <span className="text-white text-sm font-semibold text-right truncate">{m.homeFlag} {m.home}</span>
                      <span className="text-brand-gray text-xs text-center">vs</span>
                      <span className="text-white text-sm font-semibold truncate">{m.away} {m.awayFlag}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-brand-muted group-hover:text-yellow-400 flex-shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-10 h-10 text-yellow-400/20 mx-auto mb-3" />
              <p className="text-brand-gray">All major leagues on summer break for World Cup 2026</p>
              <Link href="/world-cup" className="inline-flex items-center gap-1 text-yellow-400 text-xs font-semibold mt-3 hover:text-yellow-300">
                World Cup Hub <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
