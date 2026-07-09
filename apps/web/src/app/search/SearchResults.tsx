'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Clock, Eye } from 'lucide-react';

const SEARCHABLE = [
  { type: 'Article', href: '/news/england-france-qf-preview',     title: 'England vs France: The Quarter-Final the World Has Been Waiting For', tags: ['England','France','Quarter-Final','Mbappé','Bellingham'] },
  { type: 'Article', href: '/news/yamal-masterclass-analysis',     title: "Yamal is the Player of the Tournament — and He's Only 18",             tags: ['Spain','Yamal','Analysis'] },
  { type: 'Article', href: '/news/messi-farewell-world-cup',       title: "The Last Dance: Is This Really Messi's Final World Cup Miracle?",       tags: ['Argentina','Messi','Analysis'] },
  { type: 'Article', href: '/news/brazil-argentina-qf-preview',    title: 'Brazil vs Argentina: The Super Clásico That Shakes the World',         tags: ['Brazil','Argentina','Quarter-Final'] },
  { type: 'Article', href: '/news/mbappe-golden-boot-race',        title: "Mbappé vs Vinícius: The Golden Boot Race Is Getting Spicy",            tags: ['Mbappé','Vinícius Jr','Golden Boot','France','Brazil'] },
  { type: 'Article', href: '/news/usa-surprise-package',           title: "USA's Stunning Run: How America Became the Tournament's Biggest Story", tags: ['USA','Pulisic'] },
  { type: 'Article', href: '/news/transfer-window-post-wc',        title: 'Summer 2026 Transfer Window: Which Stars Will Move After the World Cup?', tags: ['Transfers','Wirtz','Osimhen','Yamal'] },
  { type: 'Article', href: '/news/ronaldo-last-dance-portugal',    title: "Ronaldo's Last Dance: Four Goals, One Final Chance at Glory",          tags: ['Portugal','Ronaldo'] },
  { type: 'Article', href: '/news/germany-dark-horses',            title: "Germany: The Dark Horses Nobody Is Talking About Enough",              tags: ['Germany','Wirtz','Tactics'] },
  { type: 'Article', href: '/news/metlife-stadium-final-venue',    title: "MetLife Stadium: The Cathedral That Will Host Football's Greatest Moment", tags: ['MetLife','Final','USA'] },
  { type: 'Article', href: '/news/spain-possession-stats',         title: 'Spain by the Numbers: The Most Dominant Team at World Cup 2026',       tags: ['Spain','Stats'] },
  { type: 'Article', href: '/news/48-team-format-verdict',         title: '48 Teams: Was the Expanded Format a Success?',                         tags: ['FIFA','Format'] },
  { type: 'Page',    href: '/world-cup',    title: 'World Cup 2026 Hub',             tags: ['World Cup','Tournament','Bracket'] },
  { type: 'Page',    href: '/live-scores',  title: 'Live Scores',                    tags: ['Live','Scores','Results'] },
  { type: 'Page',    href: '/fixtures',     title: 'Fixtures & Schedule',            tags: ['Fixtures','Schedule','QF'] },
  { type: 'Page',    href: '/results',      title: 'Match Results',                  tags: ['Results','R16'] },
  { type: 'Page',    href: '/statistics',   title: 'Tournament Statistics',          tags: ['Stats','Scorers','Assists'] },
  { type: 'Page',    href: '/teams',        title: 'QF Team Profiles',               tags: ['Teams','Squads'] },
  { type: 'Page',    href: '/predictions',  title: 'AI Match Predictions',           tags: ['Predictions','AI'] },
  { type: 'Page',    href: '/transfers',    title: 'Transfer News',                  tags: ['Transfers','Deals'] },
  { type: 'Page',    href: '/players',      title: 'Player Profiles',                tags: ['Players','Stats'] },
  { type: 'Page',    href: '/analysis',     title: 'Tactical Analysis',              tags: ['Tactics','Analysis'] },
];

const TYPE_COLORS: Record<string, string> = {
  Article: 'bg-brand-red/10 text-brand-red-light',
  Page:    'bg-brand-card text-brand-gray border border-brand-border',
  Team:    'bg-yellow-500/10 text-yellow-400',
};

export default function SearchResults() {
  const params = useSearchParams();
  const q = (params.get('q') ?? '').trim().toLowerCase();

  const results = q.length < 2
    ? []
    : SEARCHABLE.filter(item => {
        const haystack = [item.title, ...item.tags].join(' ').toLowerCase();
        return q.split(' ').every(word => haystack.includes(word));
      });

  return (
    <div>
      {q.length < 2 ? (
        <div className="gr-card p-12 text-center">
          <Search className="w-12 h-12 text-brand-muted mx-auto mb-4" />
          <h2 className="text-white font-semibold text-lg mb-2">Start typing to search</h2>
          <p className="text-brand-gray text-sm">Search for players, teams, news, and more</p>
        </div>
      ) : results.length === 0 ? (
        <div className="gr-card p-12 text-center">
          <Search className="w-12 h-12 text-brand-muted mx-auto mb-4" />
          <h2 className="text-white font-semibold text-lg mb-2">No results for &ldquo;{params.get('q')}&rdquo;</h2>
          <p className="text-brand-gray text-sm mb-6">Try a different search term or browse our sections below.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['World Cup', 'Transfers', 'Predictions', 'Statistics'].map(s => (
              <Link key={s} href={`/search?q=${encodeURIComponent(s.toLowerCase())}`}
                className="px-4 py-2 bg-brand-card border border-brand-border rounded-full text-sm text-brand-gray hover:text-white transition-colors">
                {s}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map(result => (
            <Link
              key={result.href}
              href={result.href}
              className="gr-card flex items-center gap-4 p-4 hover:border-brand-red/40 transition-all group"
            >
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 ${TYPE_COLORS[result.type] ?? ''}`}>
                {result.type.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold group-hover:text-brand-gold transition-colors truncate">
                  {result.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {result.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-brand-muted text-[10px]">#{tag}</span>
                  ))}
                </div>
              </div>
              <span className="text-brand-muted group-hover:text-brand-red text-sm transition-colors flex-shrink-0">→</span>
            </Link>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {q.length >= 2 && (
        <div className="mt-8">
          <h3 className="text-white font-semibold mb-4">Suggested Pages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: '/world-cup',   label: '🏆 World Cup Hub' },
              { href: '/news',        label: '📰 Latest News' },
              { href: '/live-scores', label: '⚡ Live Scores' },
              { href: '/transfers',   label: '🔄 Transfers' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="gr-card p-4 text-center hover:border-brand-red/40 transition-all group">
                <div className="text-white text-sm font-medium group-hover:text-brand-gold transition-colors">{l.label}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
