import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, Target, Zap, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'World Cup 2026 Players — GoalRush Global',
  description: 'Top players, squad profiles, and tournament stats from the FIFA World Cup 2026 Quarter-Finalists.',
  alternates: { canonical: '/players' },
};

const TOP_PLAYERS = [
  { name: 'Lamine Yamal',     team: 'Spain',    flag: '🇪🇸', pos: 'FW', goals: 4, assists: 6, rating: 9.3, slug: 'yamal-masterclass-analysis' },
  { name: 'Vinícius Jr',      team: 'Brazil',   flag: '🇧🇷', pos: 'FW', goals: 5, assists: 4, rating: 9.1, slug: 'mbappe-golden-boot-race' },
  { name: 'Kylian Mbappé',    team: 'France',   flag: '🇫🇷', pos: 'FW', goals: 6, assists: 2, rating: 8.9, slug: 'mbappe-golden-boot-race' },
  { name: 'Lionel Messi',     team: 'Argentina',flag: '🇦🇷', pos: 'FW', goals: 4, assists: 6, rating: 8.8, slug: 'messi-farewell-world-cup' },
  { name: 'Florian Wirtz',    team: 'Germany',  flag: '🇩🇪', pos: 'MF', goals: 4, assists: 3, rating: 8.7, slug: 'germany-dark-horses' },
  { name: 'Jude Bellingham',  team: 'England',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'MF', goals: 3, assists: 4, rating: 8.6, slug: 'england-france-qf-preview' },
  { name: 'Julián Álvarez',   team: 'Argentina',flag: '🇦🇷', pos: 'FW', goals: 5, assists: 1, rating: 8.4, slug: 'brazil-argentina-qf-preview' },
  { name: 'Pedri',            team: 'Spain',    flag: '🇪🇸', pos: 'MF', goals: 2, assists: 4, rating: 8.3, slug: 'spain-possession-stats' },
  { name: 'Christian Pulisic',team: 'USA',      flag: '🇺🇸', pos: 'FW', goals: 4, assists: 2, rating: 8.2, slug: 'usa-surprise-package' },
  { name: 'Harry Kane',       team: 'England',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pos: 'FW', goals: 5, assists: 0, rating: 8.1, slug: 'england-france-qf-preview' },
  { name: 'Bruno Fernandes',  team: 'Portugal', flag: '🇵🇹', pos: 'MF', goals: 2, assists: 5, rating: 8.0, slug: 'ronaldo-last-dance-portugal' },
  { name: 'Kai Havertz',      team: 'Germany',  flag: '🇩🇪', pos: 'FW', goals: 4, assists: 1, rating: 8.0, slug: 'germany-dark-horses' },
];

const POSITION_COLORS: Record<string, string> = {
  FW: 'text-brand-red bg-brand-red/10',
  MF: 'text-brand-gold bg-brand-gold/10',
  DF: 'text-blue-400 bg-blue-400/10',
  GK: 'text-purple-400 bg-purple-400/10',
};

const TOP_GOALKEEPERS = [
  { name: 'Alisson',          team: 'Brazil',  flag: '🇧🇷', cs: 3, saves: 14 },
  { name: 'David Raya',       team: 'Spain',   flag: '🇪🇸', cs: 3, saves: 11 },
  { name: 'Jordan Pickford',  team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', cs: 2, saves: 16 },
  { name: 'Diogo Costa',      team: 'Portugal',flag: '🇵🇹', cs: 2, saves: 13 },
];

export default function PlayersPage() {
  const maxRating = Math.max(...TOP_PLAYERS.map(p => p.rating));

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white flex items-center gap-3 mb-2">
          <Users className="w-7 h-7 text-brand-gold" />PLAYERS
        </h1>
        <p className="text-brand-gray">FIFA World Cup 2026 — Top performers across the quarter-finalists</p>
      </div>

      {/* Top performer banner */}
      <div className="gr-card p-5 mb-8 border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-5xl">🇪🇸</div>
          <div className="flex-1">
            <div className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Player of the Tournament</div>
            <div className="text-white text-2xl font-display tracking-wider">LAMINE YAMAL</div>
            <div className="text-brand-gray text-sm">Spain · Forward · 18 years old</div>
          </div>
          <div className="flex gap-6">
            <div className="text-center"><div className="font-display text-2xl text-white">4</div><div className="text-brand-gray text-xs">Goals</div></div>
            <div className="text-center"><div className="font-display text-2xl text-brand-gold">6</div><div className="text-brand-gray text-xs">Assists</div></div>
            <div className="text-center"><div className="font-display text-2xl text-yellow-400">9.3</div><div className="text-brand-gray text-xs">Rating</div></div>
          </div>
          <Link href="/news/yamal-masterclass-analysis" className="gr-btn-gold px-4 py-2 text-sm whitespace-nowrap">
            Full Analysis
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Player table */}
        <div className="gr-card">
          <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-gold" />
            <h2 className="text-white font-semibold">Tournament Top Performers</h2>
            <span className="text-brand-gray text-xs ml-auto">G · A · Rating</span>
          </div>
          <div className="divide-y divide-brand-border/40">
            {TOP_PLAYERS.map((player, i) => (
              <Link
                key={player.name}
                href={`/news/${player.slug}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-brand-dark/40 transition-colors group"
              >
                <span className={`text-xs w-5 font-bold flex-shrink-0 ${i === 0 ? 'text-yellow-400' : i < 3 ? 'text-brand-gray' : 'text-brand-muted'}`}>
                  {i + 1}
                </span>
                <span className="text-xl flex-shrink-0">{player.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold truncate group-hover:text-brand-gold transition-colors ${i === 0 ? 'text-white' : 'text-brand-gray'}`}>
                    {player.name}
                  </div>
                  <div className="text-brand-muted text-xs">{player.team}</div>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${POSITION_COLORS[player.pos] ?? 'text-brand-gray bg-brand-dark'}`}>
                  {player.pos}
                </span>
                <div className="flex items-center gap-3 flex-shrink-0 text-right">
                  <div className="w-16 bg-brand-dark rounded-full h-1 hidden sm:block">
                    <div className="h-full bg-brand-gold/60 rounded-full" style={{ width: `${(player.rating / maxRating) * 100}%` }} />
                  </div>
                  <span className="font-display text-lg text-white w-5 tabular-nums">{player.goals}</span>
                  <span className="text-brand-gray text-xs w-4 tabular-nums">{player.assists}</span>
                  <span className={`text-xs font-bold w-8 text-right ${player.rating >= 9 ? 'text-yellow-400' : player.rating >= 8.5 ? 'text-emerald-400' : 'text-brand-gray'}`}>
                    {player.rating}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Goalkeepers */}
          <div className="gr-card">
            <div className="px-5 py-4 border-b border-brand-border flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-gold" />
              <h3 className="text-white font-semibold">Top Goalkeepers</h3>
            </div>
            <div className="divide-y divide-brand-border/40">
              {TOP_GOALKEEPERS.map(gk => (
                <div key={gk.name} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="text-xl">{gk.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{gk.name}</div>
                    <div className="text-brand-gray text-xs">{gk.team}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-display text-lg text-brand-gold">{gk.cs}</div>
                    <div className="text-brand-gray text-[10px]">clean sheets</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-display text-lg text-white">{gk.saves}</div>
                    <div className="text-brand-gray text-[10px]">saves</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="gr-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-gold" />More Stats
            </h3>
            <div className="space-y-2">
              {[
                { href: '/statistics', label: 'Full Tournament Statistics' },
                { href: '/teams', label: 'QF Team Profiles' },
                { href: '/predictions', label: 'AI Match Predictions' },
                { href: '/news', label: 'Latest News' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-brand-dark transition-colors group">
                  <span className="text-brand-gray group-hover:text-white text-sm transition-colors">{l.label}</span>
                  <span className="text-brand-muted group-hover:text-brand-red text-xs transition-colors">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
