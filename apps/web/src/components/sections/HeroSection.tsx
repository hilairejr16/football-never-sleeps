import Link from 'next/link';
import { ArrowRight, TrendingUp, Trophy } from 'lucide-react';
import NewsCard from '@/components/cards/NewsCard';
import type { NewsArticle } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

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

// Fallback articles use slugs that exist in apps/web/src/app/news/[slug]/page.tsx ARTICLES
// so every card click resolves to a full article page without hitting the Railway API
const WC_FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: 'wc-qf-1',
    title: 'France vs Morocco: Mbappé Eyes Semi-Final as Atlas Lions Aim for History Again',
    slug: 'france-morocco-qf-preview',
    excerpt: "Morocco shocked the world in 2022. They're doing it again in 2026. But Mbappé and a full-strength France stand in the way at Gillette Stadium, Boston — Jul 9, 4 PM ET.",
    content: '',
    category: 'breaking',
    tags: ['World Cup 2026', 'France', 'Morocco', 'Quarter-Finals', 'Mbappé'],
    imageUrl: '/placeholder-news.svg',
    imageAlt: 'France vs Morocco World Cup QF Gillette Stadium Boston',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isBreaking: true,
    views: 1_920_000,
    readTime: 5,
  },
  {
    id: 'wc-qf-2',
    title: 'Norway vs England: Haaland Hunts His Greatest Prize — Hard Rock Stadium, Jul 11',
    slug: 'norway-england-qf-preview',
    excerpt: "The World Cup's biggest shock story meets England's golden generation. Haaland is unstoppable, but Bellingham and the Three Lions won't go quietly. Miami, 5 PM ET.",
    content: '',
    category: 'analysis',
    tags: ['World Cup 2026', 'Norway', 'England', 'Haaland', 'Bellingham', 'Quarter-Finals'],
    imageUrl: '/placeholder-news.svg',
    imageAlt: 'Norway vs England World Cup QF Miami',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isBreaking: false,
    views: 1_340_000,
    readTime: 6,
  },
  {
    id: 'wc-qf-3',
    title: 'Spain vs Belgium: Yamal vs De Bruyne — The QF That Has Everything — SoFi Stadium Jul 10',
    slug: 'spain-belgium-qf-preview',
    excerpt: "Belgium's Golden Generation vs Spain's next one. The greatest midfielder of his era against the tournament's best young player. SoFi Stadium, Inglewood — Jul 10, 3 PM ET.",
    content: '',
    category: 'analysis',
    tags: ['World Cup 2026', 'Spain', 'Belgium', 'Quarter-Finals', 'Yamal', 'De Bruyne'],
    imageUrl: '/placeholder-news.svg',
    imageAlt: 'Spain vs Belgium World Cup QF SoFi Stadium',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isBreaking: false,
    views: 1_080_000,
    readTime: 5,
  },
  {
    id: 'wc-qf-4',
    title: "Messi's Miracle Run: Argentina vs Switzerland — Can the Champions Reach the Final?",
    slug: 'argentina-switzerland-qf-preview',
    excerpt: "Messi and the reigning World Champions face Switzerland's penalty-shootout specialists at Arrowhead Stadium, Kansas City — Jul 11, 9 PM ET. History beckons.",
    content: '',
    category: 'analysis',
    tags: ['World Cup 2026', 'Argentina', 'Switzerland', 'Messi', 'Quarter-Finals'],
    imageUrl: '/placeholder-news.svg',
    imageAlt: 'Argentina vs Switzerland World Cup QF Kansas City',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 270).toISOString(),
    isBreaking: false,
    views: 1_150_000,
    readTime: 6,
  },
];

function daysUntilFinal(): number {
  const final = new Date('2026-07-19T00:00:00Z');
  const now = new Date();
  return Math.max(0, Math.ceil((final.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function wcCurrentStageLabel(): string {
  const d = new Date().toISOString().slice(0, 10);
  if (d <= '2026-07-07') return 'Round of 16';
  if (d <= '2026-07-11') return 'Quarter-Finals · Jul 9–11';
  if (d <= '2026-07-15') return 'Semi-Finals · Jul 14–15';
  if (d <= '2026-07-18') return '3rd Place · Jul 18';
  if (d <= '2026-07-19') return '🏆 THE FINAL · Jul 19';
  return 'World Cup Complete';
}

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
              style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0d1a4a 100%)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                  World Cup 2026
                </span>
              </div>
              <div className="text-white/60 text-xs mb-3">{wcCurrentStageLabel()}</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'WC Today',      value: stats.wcMatchesToday > 0 ? String(stats.wcMatchesToday) : '0' },
                  { label: 'Days to Final', value: String(daysUntilFinal()) },
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
                  { label: 'QF Kick-off',   value: 'Jul 10' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="font-display text-3xl text-white">{stat.value}</div>
                    <div className="text-blue-100 text-[10px] font-medium mt-0.5">{stat.label}</div>
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
