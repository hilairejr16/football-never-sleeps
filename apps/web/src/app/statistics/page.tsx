import type { Metadata } from 'next';
import { BarChart2, Target, TrendingUp, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'World Cup 2026 Statistics',
  description: 'Top scorers, assists leaders, clean sheets, and advanced team stats from FIFA World Cup 2026.',
};

export const revalidate = 300;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function fetchScorers() {
  try {
    const res = await fetch(`${BASE}/world-cup/scorers`, { next: { revalidate: 300 } });
    if (res.ok) { const { data } = await res.json(); return data ?? []; }
  } catch {}
  return [];
}

const TOP_SCORERS = [
  { rank: 1, name: 'Kylian Mbappé',    team: 'France',   flag: '🇫🇷', goals: 6, assists: 2, shots: 22, rating: 8.9 },
  { rank: 2, name: 'Vinícius Jr',      team: 'Brazil',   flag: '🇧🇷', goals: 5, assists: 4, shots: 18, rating: 9.1 },
  { rank: 3, name: 'Julián Álvarez',   team: 'Argentina',flag: '🇦🇷', goals: 5, assists: 1, shots: 14, rating: 8.4 },
  { rank: 4, name: 'Lamine Yamal',     team: 'Spain',    flag: '🇪🇸', goals: 4, assists: 6, shots: 16, rating: 9.3 },
  { rank: 5, name: 'Harry Kane',       team: 'England',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 5, assists: 0, shots: 13, rating: 8.1 },
  { rank: 6, name: 'Christian Pulisic',team: 'USA',      flag: '🇺🇸', goals: 4, assists: 2, shots: 11, rating: 8.2 },
  { rank: 7, name: 'Cristiano Ronaldo',team: 'Portugal', flag: '🇵🇹', goals: 4, assists: 0, shots: 17, rating: 7.8 },
  { rank: 8, name: 'Kai Havertz',      team: 'Germany',  flag: '🇩🇪', goals: 4, assists: 1, shots: 12, rating: 8.0 },
];

const TOP_ASSISTS = [
  { rank: 1, name: 'Lionel Messi',    team: 'Argentina',flag: '🇦🇷', assists: 6, goals: 4, passes: 412 },
  { rank: 2, name: 'Lamine Yamal',    team: 'Spain',    flag: '🇪🇸', assists: 6, goals: 4, passes: 387 },
  { rank: 3, name: 'Kevin De Bruyne', team: 'Belgium',  flag: '🇧🇪', assists: 4, goals: 1, passes: 401 },
  { rank: 4, name: 'Vinícius Jr',     team: 'Brazil',   flag: '🇧🇷', assists: 4, goals: 5, passes: 298 },
  { rank: 5, name: 'Bruno Fernandes', team: 'Portugal', flag: '🇵🇹', assists: 5, goals: 2, passes: 356 },
];

const TEAM_STATS = [
  { team: 'Brazil',    flag: '🇧🇷', goals: 16, conceded: 4,  shots: 87, possession: 61, passes: 2841, rating: 8.1 },
  { team: 'Spain',     flag: '🇪🇸', goals: 14, conceded: 3,  shots: 74, possession: 64, passes: 3102, rating: 8.4 },
  { team: 'France',    flag: '🇫🇷', goals: 13, conceded: 4,  shots: 69, possession: 58, passes: 2790, rating: 7.9 },
  { team: 'Argentina', flag: '🇦🇷', goals: 13, conceded: 5,  shots: 71, possession: 55, passes: 2612, rating: 7.8 },
  { team: 'Portugal',  flag: '🇵🇹', goals: 12, conceded: 4,  shots: 65, possession: 56, passes: 2589, rating: 7.7 },
  { team: 'Germany',   flag: '🇩🇪', goals: 11, conceded: 6,  shots: 62, possession: 57, passes: 2644, rating: 7.6 },
  { team: 'England',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 10, conceded: 5,  shots: 58, possession: 53, passes: 2488, rating: 7.5 },
  { team: 'USA',       flag: '🇺🇸', goals: 8,  conceded: 6,  shots: 52, possession: 48, passes: 2204, rating: 7.3 },
];

const TOURNAMENT_STATS = [
  { label: 'Total Goals', value: '93', sub: '32 matches', icon: '⚽' },
  { label: 'Avg per Game', value: '2.9', sub: 'Above avg', icon: '📊' },
  { label: 'Penalties', value: '18', sub: '14 converted', icon: '🎯' },
  { label: 'VAR Reviews', value: '47', sub: '31 overturned', icon: '📺' },
  { label: 'Yellow Cards', value: '142', sub: '32 matches', icon: '🟨' },
  { label: 'Red Cards', value: '8', sub: 'Direct: 5', icon: '🟥' },
];

export default async function StatisticsPage() {
  await fetchScorers();
  const maxGoals = Math.max(...TOP_SCORERS.map(s => s.goals));

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white flex items-center gap-3 mb-2">
          <BarChart2 className="w-7 h-7 text-brand-gold"/>STATISTICS
        </h1>
        <p className="text-brand-gray">FIFA World Cup 2026 — Through Quarter-Final stage</p>
      </div>

      {/* Tournament overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {TOURNAMENT_STATS.map(s => (
          <div key={s.label} className="gr-card p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-display text-2xl text-white">{s.value}</div>
            <div className="text-white text-xs font-semibold mt-0.5">{s.label}</div>
            <div className="text-brand-gray text-[10px]">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Top Scorers */}
        <div className="gr-card">
          <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-gold"/>
            <h2 className="text-white font-semibold">Top Scorers</h2>
            <span className="text-brand-gray text-xs ml-auto">Goals · Ast · Rating</span>
          </div>
          <div className="divide-y divide-brand-border/40">
            {TOP_SCORERS.map(p => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3.5">
                <span className={`text-xs w-5 font-bold flex-shrink-0 ${p.rank === 1 ? 'text-yellow-400' : 'text-brand-gray'}`}>{p.rank}</span>
                <span className="text-xl flex-shrink-0">{p.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold truncate ${p.rank === 1 ? 'text-white' : 'text-brand-gray'}`}>{p.name}</div>
                  <div className="w-full bg-brand-dark rounded-full h-1 mt-1.5">
                    <div className="h-full bg-brand-gold rounded-full" style={{ width: `${(p.goals / maxGoals) * 100}%` }}/>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-display text-lg text-white tabular-nums">{p.goals}</div>
                </div>
                <div className="text-brand-gray text-xs w-5 text-center flex-shrink-0">{p.assists}</div>
                <div className={`text-xs w-8 text-right font-semibold flex-shrink-0 ${p.rating >= 9 ? 'text-yellow-400' : p.rating >= 8.5 ? 'text-emerald-400' : 'text-brand-gray'}`}>{p.rating}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Assists + Team Goals */}
        <div className="flex flex-col gap-6">
          <div className="gr-card flex-1">
            <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-gold"/>
              <h2 className="text-white font-semibold">Top Assists</h2>
            </div>
            <div className="divide-y divide-brand-border/40">
              {TOP_ASSISTS.map(p => (
                <div key={p.name} className="flex items-center gap-3 px-5 py-3">
                  <span className={`text-xs w-5 font-bold flex-shrink-0 ${p.rank === 1 ? 'text-yellow-400' : 'text-brand-gray'}`}>{p.rank}</span>
                  <span className="text-xl flex-shrink-0">{p.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{p.name}</div>
                    <div className="text-brand-gray text-xs">{p.team}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-display text-lg text-white tabular-nums">{p.assists}</div>
                    <div className="text-brand-gray text-xs">{p.goals}G</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team stats table */}
      <div className="gr-card mb-8">
        <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-gold"/>
          <h2 className="text-white font-semibold">Team Statistics</h2>
          <span className="text-brand-gray text-xs ml-auto">QF Teams Ranked by Goals</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                {['Team','GF','GA','Shots','Poss%','Passes','Avg Rating'].map(h => (
                  <th key={h} className="px-4 py-3 text-brand-gray text-xs font-semibold text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {TEAM_STATS.map((t, i) => (
                <tr key={t.team} className={`hover:bg-brand-dark/30 ${i === 0 ? 'bg-yellow-500/5' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.flag}</span>
                      <span className={`font-semibold ${i === 0 ? 'text-yellow-400' : 'text-white'}`}>{t.team}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-display text-white tabular-nums">{t.goals}</td>
                  <td className="px-4 py-3 text-brand-gray tabular-nums">{t.conceded}</td>
                  <td className="px-4 py-3 text-brand-gray tabular-nums">{t.shots}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-brand-dark rounded-full h-1.5">
                        <div className="h-full bg-brand-gold/60 rounded-full" style={{ width: `${t.possession}%` }}/>
                      </div>
                      <span className="text-brand-gray tabular-nums text-xs">{t.possession}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-brand-gray tabular-nums">{t.passes.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${t.rating >= 8 ? 'text-emerald-400' : 'text-brand-gray'}`}>{t.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clean sheet leaders */}
      <div className="gr-card">
        <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-gold"/>
          <h2 className="text-white font-semibold">Defensive Leaders</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/40">
          {[
            { name: 'Thibaut Courtois', team: 'Belgium', flag: '🇧🇪', cs: 3, saves: 18 },
            { name: 'Alisson',          team: 'Brazil',  flag: '🇧🇷', cs: 3, saves: 14 },
            { name: 'Jordan Pickford', team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', cs: 2, saves: 16 },
            { name: 'David Raya',       team: 'Spain',   flag: '🇪🇸', cs: 3, saves: 11 },
          ].map(g => (
            <div key={g.name} className="px-5 py-4 text-center">
              <div className="text-3xl mb-2">{g.flag}</div>
              <div className="text-white font-semibold text-sm">{g.name}</div>
              <div className="text-brand-gray text-xs mb-3">{g.team}</div>
              <div className="flex justify-center gap-4">
                <div><div className="font-display text-2xl text-brand-gold">{g.cs}</div><div className="text-brand-gray text-[10px]">Clean Sheets</div></div>
                <div><div className="font-display text-2xl text-white">{g.saves}</div><div className="text-brand-gray text-[10px]">Saves</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
