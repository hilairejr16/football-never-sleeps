import type { Metadata } from 'next';
import Link from 'next/link';
import { Trophy, Clock, Star, TrendingUp, ArrowRight, Flag, Newspaper, Calendar } from 'lucide-react';
import type { Match, Player } from '@/lib/types';
import WCSummaryPlayer from '@/components/ui/WCSummaryPlayer';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 — Live Results, Scores & Updates',
  description: 'Complete FIFA World Cup 2026 coverage: live scores, match results, standings, top scorers and AI-powered analysis. USA · Canada · Mexico.',
  alternates: { canonical: '/world-cup' },
};

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';
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
  if (d <= '2026-07-03') return 'Group Stage';
  if (d <= '2026-07-07') return 'Round of 16';
  if (d <= '2026-07-12') return 'Quarter-Finals';
  if (d <= '2026-07-16') return 'Semi-Finals';
  if (d <= '2026-07-18') return '3rd Place Play-off';
  if (d <= '2026-07-19') return '🏆 THE FINAL';
  return 'Completed';
}

// ── Local match shape for knockout data (avoids full Match type requirement) ──
interface KnockoutMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'FT' | 'AET' | 'PEN' | 'SCHEDULED';
  date: string;
  venue: string;
}

// ── Hardcoded tournament data ────────────────────────────────────────────────

// Round of 16 — confirmed results (Jul 4-7 2026)
const WC_R16: KnockoutMatch[] = [
  { id: 'r16_1', homeTeam: 'Morocco',     awayTeam: 'Canada',      homeScore: 3, awayScore: 0, status: 'FT',  date: '2026-07-04T19:00:00Z', venue: 'AT&T Stadium, Dallas' },
  { id: 'r16_2', homeTeam: 'France',      awayTeam: 'Paraguay',    homeScore: 1, awayScore: 0, status: 'FT',  date: '2026-07-04T23:00:00Z', venue: 'MetLife Stadium, NJ' },
  { id: 'r16_3', homeTeam: 'Norway',      awayTeam: 'Brazil',      homeScore: 2, awayScore: 0, status: 'FT',  date: '2026-07-05T19:00:00Z', venue: 'Rose Bowl, CA' },
  { id: 'r16_4', homeTeam: 'England',     awayTeam: 'Mexico',      homeScore: 3, awayScore: 2, status: 'FT',  date: '2026-07-05T23:00:00Z', venue: 'AT&T Stadium, Dallas' },
  { id: 'r16_5', homeTeam: 'Spain',       awayTeam: 'Portugal',    homeScore: 1, awayScore: 0, status: 'FT',  date: '2026-07-06T19:00:00Z', venue: 'SoFi Stadium, Inglewood' },
  { id: 'r16_6', homeTeam: 'Belgium',     awayTeam: 'USA',         homeScore: 4, awayScore: 1, status: 'FT',  date: '2026-07-06T23:00:00Z', venue: 'Levi\'s Stadium, SF' },
  { id: 'r16_7', homeTeam: 'Argentina',   awayTeam: 'Egypt',       homeScore: 3, awayScore: 2, status: 'FT',  date: '2026-07-07T19:00:00Z', venue: 'Hard Rock Stadium, Miami' },
  { id: 'r16_8', homeTeam: 'Switzerland', awayTeam: 'Colombia',    homeScore: 0, awayScore: 0, status: 'PEN', date: '2026-07-07T23:00:00Z', venue: 'Arrowhead Stadium, Kansas City' },
];

// Quarter-Finals — confirmed matchups (Jul 9-11 2026)
const WC_QF: KnockoutMatch[] = [
  { id: 'qf1', homeTeam: 'France',      awayTeam: 'Morocco',     homeScore: null, awayScore: null, status: 'SCHEDULED', date: '2026-07-09T20:00:00Z', venue: 'Gillette Stadium, Boston' },
  { id: 'qf2', homeTeam: 'Spain',       awayTeam: 'Belgium',     homeScore: null, awayScore: null, status: 'SCHEDULED', date: '2026-07-10T19:00:00Z', venue: 'SoFi Stadium, Inglewood CA' },
  { id: 'qf3', homeTeam: 'Norway',      awayTeam: 'England',     homeScore: null, awayScore: null, status: 'SCHEDULED', date: '2026-07-11T21:00:00Z', venue: 'Hard Rock Stadium, Miami' },
  { id: 'qf4', homeTeam: 'Argentina',   awayTeam: 'Switzerland', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '2026-07-12T01:00:00Z', venue: 'Arrowhead Stadium, Kansas City' },
];

// Semi-Finals (Jul 14-15 2026)
const WC_SF: KnockoutMatch[] = [
  { id: 'sf1', homeTeam: 'France/Morocco Winner',  awayTeam: 'Spain/Belgium Winner',     homeScore: null, awayScore: null, status: 'SCHEDULED', date: '2026-07-14T19:00:00Z', venue: 'AT&T Stadium, Dallas' },
  { id: 'sf2', homeTeam: 'Norway/England Winner',  awayTeam: 'Argentina/Switzerland Winner', homeScore: null, awayScore: null, status: 'SCHEDULED', date: '2026-07-15T19:00:00Z', venue: 'Mercedes-Benz Stadium, Atlanta' },
];

const WC_FINAL_FIXTURE: KnockoutMatch = {
  id: 'final', homeTeam: 'Semi-Final 1 Winner', awayTeam: 'Semi-Final 2 Winner',
  homeScore: null, awayScore: null, status: 'SCHEDULED',
  date: '2026-07-19T23:00:00Z', venue: 'MetLife Stadium, NJ',
};

const WC_TOP_SCORERS_FALLBACK: Player[] = [
  { id: 1, name: 'Kylian Mbappé',    nationality: 'France',    photo: '', teamId: 0, stats: { goals: 6, assists: 2, appearances: 5, yellowCards: 0, redCards: 0, minutesPlayed: 450, rating: 8.9 }, firstName: 'Kylian',    lastName: 'Mbappé',    age: 27, position: 'Forward', marketValue: 0 },
  { id: 2, name: 'Vinícius Jr',      nationality: 'Brazil',    photo: '', teamId: 0, stats: { goals: 5, assists: 4, appearances: 5, yellowCards: 1, redCards: 0, minutesPlayed: 450, rating: 9.1 }, firstName: 'Vinícius',  lastName: 'Jr',        age: 25, position: 'Forward', marketValue: 0 },
  { id: 3, name: 'Harry Kane',       nationality: 'England',   photo: '', teamId: 0, stats: { goals: 5, assists: 0, appearances: 5, yellowCards: 0, redCards: 0, minutesPlayed: 450, rating: 8.1 }, firstName: 'Harry',     lastName: 'Kane',      age: 32, position: 'Forward', marketValue: 0 },
  { id: 4, name: 'Julián Álvarez',   nationality: 'Argentina', photo: '', teamId: 0, stats: { goals: 5, assists: 1, appearances: 5, yellowCards: 0, redCards: 0, minutesPlayed: 430, rating: 8.4 }, firstName: 'Julián',   lastName: 'Álvarez',   age: 26, position: 'Forward', marketValue: 0 },
  { id: 5, name: 'Lamine Yamal',     nationality: 'Spain',     photo: '', teamId: 0, stats: { goals: 4, assists: 6, appearances: 5, yellowCards: 0, redCards: 0, minutesPlayed: 450, rating: 9.3 }, firstName: 'Lamine',   lastName: 'Yamal',     age: 18, position: 'Forward', marketValue: 0 },
  { id: 6, name: 'Christian Pulisic',nationality: 'USA',       photo: '', teamId: 0, stats: { goals: 4, assists: 2, appearances: 5, yellowCards: 1, redCards: 0, minutesPlayed: 420, rating: 8.2 }, firstName: 'Christian', lastName: 'Pulisic',  age: 27, position: 'Forward', marketValue: 0 },
  { id: 7, name: 'Cristiano Ronaldo',nationality: 'Portugal',  photo: '', teamId: 0, stats: { goals: 4, assists: 0, appearances: 5, yellowCards: 1, redCards: 0, minutesPlayed: 405, rating: 7.8 }, firstName: 'Cristiano', lastName: 'Ronaldo',  age: 41, position: 'Forward', marketValue: 0 },
  { id: 8, name: 'Kai Havertz',      nationality: 'Germany',   photo: '', teamId: 0, stats: { goals: 4, assists: 1, appearances: 5, yellowCards: 0, redCards: 0, minutesPlayed: 450, rating: 8.0 }, firstName: 'Kai',       lastName: 'Havertz',   age: 27, position: 'Forward', marketValue: 0 },
];

const WC_NEWS = [
  { title: "England vs France: The Quarter-Final the World Has Been Waiting For",   category: 'Preview',  timeAgo: '30m ago' },
  { title: "Yamal is the Player of the Tournament — and He's Only 18",              category: 'Analysis', timeAgo: '2h ago' },
  { title: "Brazil vs Argentina: The Super Clásico That Shakes the World",          category: 'Preview',  timeAgo: '3h ago' },
  { title: "Mbappé vs Vinícius: The Golden Boot Race Is Getting Spicy",             category: 'Analysis', timeAgo: '5h ago' },
  { title: "USA's Stunning Run: How America Became the Tournament's Biggest Story", category: 'Report',   timeAgo: '7h ago' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', {
    month: 'short', day: 'numeric', timeZone: 'America/New_York',
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York', hour12: true,
  }) + ' ET';
}

// ── Components ───────────────────────────────────────────────────────────────

function MatchRow({ match }: { match: Match }) {
  const isLive = match.status === 'LIVE' || match.status === 'HT';
  const isDone = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN';

  return (
    <div className="flex items-center gap-3 px-5 py-4 hover:bg-brand-dark/50 transition-colors border-b border-brand-border/40 last:border-0">
      <div className="w-16 flex-shrink-0 text-center">
        {isLive ? (
          <span className="inline-flex items-center gap-1 text-live text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
            {match.status === 'HT' ? 'HT' : `${match.minute}′`}
          </span>
        ) : isDone ? (
          <span className="text-brand-gray text-xs font-semibold">
            {match.status === 'AET' ? 'AET' : match.status === 'PEN' ? 'PEN' : 'FT'}
          </span>
        ) : (
          <span className="text-brand-gold text-xs">
            {new Date(match.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
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

function KnockoutRow({ match, href }: { match: KnockoutMatch; href: string }) {
  const isDone = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN';
  const homeWin = isDone && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWin = isDone && (match.awayScore ?? 0) > (match.homeScore ?? 0);

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-5 py-3.5 hover:bg-brand-dark/50 transition-colors border-b border-brand-border/30 last:border-0 group"
    >
      <div className="w-14 flex-shrink-0 text-center">
        {isDone ? (
          <span className="text-brand-gray text-xs font-semibold">
            {match.status === 'AET' ? 'AET' : match.status === 'PEN' ? 'PEN' : 'FT'}
          </span>
        ) : (
          <div>
            <div className="text-brand-gold text-[10px] font-semibold">{fmtDate(match.date)}</div>
            <div className="text-brand-muted text-[10px]">{fmtTime(match.date)}</div>
          </div>
        )}
      </div>
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <span className={`text-sm font-semibold text-right truncate transition-colors ${homeWin ? 'text-white' : isDone ? 'text-brand-gray' : 'text-white/80 group-hover:text-white'}`}>
          {match.homeTeam}
        </span>
        <span className="font-display text-lg text-white tabular-nums w-14 text-center flex-shrink-0">
          {isDone ? `${match.homeScore} – ${match.awayScore}` : 'vs'}
        </span>
        <span className={`text-sm font-semibold truncate transition-colors ${awayWin ? 'text-white' : isDone ? 'text-brand-gray' : 'text-white/80 group-hover:text-white'}`}>
          {match.awayTeam}
        </span>
      </div>
      <ArrowRight className="w-3 h-3 text-brand-muted group-hover:text-brand-red flex-shrink-0 transition-colors" />
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

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
      <BreadcrumbSchema crumbs={[{ name: 'FIFA World Cup 2026', path: '/world-cup' }]} />

      {/* ── Hero Header ─────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 border border-yellow-500/20"
        style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0d1a4a 40%, #080c1a 100%)' }}
      >
        <div className="relative px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <span className="text-yellow-400/70 text-sm font-bold tracking-widest uppercase">FIFA</span>
                <span className="gr-badge-live text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-dot" />
                  LIVE TOURNAMENT
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-6xl text-white tracking-wider leading-none">
                WORLD CUP 2026
              </h1>
              <p className="text-yellow-400/60 text-sm mt-2 font-medium tracking-wide">
                USA · Canada · Mexico &nbsp;·&nbsp; 48 Nations &nbsp;·&nbsp; {stage}
              </p>
              <div className="mt-3">
                <WCSummaryPlayer
                  stage={stage}
                  daysLeft={daysLeft}
                  topScorers={topScorers.map(p => ({ name: p.name, nationality: p.nationality, goals: (p.stats as { goals?: number })?.goals ?? 0 }))}
                />
              </div>
            </div>

            {daysLeft > 0 && (
              <div className="bg-black/30 border border-yellow-500/20 rounded-xl px-6 py-4 text-center flex-shrink-0">
                <div className="text-yellow-400/60 text-[10px] font-bold uppercase tracking-widest mb-2">Final · July 19</div>
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

          {/* Stage timeline — clickable pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {([
              { label: 'Group Stage',    href: '/results',  key: 'Group Stage' },
              { label: 'Round of 16',    href: '/results',  key: 'Round of 16' },
              { label: 'Quarter-Finals', href: '/fixtures', key: 'Quarter-Finals' },
              { label: 'Semi-Finals',    href: '/fixtures', key: 'Semi-Finals' },
              { label: '🏆 Final',       href: '/fixtures', key: '🏆 THE FINAL' },
            ] as { label: string; href: string; key: string }[]).map((s, i) => {
              const ORDER = ['Group Stage','Round of 16','Quarter-Finals','Semi-Finals','3rd Place Play-off','🏆 THE FINAL','Completed'];
              const stageIdx = ORDER.indexOf(stage);
              const pillIdx  = ORDER.indexOf(s.key);
              const status   = pillIdx < stageIdx ? 'done' : pillIdx === stageIdx ? 'active' : 'upcoming';
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
                    status === 'active'
                      ? 'bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/25'
                      : status === 'done'
                      ? 'bg-blue-900/40 border-blue-700/50 text-blue-400/70 line-through decoration-blue-600/50'
                      : 'bg-white/5 border-white/20 text-white/55 hover:bg-white/10 hover:text-white hover:border-white/30'
                  }`}
                >
                  {status === 'done' && <span className="text-blue-400">✓</span>}
                  {status === 'active' && <span>▶</span>}
                  {status === 'upcoming' && <span className="opacity-50">{i + 1}</span>}
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tournament Bracket ──────────────────────────── */}
      <div className="gr-card mb-8 overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <h2 className="text-white font-semibold">Tournament Bracket</h2>
          <span className="ml-auto text-brand-gray text-xs hidden sm:block">48 teams · USA · Canada · Mexico</span>
        </div>

        {/* Group Stage — collapsed link */}
        <Link
          href="/results"
          className="flex items-center justify-between px-5 py-3 bg-white/3 border-b border-brand-border/40 hover:bg-brand-dark/50 transition-colors group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/50 font-bold flex-shrink-0">✓</span>
            <span className="text-white/50 text-sm font-semibold line-through">Group Stage</span>
            <span className="text-brand-muted text-xs hidden sm:block">Jun 12 – Jul 3 · 12 groups · 48 teams</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-red transition-colors flex-shrink-0" />
        </Link>

        {/* Round of 16 */}
        <div className="border-b border-brand-border/40">
          <Link
            href="/results"
            className="flex items-center justify-between px-5 py-3 bg-white/3 hover:bg-brand-dark/40 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/50 font-bold flex-shrink-0">✓</span>
              <span className="text-white/60 text-sm font-semibold line-through">Round of 16</span>
              <span className="text-brand-muted text-xs">Jul 4–7 · All 8 matches complete</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-red transition-colors" />
          </Link>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {WC_R16.map(m => <KnockoutRow key={m.id} match={m} href="/results" />)}
          </div>
        </div>

        {/* Quarter-Finals */}
        <div className="border-b border-brand-border/40">
          <div className="flex items-center justify-between px-5 py-3 bg-yellow-500/5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-[10px] text-yellow-400 font-bold flex-shrink-0">▶</span>
              <span className="text-yellow-400 text-sm font-bold">Quarter-Finals</span>
              <span className="text-yellow-400/50 text-xs">Jul 10–12 · 4 matches</span>
            </div>
            <Link href="/fixtures" className="text-yellow-400 text-xs font-semibold hover:text-yellow-300 transition-colors">
              Fixtures →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {WC_QF.map(m => <KnockoutRow key={m.id} match={m} href="/fixtures" />)}
          </div>
        </div>

        {/* Semi-Finals */}
        <div className="border-b border-brand-border/40">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/25 font-bold flex-shrink-0">○</span>
              <span className="text-white/40 text-sm font-semibold">Semi-Finals</span>
              <span className="text-brand-muted text-xs">Jul 14–15 · Winners TBD</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {WC_SF.map(m => <KnockoutRow key={m.id} match={m} href="/fixtures" />)}
          </div>
        </div>

        {/* Final */}
        <div className="bg-yellow-500/3">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400/30 flex-shrink-0" />
              <span className="text-white/40 text-sm font-semibold">🏆 THE FINAL</span>
              <span className="text-brand-muted text-xs">Jul 19 · MetLife Stadium, NJ</span>
            </div>
          </div>
          <KnockoutRow match={WC_FINAL_FIXTURE} href="/fixtures" />
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

          {/* Today / QF Preview */}
          <div className="gr-card">
            <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                {allToday.length > 0
                  ? <><Clock className="w-4 h-4 text-brand-gold" />Today in Football</>
                  : <><Calendar className="w-4 h-4 text-yellow-400" /><span className="text-yellow-400">Quarter-Finals — Full Schedule</span></>
                }
              </h2>
              <span className="text-brand-gray text-xs">
                {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {allToday.length > 0 ? (
              allToday.map(m => <MatchRow key={m.id} match={m} />)
            ) : (
              <div>
                <div className="px-5 py-3 bg-yellow-500/5 border-b border-yellow-500/10 flex items-center gap-3">
                  <span className="text-yellow-400 text-sm">⚡</span>
                  <p className="text-yellow-400 text-sm font-semibold">QF kick-off tomorrow — Jul 10</p>
                  <span className="ml-auto text-yellow-400/50 text-xs">4 matches · 3 days</span>
                </div>
                <div className="divide-y divide-brand-border/40">
                  {WC_QF.map(m => (
                    <Link
                      key={m.id}
                      href="/fixtures"
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-brand-dark/50 transition-colors group"
                    >
                      <div className="w-20 flex-shrink-0">
                        <div className="text-brand-gold text-[11px] font-bold">{fmtDate(m.date)}</div>
                        <div className="text-brand-muted text-[10px]">{fmtTime(m.date)}</div>
                      </div>
                      <div className="flex-1 grid grid-cols-[1fr_28px_1fr] items-center gap-1 min-w-0">
                        <span className="text-white text-sm font-semibold text-right truncate group-hover:text-yellow-400 transition-colors">{m.homeTeam}</span>
                        <span className="text-brand-gray text-xs text-center font-medium">vs</span>
                        <span className="text-white text-sm font-semibold truncate group-hover:text-yellow-400 transition-colors">{m.awayTeam}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-brand-muted group-hover:text-yellow-400 transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-brand-border/40">
                  <Link href="/fixtures" className="flex items-center justify-center gap-1.5 py-1 text-yellow-400 text-sm font-semibold hover:text-yellow-300 transition-colors">
                    Full QF Fixtures & Predictions <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Round of 16 Results */}
          <div className="gr-card">
            <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Flag className="w-4 h-4 text-brand-red" />
                Round of 16 Results
              </h2>
              <Link href="/results" className="text-brand-red text-xs font-semibold hover:text-brand-red-hover transition-colors">
                All Results →
              </Link>
            </div>
            {allDone.length > 0
              ? allDone.map(m => <MatchRow key={m.id} match={m} />)
              : WC_R16.map(m => <KnockoutRow key={m.id} match={m} href="/results" />)
            }
          </div>

          {/* Quarter-Finals Fixtures */}
          <div className="gr-card">
            <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-live" />
                Quarter-Finals
              </h2>
              <Link href="/fixtures" className="text-brand-red text-xs font-semibold hover:text-brand-red-hover transition-colors">
                Full Schedule →
              </Link>
            </div>
            {allNext.length > 0
              ? allNext.map(m => <MatchRow key={m.id} match={m} />)
              : WC_QF.map(m => <KnockoutRow key={m.id} match={m} href="/fixtures" />)
            }
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">

          {/* Top Stories */}
          <div className="gr-card">
            <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-brand-red" />
                <h2 className="text-white font-semibold">Top Stories</h2>
              </div>
              <Link href="/news" className="text-brand-red text-xs font-semibold hover:text-brand-red-hover transition-colors">
                All News →
              </Link>
            </div>
            <div className="divide-y divide-brand-border/40">
              {WC_NEWS.map((article, i) => (
                <Link
                  key={i}
                  href="/news"
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-brand-dark/50 transition-colors group"
                >
                  <span className="font-display text-brand-red text-lg w-5 flex-shrink-0 leading-none mt-0.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-brand-red text-[10px] font-bold uppercase tracking-wide">{article.category}</span>
                      <span className="text-brand-muted text-[10px]">{article.timeAgo}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Scorers */}
          <div className="gr-card">
            <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
              <Star className="w-4 h-4 text-brand-gold" />
              <h2 className="text-white font-semibold">Top Scorers</h2>
            </div>
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
          </div>

          {/* World Cup Hub */}
          <div className="gr-card p-5">
            <h3 className="text-white font-semibold mb-4">World Cup Hub</h3>
            <div className="space-y-2">
              {[
                { label: '📋 QF Fixtures & Schedule', href: '/fixtures' },
                { label: '📊 R16 Results',             href: '/results' },
                { label: '🔮 QF Predictions',          href: '/predictions' },
                { label: '👥 Team Profiles',            href: '/teams' },
                { label: '📈 Tournament Statistics',   href: '/statistics' },
                { label: '📰 WC News & Analysis',      href: '/news' },
              ].map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-lg bg-brand-dark hover:bg-brand-border/30 transition-colors group"
                >
                  <span className="text-brand-gray group-hover:text-white text-sm transition-colors">{link.label}</span>
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
                { country: '🇺🇸 USA',    venues: '11 venues' },
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
