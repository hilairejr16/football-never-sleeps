'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy, Clock, Zap } from 'lucide-react';
import type { Match } from '@/lib/types';

const WC_FINAL = new Date('2026-07-19T00:00:00Z');
const BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

const WC_NEXT_FIXTURES = [
  { home: 'Spain',     away: 'Germany',   date: 'Jul 10', time: '3 PM ET' },
  { home: 'France',   away: 'England',   date: 'Jul 10', time: '7 PM ET' },
  { home: 'Brazil',   away: 'Argentina', date: 'Jul 11', time: '3 PM ET' },
  { home: 'Portugal', away: 'USA',       date: 'Jul 12', time: '7 PM ET' },
];

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = WC_FINAL.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, mins: 0 }); return; }
      setTimeLeft({
        days:  Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        mins:  Math.floor((diff % 3_600_000) / 60_000),
      });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl sm:text-4xl text-white leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-200/70 mt-1">{label}</div>
    </div>
  );
}

function wcStage(): string {
  const d = new Date().toISOString().slice(0, 10);
  if (d <= '2026-07-02') return 'Group Stage';
  if (d <= '2026-07-07') return 'Round of 16';
  if (d <= '2026-07-12') return 'Quarter-Finals';
  if (d <= '2026-07-16') return 'Semi-Finals';
  if (d <= '2026-07-18') return '3rd Place';
  if (d === '2026-07-19') return '🏆 THE FINAL';
  return 'Completed';
}

export default function WorldCupBanner() {
  const countdown = useCountdown();
  const [todayMatches, setTodayMatches] = useState<Match[]>([]);
  const [stage] = useState(wcStage);

  useEffect(() => {
    fetch(`${BASE}/world-cup/today`)
      .then(r => r.json())
      .then(({ data }) => { if (Array.isArray(data)) setTodayMatches(data); })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-yellow-500/20">
      {/* Background gradient — deep green to gold, World Cup colours */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #0a0f2e 0%, #0d1a4a 30%, #080c1a 60%, #0a0c1e 100%)',
        }}
      />
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #f4a261 0, #f4a261 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative max-w-screen-2xl mx-auto px-4 lg:px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">

          {/* Left — Title + stage */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold tracking-widest text-yellow-400 uppercase">FIFA</span>
                <span className="gr-badge-live text-[10px] py-0.5 px-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
                  LIVE TOURNAMENT
                </span>
              </div>
              <h2 className="text-white font-display text-2xl sm:text-3xl tracking-wider leading-none">
                WORLD CUP 2026
              </h2>
              <div className="text-yellow-400/80 text-xs font-semibold mt-0.5 tracking-wide">
                USA · Canada · Mexico &nbsp;·&nbsp; {stage}
              </div>
            </div>
          </div>

          {/* Center — Today's matches */}
          <div className="flex-1 min-w-0">
            {todayMatches.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {todayMatches.slice(0, 4).map(match => (
                  <div
                    key={match.id}
                    className="flex-shrink-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 min-w-[160px]"
                  >
                    <div className="text-[10px] text-yellow-400/60 font-semibold uppercase tracking-wider mb-1.5">
                      {match.status === 'LIVE'
                        ? <span className="text-live">{match.minute}′ LIVE</span>
                        : match.status === 'FT' ? 'Full Time'
                        : match.status === 'HT' ? 'Half Time'
                        : new Date(match.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) + ' UTC'}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white text-xs font-semibold truncate">{match.homeTeam.shortName}</span>
                      <span className="text-white font-display text-base leading-none flex-shrink-0">
                        {match.homeScore ?? '–'}:{match.awayScore ?? '–'}
                      </span>
                      <span className="text-white text-xs font-semibold truncate text-right">{match.awayTeam.shortName}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-yellow-400/70 text-xs font-bold uppercase tracking-widest mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  Quarter-Finals — Jul 10–12
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {WC_NEXT_FIXTURES.map(f => (
                    <div
                      key={f.home}
                      className="flex-shrink-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 min-w-[150px]"
                    >
                      <div className="text-[10px] text-yellow-400/50 font-semibold mb-1">{f.date} · {f.time}</div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-white text-xs font-semibold truncate">{f.home}</span>
                        <span className="text-white/30 text-[10px] flex-shrink-0">vs</span>
                        <span className="text-white text-xs font-semibold truncate text-right">{f.away}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Countdown + CTA */}
          <div className="flex items-center gap-6 flex-shrink-0">
            {/* Countdown */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-[10px] font-bold text-yellow-400/50 uppercase tracking-widest leading-tight text-right">
                Final<br />July 19
              </div>
              <div className="flex items-center gap-2">
                <CountUnit value={countdown.days}  label="Days" />
                <span className="text-yellow-500/40 font-display text-2xl">:</span>
                <CountUnit value={countdown.hours} label="Hrs" />
                <span className="text-yellow-500/40 font-display text-2xl">:</span>
                <CountUnit value={countdown.mins}  label="Min" />
              </div>
            </div>

            <Link
              href="/world-cup"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm px-4 py-2.5 rounded-lg transition-all whitespace-nowrap active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Full Hub
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
