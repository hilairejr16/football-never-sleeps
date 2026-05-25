'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn, formatMatchDate, getMatchStatusLabel, isMatchLive } from '@/lib/utils';
import type { Match } from '@/lib/types';

interface MatchCardProps {
  match: Match;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

function TeamBlock({
  team,
  score,
  isHome,
}: {
  team: Match['homeTeam'];
  score: number | null;
  isHome: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        isHome ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src={team.logo || '/placeholder-team.png'}
          alt={team.name}
          fill
          className="object-contain"
        />
      </div>
      <div className={cn('min-w-0', isHome ? 'text-left' : 'text-right')}>
        <div className="text-white font-semibold text-sm truncate max-w-[100px]">
          {team.shortName}
        </div>
      </div>
      {score !== null && (
        <div className="gr-score text-2xl">{score}</div>
      )}
    </div>
  );
}

export default function MatchCard({
  match,
  variant = 'default',
  className,
}: MatchCardProps) {
  const live = isMatchLive(match.status);

  if (variant === 'compact') {
    return (
      <Link
        href={`/match/${match.id}`}
        className={cn(
          'group flex items-center justify-between px-4 py-3 bg-brand-card border border-brand-border rounded-lg hover:border-brand-red/40 transition-all',
          className
        )}
      >
        {/* Home */}
        <div className="flex items-center gap-2 w-2/5">
          <div className="relative w-7 h-7">
            <Image src={match.homeTeam.logo || '/placeholder-team.png'} alt={match.homeTeam.name} fill className="object-contain" />
          </div>
          <span className="text-white text-sm font-medium truncate">
            {match.homeTeam.shortName}
          </span>
        </div>

        {/* Score / Status */}
        <div className="text-center flex-shrink-0">
          {match.homeScore !== null ? (
            <span className={cn('font-display text-lg tracking-wider', live ? 'text-brand-red-light' : 'text-white')}>
              {match.homeScore} - {match.awayScore}
            </span>
          ) : (
            <span className="text-brand-gray text-xs">{formatMatchDate(match.date)}</span>
          )}
          {live && (
            <div className="text-live text-xs font-bold text-center">
              {match.status === 'HT' ? 'HT' : `${match.minute}'`}
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 justify-end w-2/5">
          <span className="text-white text-sm font-medium truncate">
            {match.awayTeam.shortName}
          </span>
          <div className="relative w-7 h-7">
            <Image src={match.awayTeam.logo || '/placeholder-team.png'} alt={match.awayTeam.name} fill className="object-contain" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/match/${match.id}`}
        className={cn(
          'group gr-card p-6 bg-hero-gradient',
          live && 'border-brand-red/30 glow-red',
          className
        )}
      >
        {/* League + Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5">
              <Image src={match.league.logo || '/placeholder-league.png'} alt={match.league.name} fill className="object-contain" />
            </div>
            <span className="text-brand-gold text-xs font-semibold">{match.league.name}</span>
          </div>
          <div>
            {live ? (
              <span className="gr-badge-live">
                <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
                {match.status === 'HT' ? 'Half Time' : `${match.minute}'`}
              </span>
            ) : (
              <span className="text-brand-gray text-xs">{formatMatchDate(match.date)}</span>
            )}
          </div>
        </div>

        {/* Teams & Scores */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="relative w-16 h-16">
              <Image src={match.homeTeam.logo || '/placeholder-team.png'} alt={match.homeTeam.name} fill className="object-contain" />
            </div>
            <span className="text-white font-semibold text-sm text-center">{match.homeTeam.name}</span>
          </div>

          <div className="text-center flex-shrink-0">
            {match.homeScore !== null ? (
              <div className={cn('font-display text-5xl tracking-widest', live ? 'text-brand-red-light animate-score-flash' : 'text-white')}>
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="text-brand-gold font-display text-2xl">VS</div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="relative w-16 h-16">
              <Image src={match.awayTeam.logo || '/placeholder-team.png'} alt={match.awayTeam.name} fill className="object-contain" />
            </div>
            <span className="text-white font-semibold text-sm text-center">{match.awayTeam.name}</span>
          </div>
        </div>

        {/* Venue */}
        {match.venue && (
          <div className="text-center mt-4 text-brand-gray text-xs">
            {match.venue}
          </div>
        )}
      </Link>
    );
  }

  // Default
  return (
    <Link
      href={`/match/${match.id}`}
      className={cn('group gr-card p-4', live && 'border-brand-red/30', className)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="relative w-4 h-4">
            <Image src={match.league.logo || '/placeholder-league.png'} alt={match.league.name} fill className="object-contain" />
          </div>
          <span className="text-brand-gray text-xs">{match.league.shortName}</span>
        </div>
        {live ? (
          <span className="gr-badge-live text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
            {match.status === 'HT' ? 'HT' : `${match.minute}'`}
          </span>
        ) : (
          <span className="text-brand-gray text-xs">{formatMatchDate(match.date)}</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <TeamBlock team={match.homeTeam} score={match.homeScore} isHome />
        <span className="text-brand-muted text-sm px-2">–</span>
        <TeamBlock team={match.awayTeam} score={match.awayScore} isHome={false} />
      </div>
    </Link>
  );
}
