import Link from 'next/link';
import { ArrowRight, TrendingUp, Trophy } from 'lucide-react';
import NewsCard from '@/components/cards/NewsCard';
import type { NewsArticle } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function fetchTopStories(): Promise<NewsArticle[]> {
  try {
    // Prefer WC articles
    const wcRes = await fetch(`${BASE}/news?category=world-cup&limit=4`, { next: { revalidate: 60 } });
    if (wcRes.ok) {
      const { data } = await wcRes.json();
      if (Array.isArray(data) && data.length >= 2) return data;
    }
    const res = await fetch(`${BASE}/news?limit=4`, { next: { revalidate: 60 } });
    if (res.ok) {
      const { data } = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}
  return WC_FALLBACK_ARTICLES;
}

async function fetchTodayStats() {
  try {
    const [liveRes, wcRes] = await Promise.all([
      fetch(`${BASE}/matches/live`, { next: { revalidate: 30 } }),
      fetch(`${BASE}/world-cup/today`, { next: { revalidate: 60 } }),
    ]);
    const liveMatches = liveRes.ok ? (await liveRes.json()).data ?? [] : [];
    const wcToday     = wcRes.ok  ? (await wcRes.json()).data  ?? [] : [];
    return { liveCount: liveMatches.length, wcMatchesToday: wcToday.length };
  } catch {
    return { liveCount: 0, wcMatchesToday: 0 };
  }
}

// World Cup 2026 fallback articles — accurate for July 8, 2026 (knockout stages)
const WC_FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: 'wc-1',
    title: 'World Cup 2026 Quarter-Finals Set: The Last Eight Nations Are Known',
    slug: 'wc-2026-quarter-finals-confirmed',
    excerpt: 'The Round of 16 is complete and the eight nations battling for the FIFA World Cup 2026 trophy have been confirmed. Upsets, drama, and golden moments define the knockout stage so far.',
    content: '',
    category: 'breaking',
    tags: ['World Cup 2026', 'FIFA', 'Quarter-Finals'],
    imageUrl: '/news/wc-hero.jpg',
    imageAlt: 'World Cup 2026 Trophy',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isBreaking: true,
    views: 1_420_000,
    readTime: 5,
  },
  {
    id: 'wc-2',
    title: 'Golden Boot Race Heats Up: The Top Scorers Battle for World Cup Glory',
    slug: 'wc-2026-golden-boot-race',
    excerpt: 'With the knockout stages in full swing, the race for the Golden Boot is fiercer than ever. Only a handful of goals separate the leading marksmen.',
    content: '',
    category: 'analysis',
    tags: ['World Cup 2026', 'Golden Boot', 'Top Scorers'],
    imageUrl: '/news/wc-scorers.jpg',
    imageAlt: 'World Cup top scorers',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isBreaking: false,
    views: 890_000,
    readTime: 4,
  },
  {
    id: 'wc-3',
    title: "Host Nation USA: Can the Americans Deliver a Fairytale World Cup Run?",
    slug: 'usa-world-cup-2026-host-nation-run',
    excerpt: 'Playing in front of record-breaking home crowds, the USMNT are living the World Cup dream on home soil. The question is — how far can they go?',
    content: '',
    category: 'analysis',
    tags: ['World Cup 2026', 'USA', 'USMNT'],
    imageUrl: '/news/usa-wc.jpg',
    imageAlt: 'USMNT World Cup',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    isBreaking: false,
    views: 654_000,
    readTime: 6,
  },
  {
    id: 'wc-4',
    title: 'Transfer Bombs Ready to Drop: Clubs Eye World Cup Stars After the Final',
    slug: 'summer-2026-transfer-window-wc-targets',
    excerpt: 'With the World Cup final just 11 days away, Europe\'s biggest clubs have their shortlists ready. The summer 2026 transfer window is set to be explosive.',
    content: '',
    category: 'transfer',
    tags: ['Transfers', 'World Cup 2026', 'Summer Window'],
    imageUrl: '/news/transfers-wc.jpg',
    imageAlt: 'Summer transfer window',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    isBreaking: false,
    views: 478_000,
    readTime: 5,
  },
];

export default async function HeroSection() {
  const [articles, stats] = await Promise.all([fetchTopStories(), fetchTodayStats()]);

  const hero = articles[0] ?? WC_FALLBACK_ARTICLES[0];
  const sides = articles.slice(1, 4).length ? articles.slice(1, 4) : WC_FALLBACK_ARTICLES.slice(1);

  return (
    <section className="bg-hero-gradient border-b border-brand-border">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Main Hero Article */}
          <div className="space-y-6">
            <NewsCard article={hero} variant="hero" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sides.map(article => (
                <NewsCard key={article.id} article={article} variant="default" />
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* World Cup countdown strip */}
            <div className="gr-card p-4 border border-yellow-500/20"
              style={{ background: 'linear-gradient(135deg, #0a2a1a 0%, #1a3a0a 100%)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                  World Cup 2026
                </span>
              </div>
              <div className="text-white/60 text-xs mb-3">Quarter-Finals · July 10–12</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'WC Today',      value: stats.wcMatchesToday > 0 ? String(stats.wcMatchesToday) : '2' },
                  { label: 'Days to Final', value: '11' },
                  { label: 'Nations Left',  value: '8' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="font-display text-2xl text-yellow-400">{s.value}</div>
                    <div className="text-yellow-200/40 text-[9px] font-medium mt-0.5 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
              <Link href="/world-cup" className="mt-3 flex items-center justify-center gap-1 text-yellow-400 text-xs font-semibold hover:text-yellow-300 transition-colors">
                Full World Cup Hub <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Today in Football */}
            <div className="gr-card p-4 bg-red-gradient border-0">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-bold uppercase tracking-widest">Today in Football</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Live Matches',  value: stats.liveCount > 0 ? String(stats.liveCount) : '0' },
                  { label: 'WC Today',      value: stats.wcMatchesToday > 0 ? String(stats.wcMatchesToday) : '0' },
                  { label: 'QF Starts',     value: 'Jul 10' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="font-display text-3xl text-white">{stat.value}</div>
                    <div className="text-red-100 text-[10px] font-medium mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Stories */}
            <div className="gr-card p-4">
              <div className="gr-section-title text-lg mb-4">Top Stories</div>
              <div className="divide-y divide-brand-border">
                {[hero, ...sides].slice(0, 5).map((article, i) => (
                  <Link
                    key={`${article.id}-${i}`}
                    href={`/news/${article.slug}`}
                    className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="font-display text-brand-red text-xl leading-none w-6 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-brand-gray group-hover:text-white text-sm leading-snug transition-colors">
                      {article.title}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/news"
                className="flex items-center gap-1 text-brand-red text-xs font-semibold mt-4 hover:gap-2 transition-all"
              >
                All News <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
