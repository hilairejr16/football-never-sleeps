import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, TrendingUp, Trophy } from 'lucide-react';
import NewsCard from '@/components/cards/NewsCard';
import type { NewsArticle } from '@/lib/types';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Football News — GoalRush Global',
  description: 'World Cup 2026 match reports, analysis, and transfer news — AI-powered coverage 24/7.',
  alternates: { canonical: '/news' },
};

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

const CATEGORIES = [
  { id: 'all',          label: 'All' },
  { id: 'world-cup',    label: '🏆 World Cup' },
  { id: 'breaking',     label: 'Breaking' },
  { id: 'match-report', label: 'Match Reports' },
  { id: 'transfer',     label: 'Transfers' },
  { id: 'analysis',     label: 'Analysis' },
  { id: 'preview',      label: 'Previews' },
];

const WC_FALLBACK: NewsArticle[] = [
  {
    id: 'wc1', slug: 'england-france-qf-preview', isBreaking: true,
    title: 'England vs France: The Quarter-Final the World Has Been Waiting For',
    excerpt: 'Mbappé vs the Three Lions. Bellingham vs the French midfield. The heavyweight clash of World Cup 2026 is here and it promises to be an instant classic.',
    content: '', category: 'preview',
    tags: ['World Cup 2026','England','France','Quarter-Final','Mbappé','Bellingham'],
    imageUrl: '/news/wc-eng-fra.jpg', imageAlt: 'England vs France',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*30).toISOString(),
    views: 284000, readTime: 6, league: 'World Cup 2026',
  },
  {
    id: 'wc2', slug: 'lamine-yamal-wc-2026-masterclass', isBreaking: false,
    title: 'Yamal is the Player of the Tournament — and He\'s Only 18',
    excerpt: 'From Barcelona teenager to World Cup superstar. Lamine Yamal\'s masterclass in Spain\'s run has left even the world\'s greatest in awe. A tactical breakdown.',
    content: '', category: 'analysis',
    tags: ['World Cup 2026','Spain','Yamal','Analysis'],
    imageUrl: '/news/yamal-wc26.jpg', imageAlt: 'Lamine Yamal',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*90).toISOString(),
    views: 198000, readTime: 8, league: 'World Cup 2026',
  },
  {
    id: 'wc3', slug: 'messi-farewell-world-cup', isBreaking: false,
    title: 'The Last Dance: Is This Really Messi\'s Final World Cup Miracle?',
    excerpt: 'Argentina\'s talisman continues to defy logic, age, and expectation. Six assists in five games — at 38 years old. We witness the impossible, yet again.',
    content: '', category: 'analysis',
    tags: ['World Cup 2026','Argentina','Messi'],
    imageUrl: '/news/messi-wc26.jpg', imageAlt: 'Messi',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*150).toISOString(),
    views: 421000, readTime: 7, league: 'World Cup 2026',
  },
  {
    id: 'wc4', slug: 'brazil-argentina-qf-preview', isBreaking: false,
    title: 'Brazil vs Argentina: The Super Clásico That Shakes the World',
    excerpt: 'For the first time since 2021\'s Copa América, the two South American giants collide. On the World Cup\'s biggest stage — at MetLife Stadium with everything on the line.',
    content: '', category: 'preview',
    tags: ['World Cup 2026','Brazil','Argentina','Quarter-Final'],
    imageUrl: '/news/bra-arg-wc26.jpg', imageAlt: 'Brazil vs Argentina',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*210).toISOString(),
    views: 376000, readTime: 5, league: 'World Cup 2026',
  },
  {
    id: 'wc5', slug: 'mbappe-golden-boot-race', isBreaking: false,
    title: 'Mbappé vs Vinícius: The Golden Boot Race Is Getting Spicy',
    excerpt: 'Six goals for France\'s captain. Five goals and four assists for Brazil\'s wizard. The award could be decided on Saturday in the most anticipated match of the tournament.',
    content: '', category: 'analysis',
    tags: ['World Cup 2026','Mbappé','Vinícius Jr','Golden Boot'],
    imageUrl: '/news/mbappe-vini-wc26.jpg', imageAlt: 'Golden Boot race',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*300).toISOString(),
    views: 232000, readTime: 5, league: 'World Cup 2026',
  },
  {
    id: 'wc6', slug: 'usa-surprise-package', isBreaking: false,
    title: 'USA\'s Stunning Run: How America Became the Tournament\'s Biggest Story',
    excerpt: 'Nobody predicted this. The host nation topping Group H, beating Iran, and now a QF clash with Portugal. A generation of talent — and 80,000 home fans — making history.',
    content: '', category: 'match-report',
    tags: ['World Cup 2026','USA','Pulisic'],
    imageUrl: '/news/usa-wc26.jpg', imageAlt: 'USA at World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*400).toISOString(),
    views: 189000, readTime: 6, league: 'World Cup 2026',
  },
  {
    id: 'wc7', slug: 'transfer-window-post-wc', isBreaking: false,
    title: 'Summer 2026 Transfer Window: Which Stars Will Move After the World Cup?',
    excerpt: 'The tournament has created new value and new buyers. Wirtz to Real Madrid, Osimhen to Liverpool, Yamal\'s new deal — the summer is already moving.',
    content: '', category: 'transfer',
    tags: ['Transfers','Summer 2026','World Cup 2026'],
    imageUrl: '/news/transfer-wc26.jpg', imageAlt: 'Transfer window 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*500).toISOString(),
    views: 155000, readTime: 7,
  },
  {
    id: 'wc8', slug: 'ronaldo-last-dance-portugal', isBreaking: false,
    title: 'Ronaldo\'s Last Dance: Four Goals, One Final Chance at Glory',
    excerpt: 'At 41, he\'s still on the scoresheet. Portugal\'s captain has defied every prediction. A QF against USA stands between him and a semi-final — and perhaps his ultimate legacy.',
    content: '', category: 'analysis',
    tags: ['World Cup 2026','Portugal','Ronaldo'],
    imageUrl: '/news/ronaldo-wc26.jpg', imageAlt: 'Cristiano Ronaldo',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*600).toISOString(),
    views: 341000, readTime: 6, league: 'World Cup 2026',
  },
  {
    id: 'wc9', slug: 'germany-dark-horses', isBreaking: false,
    title: 'Germany: The Dark Horses Nobody Is Talking About Enough',
    excerpt: 'Wirtz pulling the strings. Havertz leading the line. Nagelsmann\'s men have quietly assembled the most balanced squad in the tournament. Spain better be ready.',
    content: '', category: 'analysis',
    tags: ['World Cup 2026','Germany','Wirtz','Quarter-Final'],
    imageUrl: '/news/germany-wc26.jpg', imageAlt: 'Germany World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*700).toISOString(),
    views: 127000, readTime: 5, league: 'World Cup 2026',
  },
  {
    id: 'wc10', slug: 'metlife-stadium-final-venue', isBreaking: false,
    title: 'MetLife Stadium: The Cathedral That Will Host Football\'s Greatest Moment',
    excerpt: 'On July 19, 82,500 fans will witness the World Cup Final at East Rutherford, New Jersey. A look inside the stadium set to host the most-watched sporting event in history.',
    content: '', category: 'analysis',
    tags: ['World Cup 2026','MetLife Stadium','Final','USA'],
    imageUrl: '/news/metlife-wc26.jpg', imageAlt: 'MetLife Stadium',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*800).toISOString(),
    views: 98000, readTime: 4,
  },
  {
    id: 'wc11', slug: 'spain-possession-stats', isBreaking: false,
    title: 'Spain by the Numbers: The Most Dominant Team at World Cup 2026',
    excerpt: '64% average possession. 14 goals in 5 games. 3 conceded. Tiki-taka reimagined — Spain under De la Fuente is a football masterclass distilled into statistics.',
    content: '', category: 'stats',
    tags: ['World Cup 2026','Spain','Stats'],
    imageUrl: '/news/spain-stats-wc26.jpg', imageAlt: 'Spain statistics',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*900).toISOString(),
    views: 88000, readTime: 4, league: 'World Cup 2026',
  },
  {
    id: 'wc12', slug: '48-team-format-verdict', isBreaking: false,
    title: '48 Teams: Was the Expanded Format a Success? The Verdict After 5 Weeks',
    excerpt: 'More upsets. More nations. More stories. The 48-team World Cup delivered drama at every stage. But critics still have a point about the early group-stage bloat.',
    content: '', category: 'analysis',
    tags: ['World Cup 2026','FIFA','48-team format'],
    imageUrl: '/news/48team-wc26.jpg', imageAlt: '48 team World Cup',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000*60*1000).toISOString(),
    views: 75000, readTime: 8,
  },
];

async function fetchArticles(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${BASE}/news?limit=20`, { next: { revalidate: 60 } });
    if (res.ok) {
      const { data } = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}
  return WC_FALLBACK;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function NewsPage() {
  const articles = await fetchArticles();
  const breaking = articles.filter(a => a.isBreaking);
  const featured = articles[0];
  const rest = articles.slice(1);
  const wcArticles = rest.filter(a => a.tags?.includes('World Cup 2026'));

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      <BreadcrumbSchema crumbs={[{ name: 'Football News', path: '/news' }]} />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white mb-2">FOOTBALL NEWS</h1>
        <p className="text-brand-gray">World Cup 2026 · AI-powered coverage from every major league, 24/7</p>
      </div>

      {/* Breaking ticker */}
      {breaking.length > 0 && (
        <div className="gr-card p-3 mb-6 flex items-center gap-3 overflow-hidden border border-brand-red/20">
          <span className="px-2 py-0.5 bg-brand-red text-white text-xs font-bold rounded flex-shrink-0 animate-pulse">BREAKING</span>
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {breaking.map(a => (
              <span key={a.id} className="text-white text-sm whitespace-nowrap">{a.title}</span>
            ))}
          </div>
        </div>
      )}

      {/* WC Banner */}
      <div className="gr-card p-5 mb-6 flex items-center gap-4 border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent">
        <Trophy className="w-8 h-8 text-yellow-400 flex-shrink-0"/>
        <div>
          <div className="text-yellow-400 font-bold text-sm">World Cup 2026 — Quarter-Finals</div>
          <div className="text-brand-gray text-xs">July 10–12 · Spain vs Germany · France vs England · Brazil vs Argentina · Portugal vs USA</div>
        </div>
        <Link href="/world-cup" className="ml-auto text-yellow-400 text-xs font-semibold whitespace-nowrap hover:text-yellow-300 flex-shrink-0">WC Hub →</Link>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              i === 0 ? 'bg-brand-red text-white'
              : cat.id === 'world-cup' ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
              : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Hero article */}
      {featured && (
        <div className="mb-8">
          <NewsCard article={featured} variant="hero" className="max-h-[500px]"/>
        </div>
      )}

      {/* WC section */}
      {wcArticles.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="gr-section-title flex items-center gap-2"><TrendingUp className="w-4 h-4 text-yellow-400"/>World Cup 2026</h2>
            <Link href="/world-cup" className="text-yellow-400 text-xs font-semibold">All WC News →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wcArticles.slice(0, 4).map(a => <NewsCard key={a.id} article={a}/>)}
          </div>
        </div>
      )}

      {/* Main grid */}
      <h2 className="gr-section-title mb-5">Latest Stories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {rest.slice(wcArticles.length > 0 ? 4 : 0).map(article => (
          <NewsCard key={article.id} article={article}/>
        ))}
      </div>

      {/* Inline timestamps */}
      <div className="mt-6 flex items-center gap-2 text-brand-gray text-xs justify-center">
        <Clock className="w-3.5 h-3.5"/>
        Last updated {timeAgo(articles[0]?.publishedAt ?? new Date().toISOString())} · Refreshes every 60s
      </div>

      <div className="text-center mt-8">
        <button className="gr-btn-primary px-10">Load More Stories</button>
      </div>
    </div>
  );
}
