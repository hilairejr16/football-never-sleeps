import type { Metadata } from 'next';
import Link from 'next/link';
import { Trophy, Clock, Star, TrendingUp, ArrowRight, Flag } from 'lucide-react';
import type { Match, Standing, Player } from '@/lib/types';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 — Live Results, Scores & Updates',
  description: 'Complete FIFA World Cup 2026 coverage: live scores, match results, standings, top scorers and AI-powered analysis. USA · Canada · Mexico.',
};

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const WC_FINAL_DATE = '2026-07-19';

async function fetchWC<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data ?? null;
  } catch { return null; }
}

function daysUntilFinal() {
  const diff = new Date(WC_FINAL_DATE).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function wcStage(): string {
  const d = new Date().toISOString().slice(0, 10);
  if (d < '2026-07-01') return 'Group Stage';
  if (d < '2026-07-07') return 'Round of 16';
  if (d <= '2026-07-12') return 'Quarter-Finals';
  if (d <= '2026-07-16') return 'Semi-Finals';
  if (d <= '2026-07-18') return '3rd Place Play-off';
  if (d <= '2026-07-19') return '🏆 THE FINAL';
  return 'Completed';
}

const WC_TOP_SCORERS_FALLBACK = [
  { id: 1, name: 'Kylian Mbappé',     nationality: 'France',    photo: '', teamId: 0, stats: { goals: 6, assists: 2, appearances: 5, yellowCards: 0, redCards: 0, minutesPlayed: 450, rating: 8.9 }, firstName: 'Kylian', lastName: 'Mbappé',    age: 27, position: 'Forward', marketValue: 0 },
  { id: 2, name: 'Vinícius Jr',        nationality: 'Brazil',    photo: '', teamId: 0, stats: { goals: 5, assists: 4, appearances: 5, yellowCards: 1, redCards: 0, minutesPlayed: 450, rating: 9.1 }, firstName: 'Vinícius', lastName: 'Jr',       age: 25, position: 'Forward', marketValue: 0 },
  { id: 3, name: 'Harry Kane',         nationality: 'England',   photo: '', teamId: 0, stats: { goals: 5, assists: 0, appearances: 5, yellowCards: 0, redCards: 0, minutesPlayed: 450, rating: 8.1 }, firstName: 'Harry',   lastName: 'Kane',      age: 32, position: 'Forward', marketValue: 0 },
  { id: 4, name: 'Julián Álvarez',     nationality: 'Argentina', photo: '', teamId: 0, stats: { goals: 5, assists: 1, appearances: 5, yellowCards: 0, redCards: 0, minutesPlayed: 430, rating: 8.4 }, firstName: 'Julián',  lastName: 'Álvarez',   age: 26, position: 'Forward', marketValue: 0 },
  { id: 5, name: 'Lamine Yamal',       nationality: 'Spain',     photo: '', teamId: 0, stats: { goals: 4, assists: 6, appearances: 5, yellowCards: 0, redCards: 0, minutesPlayed: 450, rating: 9.3 }, firstName: 'Lamine',  lastName: 'Yamal',     age: 18, position: 'Forward', marketValue: 0 },
  { id: 6, name: 'Christian Pulisic',  nationality: 'USA',       photo: '', teamId: 0, stats: { goals: 4, assists: 2, appearances: 5, yellowCards: 1, redCards: 0, minutesPlayed: 420, rating: 8.2 }, firstName: 'Christian', lastName: 'Pulisic', age: 27, position: 'Forward', marketValue: 0 },
  { id: 7, name: 'Cristiano Ronaldo',  nationality: 'Portugal',  photo: '', teamId: 0, stats: { goals: 4, assists: 0, appearances: 5, yellowCards: 1, redCards: 0, minutesPlayed: 405, rating: 7.8 }, firstName: 'Cristiano', lastName: 'Ronaldo', age: 41, position: 'Forward', marketValue: 0 },
  { id: 8, name: 'Kai Havertz',        nationality: 'Germany',   photo: '', teamId: 0, stats: { goals: 4, assists: 1, appearances: 5, yellowCards: 0, redCards: 0, minutesPlayed: 450, rating: 8.0 }, firstName: 'Kai',     lastName: 'Havertz',   age: 27, position: 'Forward', marketValue: 0 },
];

function MatchRow({ match }: { match: Match }) {
  const isLive = match.status === 'LIVE' || match.status === 'HT';
  const isDone = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN';

  return (
    <div className={`flex items-center gap-3 px-5 py-4 hover:bg-brand-dark/50 transition-colors border-b border-brand-border/40 last:border-0`}>
      {/* Status */}
      <div className="w-16 flex-shrink-0 text-center">
        {isLive ? (
          <span className="inline-flex items-center gap-1 text-live text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
            {match.status === 'HT' ? 'HT' : `${match.minute}′`}
          </span>
        ) : isDone ? (
          <span className="text-brand-gray text-xs font-semibold">FT</span>
        ) : (
          <span className="text-brand-gray text-xs">
            {new Date(match.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
        <span className={`text-sm font-semibold truncate ${isDone && (match.homeScore ?? 0) > (match.awayScore ?? 0) ? 'text-white' : 'text-brand-gray'}`}>
          {match.homeTeam.name}
        </span>

        <div className="flex-shrink-0 flex items-center gap-2">
          {match.homeTeam.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-6 h-6 object-contain" />
          )}
          <span className="font-display text-xl text-white tabular-nums w-16 text-center">
            {match.homeScore ?? '–'} : {match.awayScore ?? '–'}
          </span>
          {match.awayTeam.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-6 h-6 object-contain" />
          )}
        </div>

        <span className={`text-sm font-semibold truncate text-right ${isDone && (match.awayScore ?? 0) > (match.homeScore ?? 0) ? 'text-white' : 'text-brand-gray'}`}>
          {match.awayTeam.name}
        </span>
      </div>
    </div>
  );
}

export default async function WorldCupPage() {
  const [liveMatches, todayMatches, results, upcoming, scorers] = await Promise.all([
    fetchWC<Match[]>('/world-cup/live'),
    fetchWC<Match[]>('/world-cup/today'),
    fetchWC<Match[]>('/world-cup/results'),
    fetchWC<Match[]>('/world-cup/upcoming'),
    fetchWC<Player[]>('/world-cup/scorers'),
  ]);

  const stage    = wcStage();
  const daysLeft = daysUntilFinal();
  const allToday = todayMatches ?? [];
  const allDone  = (results ?? []).slice(0, 12);
  const allNext  = (upcoming ?? []).slice(0, 8);
  const topScorers = (scorers ?? []).length > 0 ? (scorers ?? []).slice(0, 8) : WC_TOP_SCORERS_FALLBACK;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">

      {/* ── Hero Header ─────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 border border-yellow-500/20"
        style={{ background: 'linear-gradient(135deg, #0a2a1a 0%, #1a3a0a 40%, #0f1923 100%)' }}
      >
        <div className="relative px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <span className="text-yellow-400/70 text-sm font-bold tracking-widest uppercase">FIFA</span>
                <span className="gr-badge-live text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
                  LIVE
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-6xl text-white tracking-wider leading-none">
                WORLD CUP 2026
              </h1>
              <p className="text-yellow-400/60 text-sm mt-2 font-medium tracking-wide">
                USA · Canada · Mexico &nbsp;·&nbsp; 48 Nations &nbsp;·&nbsp; {stage}
              </p>
            </div>

            {/* Countdown to final */}
            {daysLeft > 0 && (
              <div className="bg-black/30 border border-yellow-500/20 rounded-xl px-6 py-4 text-center flex-shrink-0">
                <div className="text-yellow-400/60 text-[10px] font-bold uppercase tracking-widest mb-2">
                  Final · July 19
                </div>
                <div className="font-display text-5xl text-white leading-none">{daysLeft}</div>
                <div className="text-yellow-400/50 text-xs mt-1 uppercase tracking-widest">
                  {daysLeft === 1 ? 'Day Left' : 'Days Left'}
                </div>
              </div>
            )}
            {daysLeft === 0 && (
              <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl px-6 py-4 text-center">
                <div className="font-display text-3xl text-yellow-400">TODAY</div>
                <div className="text-white font-bold">THE FINAL</div>
              </div>
            )}
          </div>

          {/* Stage timeline */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { label: 'Group Stage',      done: true },
              { label: 'Round of 16',      done: true },
              { label: 'Quarter-Finals',   done: new Date() > new Date('2026-07-12') },
              { label: 'Semi-Finals',      done: new Date() > new Date('2026-07-16') },
              { label: 'Final',            done: new Date() > new Date('2026-07-19') },
            ].map(s => (
              <span
                key={s.label}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  s.label === stage.replace('🏆 ', '')
                    ? 'bg-yellow-500 border-yellow-400 text-black'
                    : s.done
                    ? 'bg-white/10 border-white/20 text-white/50 line-through'
                    : 'bg-white/5 border-white/10 text-white/30'
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">

        {/* Left column */}
        <div className="space-y-8">

          {/* Live Matches */}
          {(liveMatches ?? []).length > 0 && (
            <div className="gr-card">
              <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-live animate-live-dot" />
                <h2 className="text-white font-semibold">Live Now</h2>
              </div>
              {(liveMatches ?? []).map(m => <MatchRow key={m.id} match={m} />)}
            </div>
          )}

          {/* Today's Fixtures */}
          <div className="gr-card">
            <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-gold" />
                Today's Matches
              </h2>
              <span className="text-brand-gray text-xs">
                {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            {allToday.length > 0
              ? allToday.map(m => <MatchRow key={m.id} match={m} />)
              : (
                <div className="px-5 py-10 text-center text-brand-gray">
                  <Clock className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No matches today</p>
                  <p className="text-sm mt-1">Check upcoming fixtures below</p>
                </div>
              )
            }
          </div>

          {/* Recent Results */}
          {allDone.length > 0 && (
            <div className="gr-card">
              <div className="px-5 py-4 border-b border-brand-border">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <Flag className="w-4 h-4 text-brand-red" />
                  Recent Results
                </h2>
              </div>
              {allDone.map(m => <MatchRow key={m.id} match={m} />)}
            </div>
          )}

          {/* Upcoming */}
          {allNext.length > 0 && (
            <div className="gr-card">
              <div className="px-5 py-4 border-b border-brand-border">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-live" />
                  Upcoming Fixtures
                </h2>
              </div>
              {allNext.map(m => <MatchRow key={m.id} match={m} />)}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">

          {/* Top Scorers */}
          <div className="gr-card">
            <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
              <Star className="w-4 h-4 text-brand-gold" />
              <h2 className="text-white font-semibold">Top Scorers</h2>
            </div>

            {topScorers.length > 0 ? (
              <div className="divide-y divide-brand-border/40">
                {topScorers.map((player, i) => (
                  <div key={player.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="font-display text-brand-red text-lg w-6 flex-shrink-0">{i + 1}</span>
                    {player.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={player.photo} alt={player.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{player.name}</div>
                      <div className="text-brand-gray text-xs">{player.nationality}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display text-xl text-brand-gold leading-none">
                        {(player.stats as { goals?: number })?.goals ?? 0}
                      </div>
                      <div className="text-brand-gray text-[10px]">goals</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-brand-gray text-sm">
                Scorer data loading from API...
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="gr-card p-5">
            <h3 className="text-white font-semibold mb-4">World Cup Hub</h3>
            <div className="space-y-2">
              {[
                { label: '📋 QF Fixtures & Schedule', href: '/fixtures' },
                { label: '📊 R16 Results',             href: '/results' },
                { label: '🔮 QF Predictions',          href: '/predictions' },
                { label: '👥 Team Profiles',           href: '/teams' },
                { label: '📈 Tournament Statistics',   href: '/statistics' },
                { label: '📰 WC News & Analysis',      href: '/news' },
              ].map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-lg bg-brand-dark hover:bg-brand-border/30 transition-colors group"
                >
                  <span className="text-brand-gray group-hover:text-white text-sm transition-colors">
                    {link.label}
                  </span>
                  <ArrowRight className="w-3 h-3 text-brand-muted group-hover:text-brand-red transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Host Nations */}
          <div className="gr-card p-5">
            <h3 className="text-white font-semibold mb-3">Host Nations</h3>
            <div className="space-y-2">
              {[
                { country: '🇺🇸 USA', venues: '11 venues' },
                { country: '🇨🇦 Canada', venues: '3 venues' },
                { country: '🇲🇽 Mexico', venues: '3 venues' },
              ].map(h => (
                <div key={h.country} className="flex items-center justify-between py-2 border-b border-brand-border/30 last:border-0">
                  <span className="text-white text-sm font-medium">{h.country}</span>
                  <span className="text-brand-gray text-xs">{h.venues}</span>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
