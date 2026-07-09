'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Match } from '@/lib/types';
import { getScoreDisplay, isMatchLive } from '@/lib/utils';

const WC_LEAGUE = { id: 1, name: 'World Cup 2026', shortName: 'WC26', logo: '', country: 'World', season: 2026, type: 'Cup' as const };

const MOCK_LIVE: Match[] = [
  {
    id: 101, status: 'FT',
    homeTeam: { id: 10, name: 'Spain',    shortName: 'ESP', logo: '', country: 'Spain' },
    awayTeam: { id: 11, name: 'Japan',    shortName: 'JPN', logo: '', country: 'Japan' },
    homeScore: 2, awayScore: 0,
    date: new Date('2026-07-04T23:00:00Z').toISOString(),
    league: WC_LEAGUE,
  },
  {
    id: 102, status: 'FT',
    homeTeam: { id: 12, name: 'France',   shortName: 'FRA', logo: '', country: 'France' },
    awayTeam: { id: 13, name: 'Poland',   shortName: 'POL', logo: '', country: 'Poland' },
    homeScore: 4, awayScore: 1,
    date: new Date('2026-07-05T23:00:00Z').toISOString(),
    league: WC_LEAGUE,
  },
  {
    id: 103, status: 'FT',
    homeTeam: { id: 14, name: 'Brazil',   shortName: 'BRA', logo: '', country: 'Brazil' },
    awayTeam: { id: 15, name: 'Mexico',   shortName: 'MEX', logo: '', country: 'Mexico' },
    homeScore: 3, awayScore: 1,
    date: new Date('2026-07-06T23:00:00Z').toISOString(),
    league: WC_LEAGUE,
  },
  {
    id: 104, status: 'FT',
    homeTeam: { id: 16, name: 'Argentina',shortName: 'ARG', logo: '', country: 'Argentina' },
    awayTeam: { id: 17, name: 'Morocco',  shortName: 'MAR', logo: '', country: 'Morocco' },
    homeScore: 2, awayScore: 1,
    date: new Date('2026-07-06T19:00:00Z').toISOString(),
    league: WC_LEAGUE,
  },
  {
    id: 105, status: 'FT',
    homeTeam: { id: 18, name: 'Portugal', shortName: 'POR', logo: '', country: 'Portugal' },
    awayTeam: { id: 19, name: 'Switzerland', shortName: 'SUI', logo: '', country: 'Switzerland' },
    homeScore: 3, awayScore: 0,
    date: new Date('2026-07-07T23:00:00Z').toISOString(),
    league: WC_LEAGUE,
  },
  {
    id: 106, status: 'FT',
    homeTeam: { id: 20, name: 'USA',      shortName: 'USA', logo: '', country: 'USA' },
    awayTeam: { id: 21, name: 'Iran',     shortName: 'IRN', logo: '', country: 'Iran' },
    homeScore: 2, awayScore: 1,
    date: new Date('2026-07-07T19:00:00Z').toISOString(),
    league: WC_LEAGUE,
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
