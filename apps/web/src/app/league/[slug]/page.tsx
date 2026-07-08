import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Trophy, ArrowRight } from 'lucide-react';

export const revalidate = 300;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const LEAGUE_MAP: Record<string, { id: number; name: string; flag: string; country: string; season: number; note?: string }> = {
  'premier-league':    { id: 39,  name: 'Premier League',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England',  season: 2025, note: 'Season on hold — summer break' },
  'la-liga':           { id: 140, name: 'La Liga',            flag: '🇪🇸', country: 'Spain',    season: 2025, note: 'Season on hold — summer break' },
  'serie-a':           { id: 135, name: 'Serie A',            flag: '🇮🇹', country: 'Italy',    season: 2025, note: 'Season on hold — summer break' },
  'bundesliga':        { id: 78,  name: 'Bundesliga',         flag: '🇩🇪', country: 'Germany',  season: 2025, note: 'Season on hold — summer break' },
  'ligue-1':           { id: 61,  name: 'Ligue 1',            flag: '🇫🇷', country: 'France',   season: 2025, note: 'Season on hold — summer break' },
  'champions-league':  { id: 2,   name: 'Champions League',   flag: '⭐', country: 'Europe',   season: 2025, note: '2025/26 draw in August' },
  'europa-league':     { id: 3,   name: 'Europa League',      flag: '🌟', country: 'Europe',   season: 2025, note: '2025/26 draw in August' },
  'mls':               { id: 253, name: 'MLS',                flag: '🇺🇸', country: 'USA',      season: 2026, note: 'Suspended for World Cup' },
  'saudi-pro-league':  { id: 307, name: 'Saudi Pro League',   flag: '🇸🇦', country: 'Saudi Arabia', season: 2025, note: 'Season complete' },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const league = LEAGUE_MAP[params.slug];
  if (!league) return { title: 'League — GoalRush Global' };
  return {
    title: `${league.name} — GoalRush Global`,
    description: `${league.name} ${league.season} standings, fixtures, results and news on GoalRush Global.`,
  };
}

async function fetchStandings(leagueId: number, season: number) {
  try {
    const res = await fetch(`${BASE}/leagues/${leagueId}/standings?season=${season}`, { next: { revalidate: 300 } });
    if (res.ok) { const { data } = await res.json(); return data ?? []; }
  } catch {}
  return [];
}

const OTHER_LEAGUES = [
  { slug: 'premier-league',   name: 'Premier League',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { slug: 'la-liga',          name: 'La Liga',           flag: '🇪🇸' },
  { slug: 'serie-a',          name: 'Serie A',           flag: '🇮🇹' },
  { slug: 'bundesliga',       name: 'Bundesliga',        flag: '🇩🇪' },
  { slug: 'ligue-1',          name: 'Ligue 1',           flag: '🇫🇷' },
  { slug: 'champions-league', name: 'Champions League',  flag: '⭐' },
  { slug: 'mls',              name: 'MLS',               flag: '🇺🇸' },
];

export default async function LeaguePage({ params }: { params: { slug: string } }) {
  if (params.slug === 'world-cup') redirect('/world-cup');

  const league = LEAGUE_MAP[params.slug];
  if (!league) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-20 text-center">
        <h1 className="text-3xl font-display text-white mb-4">League Not Found</h1>
        <p className="text-brand-gray mb-6">We don't have coverage for this league yet.</p>
        <Link href="/" className="gr-btn-primary px-8">Back to Home</Link>
      </div>
    );
  }

  const standings = await fetchStandings(league.id, league.season);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="gr-card p-6 mb-8 border border-brand-border/50">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{league.flag}</span>
          <div>
            <h1 className="text-3xl font-display tracking-wider text-white">{league.name.toUpperCase()}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-brand-gray text-sm">{league.country}</span>
              <span className="text-brand-muted">·</span>
              <span className="text-brand-gray text-sm">Season {league.season}/{league.season + 1 - 2000}</span>
            </div>
          </div>
        </div>
        {league.note && (
          <div className="mt-4 px-4 py-3 bg-brand-dark rounded-lg border border-brand-gold/20">
            <p className="text-brand-gold text-sm font-semibold">{league.note}</p>
            <p className="text-brand-gray text-xs mt-1">
              All European top-flight leagues are on summer break for the FIFA World Cup 2026 (July). New seasons begin August 2026.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          {/* Standings / WC notice */}
          {standings.length > 0 ? (
            <div className="gr-card">
              <div className="px-5 py-4 border-b border-brand-border">
                <h2 className="text-white font-semibold">Final Standings {league.season}/{league.season - 1999}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-brand-border">
                    {['#','Team','P','W','D','L','GF','GA','GD','Pts'].map(h=>(
                      <th key={h} className="px-3 py-3 text-brand-gray text-xs font-semibold text-left">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody className="divide-y divide-brand-border/40">
                    {standings.map((row: {rank:number;team:{name:string};played:number;won:number;drawn:number;lost:number;goalsFor:number;goalsAgainst:number;goalDiff:number;points:number}) => (
                      <tr key={row.rank} className="hover:bg-brand-dark/30">
                        <td className="px-3 py-3 text-brand-gray">{row.rank}</td>
                        <td className="px-3 py-3 text-white font-semibold">{row.team.name}</td>
                        <td className="px-3 py-3 text-brand-gray">{row.played}</td>
                        <td className="px-3 py-3 text-brand-gray">{row.won}</td>
                        <td className="px-3 py-3 text-brand-gray">{row.drawn}</td>
                        <td className="px-3 py-3 text-brand-gray">{row.lost}</td>
                        <td className="px-3 py-3 text-brand-gray">{row.goalsFor}</td>
                        <td className="px-3 py-3 text-brand-gray">{row.goalsAgainst}</td>
                        <td className="px-3 py-3 text-brand-gray">{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}</td>
                        <td className="px-3 py-3 text-white font-bold">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="gr-card p-10 text-center">
              <Trophy className="w-12 h-12 text-yellow-400/30 mx-auto mb-4"/>
              <h2 className="text-white font-semibold text-lg mb-2">Season Data Loading</h2>
              <p className="text-brand-gray text-sm mb-6">
                {league.name} {league.season}/{league.season - 1999} standings will appear here once the API is connected.
                All leagues are currently on summer break for World Cup 2026.
              </p>
              <Link href="/world-cup" className="gr-btn-primary px-6 inline-flex items-center gap-2">
                <Trophy className="w-4 h-4"/>World Cup Hub
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar — other leagues */}
        <aside>
          <div className="gr-card p-5">
            <h3 className="text-white font-semibold mb-4">Other Leagues</h3>
            <div className="space-y-1">
              {OTHER_LEAGUES.filter(l => l.slug !== params.slug).map(l => (
                <Link key={l.slug} href={`/league/${l.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-dark transition-colors group">
                  <span className="text-xl">{l.flag}</span>
                  <span className="text-brand-gray group-hover:text-white text-sm transition-colors">{l.name}</span>
                  <ArrowRight className="w-3 h-3 text-brand-muted group-hover:text-brand-red ml-auto transition-colors"/>
                </Link>
              ))}
              <Link href="/world-cup"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/20 hover:bg-yellow-500/10 transition-colors group mt-2">
                <span className="text-xl">🏆</span>
                <span className="text-yellow-400 text-sm font-semibold">World Cup 2026</span>
                <ArrowRight className="w-3 h-3 text-yellow-500/50 group-hover:text-yellow-400 ml-auto transition-colors"/>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
