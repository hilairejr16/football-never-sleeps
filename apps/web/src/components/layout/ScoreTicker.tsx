'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Match } from '@/lib/types';
import { getScoreDisplay, isMatchLive } from '@/lib/utils';

const MOCK_LIVE: Match[] = [
  {
    id: 1, status: 'LIVE', minute: 67,
    homeTeam: { id: 33, name: 'Manchester United', shortName: 'MAN UTD', logo: '/teams/manu.png', country: 'England' },
    awayTeam: { id: 34, name: 'Liverpool', shortName: 'LIV', logo: '/teams/lfc.png', country: 'England' },
    homeScore: 2, awayScore: 1,
    date: new Date().toISOString(),
    league: { id: 39, name: 'Premier League', shortName: 'PL', logo: '/leagues/pl.png', country: 'England', season: 2025, type: 'League' },
  },
  {
    id: 2, status: 'LIVE', minute: 34,
    homeTeam: { id: 541, name: 'Real Madrid', shortName: 'RMA', logo: '/teams/real.png', country: 'Spain' },
    awayTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '/teams/barca.png', country: 'Spain' },
    homeScore: 1, awayScore: 0,
    date: new Date().toISOString(),
    league: { id: 140, name: 'La Liga', shortName: 'LL', logo: '/leagues/laliga.png', country: 'Spain', season: 2025, type: 'League' },
  },
  {
    id: 3, status: 'HT',
    homeTeam: { id: 85, name: 'Paris SG', shortName: 'PSG', logo: '/teams/psg.png', country: 'France' },
    awayTeam: { id: 1, name: 'Bayern Munich', shortName: 'BAY', logo: '/teams/bayern.png', country: 'Germany' },
    homeScore: 0, awayScore: 1,
    date: new Date().toISOString(),
    league: { id: 2, name: 'Champions League', shortName: 'UCL', logo: '/leagues/ucl.png', country: 'Europe', season: 2025, type: 'Cup' },
  },
];

export default function ScoreTicker() {
  const [matches, setMatches] = useState<Match[]>(MOCK_LIVE);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/matches/live');
        if (res.ok) {
          const { data } = await res.json();
          if (data?.length) setMatches(data);
        }
      } catch { /* keep mock data */ }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!matches.length) return null;

  // Duplicate items for seamless infinite scroll
  const items = [...matches, ...matches];

  return (
    <div className="bg-brand-dark border-b border-brand-border h-9 flex items-center overflow-hidden">
      {/* Left label */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 bg-brand-red h-full z-10">
        <span className="w-2 h-2 rounded-full bg-white animate-live-dot" />
        <span className="text-white text-xs font-bold tracking-widest uppercase">Live</span>
      </div>

      {/* Scrolling ticker */}
      <div className="gr-ticker-wrapper flex-1">
        <div className="gr-ticker-track">
          {items.map((match, i) => (
            <Link
              key={`${match.id}-${i}`}
              href={`/match/${match.id}`}
              className="inline-flex items-center gap-3 px-6 py-1 text-sm hover:bg-brand-card transition-colors border-r border-brand-border flex-shrink-0"
            >
              {/* League */}
              <span className="text-brand-gold text-xs font-semibold">
                {match.league.shortName}
              </span>

              {/* Home */}
              <span className="text-white font-medium">{match.homeTeam.shortName}</span>

              {/* Score */}
              <span
                className={`font-display text-base tracking-wider ${
                  isMatchLive(match.status)
                    ? 'text-brand-red-light'
                    : 'text-brand-gray'
                }`}
              >
                {getScoreDisplay(match)}
              </span>

              {/* Away */}
              <span className="text-white font-medium">{match.awayTeam.shortName}</span>

              {/* Minute / Status */}
              <span
                className={`text-xs font-bold ${
                  match.status === 'HT'
                    ? 'text-brand-gold'
                    : match.status === 'LIVE'
                    ? 'text-live'
                    : 'text-brand-gray'
                }`}
              >
                {match.status === 'HT'
                  ? 'HT'
                  : match.status === 'LIVE'
                  ? `${match.minute}'`
                  : match.status}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Right CTA */}
      <Link
        href="/live-scores"
        className="flex-shrink-0 px-4 h-full flex items-center text-brand-gold text-xs font-bold hover:bg-brand-card transition-colors border-l border-brand-border"
      >
        All Scores →
      </Link>
    </div>
  );
}
