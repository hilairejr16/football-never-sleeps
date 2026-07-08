import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewsCard from '@/components/cards/NewsCard';
import type { NewsArticle } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const CATEGORIES = ['All', 'World Cup', 'Breaking', 'Transfers', 'Analysis', 'Match Reports'];

async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${BASE}/news?limit=8`, { next: { revalidate: 60 } });
    if (res.ok) {
      const { data } = await res.json();
      if (Array.isArray(data) && data.length >= 3) return data;
    }
  } catch {}
  return WC_NEWS_FALLBACK;
}

const WC_NEWS_FALLBACK: NewsArticle[] = [
  {
    id: 'n1', title: "England vs France: The Quarter-Final That Could Define a Generation",
    slug: 'england-france-wc-quarter-final-preview',
    excerpt: "Two football powerhouses collide in what promises to be the match of the World Cup. GoalRush AI breaks down the key battles, tactics, and who has the edge.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'England', 'France'],
    imageUrl: '/news/article-1.jpg', imageAlt: 'England vs France',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isBreaking: true, views: 1_240_000, readTime: 7,
  },
  {
    id: 'n2', title: "Lamine Yamal Is Running the World Cup at 18 — How Is This Possible?",
    slug: 'lamine-yamal-wc-2026-masterclass',
    excerpt: "Spain's teenage sensation is producing performances that defy logic. Tactical breakdown of how Yamal is destroying the world's best defences.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'Spain', 'Yamal'],
    imageUrl: '/news/article-2.jpg', imageAlt: 'Lamine Yamal',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    isBreaking: false, views: 876_000, readTime: 6,
  },
  {
    id: 'n3', title: "Brazil's Comeback Story: The Seleção Are Playing Like World Champions Again",
    slug: 'brazil-wc-2026-quarter-finals-run',
    excerpt: "After years of heartbreak, Brazil are back to their best at the 2026 World Cup. What changed and can they go all the way to the final?",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'Brazil'],
    imageUrl: '/news/article-3.jpg', imageAlt: 'Brazil 2026',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isBreaking: false, views: 742_000, readTime: 5,
  },
  {
    id: 'n4', title: "Post-WC Transfer Bomb: Every Star Club Scouts Are Watching Right Now",
    slug: 'wc-2026-transfer-targets-summer-window',
    excerpt: "The summer 2026 transfer window officially opens July 21. Here are the World Cup breakout stars who will command nine-figure fees.",
    content: '', category: 'transfer', tags: ['Transfers', 'World Cup 2026', 'Summer 2026'],
    imageUrl: '/news/article-4.jpg', imageAlt: 'Transfer targets',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isBreaking: false, views: 613_000, readTime: 8,
  },
  {
    id: 'n5', title: "MetLife Stadium: The World Cup Final Venue That Is Already Making History",
    slug: 'metlife-stadium-wc-2026-final-venue',
    excerpt: "New Jersey's MetLife Stadium will host the biggest match in football history on July 19. A look at the venue that holds 82,500 fans.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'Final', 'MetLife'],
    imageUrl: '/news/article-5.jpg', imageAlt: 'MetLife Stadium',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    isBreaking: false, views: 392_000, readTime: 4,
  },
  {
    id: 'n6', title: "Argentina: Defending Champions or Quarter-Final Exits? The Pressure on Messi's Successors",
    slug: 'argentina-wc-2026-defending-champions-pressure',
    excerpt: "Argentina won Qatar 2022. Four years on, a new generation carries the weight of a nation. Can they retain without Messi in full flight?",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'Argentina'],
    imageUrl: '/news/article-6.jpg', imageAlt: 'Argentina 2026',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    isBreaking: false, views: 567_000, readTime: 6,
  },
  {
    id: 'n7', title: "Germany's World Cup Redemption: How Nagelsmann Built a Winning Machine",
    slug: 'germany-wc-2026-redemption-quarter-finals',
    excerpt: "After crashing out in the group stages in 2018 and 2022, Germany are finally back to their best. The tactical genius behind Die Mannschaft's revival.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'Germany'],
    imageUrl: '/news/article-1.jpg', imageAlt: 'Germany 2026',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    isBreaking: false, views: 334_000, readTime: 5,
  },
  {
    id: 'n8', title: "48-Team World Cup Verdict: Was the Expanded Format Worth It?",
    slug: 'wc-2026-48-team-format-verdict',
    excerpt: "The first ever 48-team World Cup is entering its final stretch. GoalRush analyses whether the expanded format delivered on its promise of more drama.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'FIFA', 'Format'],
    imageUrl: '/news/article-2.jpg', imageAlt: 'World Cup 2026 format',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    isBreaking: false, views: 289_000, readTime: 7,
  },
];

export default async function LatestNewsSection() {
  const news = await fetchNews();
  const featured = news[0];
  const grid     = news.slice(1, 7);
  const list     = news.slice(7);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="gr-section-title">Latest News</h2>
        <Link href="/news" className="text-brand-red text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          All News <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat, i) => (
          <button key={cat} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
            i === 0 ? 'bg-brand-red text-white' : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white hover:border-brand-muted'
          }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <NewsCard article={featured} variant="hero" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {grid.map(article => <NewsCard key={article.id} article={article} />)}
        </div>
        {list.length > 0 && (
          <div className="gr-card divide-y divide-brand-border">
            {list.map(article => <NewsCard key={article.id} article={article} variant="horizontal" />)}
          </div>
        )}
      </div>
    </div>
  );
}
