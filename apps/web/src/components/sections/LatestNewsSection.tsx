import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewsCard from '@/components/cards/NewsCard';
import type { NewsArticle } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

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
    id: 'n1', title: "France vs Morocco: Mbappé vs the Atlas Lions — Who Stops Who?",
    slug: 'france-morocco-qf-preview',
    excerpt: "Morocco shocked the world in 2022 reaching the semi-finals. Today at Gillette Stadium they face the might of France and Mbappé. GoalRush AI breaks down the battle.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'France', 'Morocco', 'Quarter-Final'],
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'France vs Morocco World Cup 2026 Quarter-Final',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isBreaking: true, views: 1_420_000, readTime: 7,
  },
  {
    id: 'n2', title: "Haaland Just Eliminated Brazil — Norway Are the Most Dangerous Team Left",
    slug: 'norway-england-qf-preview',
    excerpt: "Norway 2-0 Brazil. The result that redrew the World Cup. Now Erling Haaland faces England at Hard Rock Stadium. Southgate's backline has never faced anything like this.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'Norway', 'England', 'Haaland'],
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc45e32bdf?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Norway vs England World Cup 2026 Quarter-Final Miami',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    isBreaking: false, views: 1_080_000, readTime: 6,
  },
  {
    id: 'n3', title: "Spain vs Belgium: The Quarter-Final the Tacticians Are Dreaming About",
    slug: 'spain-belgium-qf-preview',
    excerpt: "Yamal versus De Bruyne. Possession versus power. Spain's slick machine takes on Belgium's golden generation at SoFi Stadium. This is a masterclass waiting to happen.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'Spain', 'Belgium', 'Quarter-Final'],
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Spain vs Belgium World Cup 2026 Quarter-Final SoFi Stadium',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isBreaking: false, views: 876_000, readTime: 5,
  },
  {
    id: 'n4', title: "Post-WC Transfer Bomb: Every Star Club Scouts Are Watching Right Now",
    slug: 'transfer-window-post-wc',
    excerpt: "The summer 2026 transfer window officially opens July 21. Here are the World Cup breakout stars who will command nine-figure fees. Haaland, Yamal, De Bruyne — the list starts here.",
    content: '', category: 'transfer', tags: ['Transfers', 'World Cup 2026', 'Summer 2026'],
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Summer 2026 Transfer Window World Cup stars',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isBreaking: false, views: 613_000, readTime: 8,
  },
  {
    id: 'n5', title: "MetLife Stadium: The World Cup Final Venue That Is Already Making History",
    slug: 'metlife-stadium-final-venue',
    excerpt: "New Jersey's MetLife Stadium will host the biggest match in football history on July 19. A look at the venue that holds 82,500 fans.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'Final', 'MetLife'],
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'MetLife Stadium World Cup Final 2026',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    isBreaking: false, views: 392_000, readTime: 4,
  },
  {
    id: 'n6', title: "Haaland's 8 Goals Lead the Golden Boot — Can Anyone Catch Him?",
    slug: 'mbappe-golden-boot-race',
    excerpt: "Norway's striker is rewriting World Cup history with 8 goals from 5 matches. Mbappé (6), Vinícius Jr (5), Álvarez (5), Kane (5) chase. GoalRush AI analysis.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'Haaland', 'Golden Boot', 'Norway'],
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Golden Boot race World Cup 2026 Haaland',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    isBreaking: false, views: 1_890_000, readTime: 6,
  },
  {
    id: 'n7', title: "Argentina vs Switzerland: Can Messi's Men Reach the Semi-Finals?",
    slug: 'argentina-switzerland-qf-preview',
    excerpt: "Switzerland beat Colombia on penalties in one of the tournament's great upsets. Now they face Argentina and a motivated Messi at Arrowhead Stadium, Kansas City.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'Argentina', 'Switzerland', 'Quarter-Final'],
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc45e32bdf?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Argentina vs Switzerland World Cup 2026 Quarter-Final',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    isBreaking: false, views: 724_000, readTime: 5,
  },
  {
    id: 'n8', title: "48-Team World Cup Verdict: Was the Expanded Format Worth It?",
    slug: '48-team-format-verdict',
    excerpt: "The first ever 48-team World Cup is entering its final stretch. GoalRush analyses whether the expanded format delivered on its promise of more drama.",
    content: '', category: 'analysis', tags: ['World Cup 2026', 'FIFA', 'Format'],
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'World Cup 2026 48-team format analysis',
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
