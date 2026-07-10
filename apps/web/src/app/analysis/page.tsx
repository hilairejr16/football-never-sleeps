import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, Clock, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tactical Analysis — GoalRush Global',
  description: 'World Cup 2026 tactical breakdowns, formation analysis, and in-depth match reports from GoalRush Global.',
  alternates: { canonical: '/analysis' },
};

const ANALYSIS_PIECES = [
  {
    slug: 'lamine-yamal-wc-2026-masterclass',
    title: "Yamal is the Player of the Tournament — and He's Only 18",
    excerpt: "From Barcelona teenager to World Cup superstar. A complete tactical breakdown of how Yamal has dismantled every defence he has faced.",
    category: 'Player Analysis', tags: ['Spain', 'Yamal'], readTime: 8, views: 198000,
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    slug: 'spain-possession-stats',
    title: 'Spain by the Numbers: The Most Dominant Team at World Cup 2026',
    excerpt: "64% average possession. 14 goals. 3 conceded. De la Fuente's Spain reimagines tiki-taka with a terrifying new blueprint.",
    category: 'Stats & Tactics', tags: ['Spain', 'Stats'], readTime: 4, views: 88000,
    publishedAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
  },
  {
    slug: 'germany-dark-horses',
    title: "Germany: The Dark Horses Nobody Is Talking About Enough",
    excerpt: "Wirtz. Havertz. Kimmich. Nagelsmann's system has been the tournament's hidden tactical masterpiece. A deep dive.",
    category: 'Team Analysis', tags: ['Germany', 'Tactics'], readTime: 5, views: 127000,
    publishedAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
  },
  {
    slug: 'messi-farewell-world-cup',
    title: "The Last Dance: Is This Really Messi's Final World Cup Miracle?",
    excerpt: "Six assists. Four goals. At 38 years old. Analysing how Messi has reinvented himself as an orchestrator to defy time itself.",
    category: 'Player Analysis', tags: ['Argentina', 'Messi'], readTime: 7, views: 421000,
    publishedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
  },
  {
    slug: 'mbappe-golden-boot-race',
    title: "Mbappé vs Vinícius: The Golden Boot Race Is Getting Spicy",
    excerpt: "Six goals for France's captain versus five and four assists for Brazil's wizard. Breaking down the stats of football's most compelling individual duel.",
    category: 'Stats & Tactics', tags: ['Mbappé', 'Vinícius Jr'], readTime: 5, views: 232000,
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    slug: '48-team-format-verdict',
    title: '48 Teams: Was the Expanded Format a Success? The Verdict',
    excerpt: "More upsets. More nations. More stories. Five weeks in — an honest assessment of whether the expanded World Cup delivered.",
    category: 'Feature', tags: ['FIFA', 'Format'], readTime: 8, views: 75000,
    publishedAt: new Date(Date.now() - 1000 * 60 * 1000).toISOString(),
  },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtViews(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return String(v);
}

export default function AnalysisPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white flex items-center gap-3 mb-2">
          <TrendingUp className="w-7 h-7 text-brand-gold" />TACTICAL ANALYSIS
        </h1>
        <p className="text-brand-gray">World Cup 2026 — Formation breakdowns, player profiles, and in-depth match analysis</p>
      </div>

      {/* Featured piece */}
      <Link
        href={`/news/${ANALYSIS_PIECES[0].slug}`}
        className="gr-card block p-6 mb-8 border border-yellow-500/10 hover:border-yellow-500/30 transition-all group"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <span className="text-brand-gold text-xs font-bold uppercase tracking-wider mb-2 block">
              Featured Analysis · {ANALYSIS_PIECES[0].category}
            </span>
            <h2 className="text-white text-2xl font-display tracking-wider group-hover:text-brand-gold transition-colors mb-3 leading-snug">
              {ANALYSIS_PIECES[0].title}
            </h2>
            <p className="text-brand-gray leading-relaxed mb-4">{ANALYSIS_PIECES[0].excerpt}</p>
            <div className="flex items-center gap-4 text-brand-gray text-xs">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ANALYSIS_PIECES[0].readTime} min read</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmtViews(ANALYSIS_PIECES[0].views)} views</span>
              <span>{timeAgo(ANALYSIS_PIECES[0].publishedAt)}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center w-48 h-32 bg-gradient-to-br from-brand-dark to-brand-black rounded-xl border border-brand-border flex-shrink-0">
            <TrendingUp className="w-12 h-12 text-brand-gold/30" />
          </div>
        </div>
      </Link>

      {/* Grid */}
      <h2 className="gr-section-title mb-6">All Analysis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ANALYSIS_PIECES.slice(1).map(piece => (
          <Link
            key={piece.slug}
            href={`/news/${piece.slug}`}
            className="gr-card p-5 hover:border-brand-red/40 transition-all group"
          >
            <span className="text-brand-gold text-[10px] font-bold uppercase tracking-wider mb-2 block">{piece.category}</span>
            <h3 className="text-white font-semibold group-hover:text-brand-gold transition-colors line-clamp-2 mb-2 leading-snug">
              {piece.title}
            </h3>
            <p className="text-brand-gray text-sm leading-relaxed line-clamp-2 mb-3">{piece.excerpt}</p>
            <div className="flex items-center gap-3 text-brand-gray text-xs">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{piece.readTime} min</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmtViews(piece.views)}</span>
              <span className="ml-auto">{timeAgo(piece.publishedAt)}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/news" className="gr-btn-primary px-10">All Football News</Link>
      </div>
    </div>
  );
}
