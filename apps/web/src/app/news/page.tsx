import type { Metadata } from 'next';
import type { NewsArticle } from '@/lib/types';
import NewsClient from '@/components/pages/NewsClient';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Football News — GoalRush Global',
  description: 'World Cup 2026 match reports, analysis, and transfer news — AI-powered coverage 24/7.',
  alternates: { canonical: '/news' },
};

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

const WC_FALLBACK: NewsArticle[] = [
  {
    id: 'qf1', slug: 'france-morocco-qf-preview', isBreaking: true,
    title: 'France vs Morocco: Mbappé Eyes Semi-Final as Atlas Lions Aim for History Again',
    excerpt: "Morocco shocked the world in 2022. They're doing it again in 2026. But Mbappé and a full-strength France stand in the way — Gillette Stadium, Boston, Jul 9.",
    content: '', category: 'preview',
    tags: ['World Cup 2026', 'France', 'Morocco', 'Quarter-Final', 'Mbappé'],
    imageUrl: img('1574629810360-7efbbe195018'), imageAlt: 'France vs Morocco World Cup QF',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    views: 1_920_000, readTime: 5, league: 'World Cup 2026',
  },
  {
    id: 'qf2', slug: 'spain-belgium-qf-preview', isBreaking: false,
    title: 'Spain vs Belgium: Yamal vs De Bruyne — The QF That Has Everything',
    excerpt: "Belgium's Golden Generation vs Spain's next one. Yamal vs De Bruyne at SoFi Stadium, Inglewood — July 10.",
    content: '', category: 'preview',
    tags: ['World Cup 2026', 'Spain', 'Belgium', 'Quarter-Final', 'Yamal', 'De Bruyne'],
    imageUrl: img('1560272564-c83b66b1ad12'), imageAlt: 'Spain vs Belgium World Cup QF',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    views: 1_080_000, readTime: 5, league: 'World Cup 2026',
  },
  {
    id: 'wc2', slug: 'lamine-yamal-wc-2026-masterclass', isBreaking: false,
    title: "Yamal is the Player of the Tournament — and He's Only 18",
    excerpt: "From Barcelona teenager to World Cup superstar. A tactical breakdown of how Yamal has dismantled every defence he has faced.",
    content: '', category: 'analysis',
    tags: ['World Cup 2026', 'Spain', 'Yamal', 'Analysis'],
    imageUrl: img('1551958219-acbc45e32bdf'), imageAlt: 'Lamine Yamal',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    views: 198_000, readTime: 8, league: 'World Cup 2026',
  },
  {
    id: 'qf3', slug: 'norway-england-qf-preview', isBreaking: false,
    title: 'Norway vs England: Haaland Hunts His Greatest Prize — Miami, Jul 11',
    excerpt: "Eight goals. Five matches. Erling Haaland is unstoppable. England's golden generation must stop him at Hard Rock Stadium.",
    content: '', category: 'preview',
    tags: ['World Cup 2026', 'Norway', 'England', 'Quarter-Final', 'Haaland', 'Bellingham'],
    imageUrl: img('1531415074968-036ba1b575da'), imageAlt: 'Norway vs England World Cup QF Miami',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 100).toISOString(),
    views: 1_340_000, readTime: 6, league: 'World Cup 2026',
  },
  {
    id: 'wc3', slug: 'messi-farewell-world-cup', isBreaking: false,
    title: "The Last Dance: Is This Really Messi's Final World Cup Miracle?",
    excerpt: "Argentina's talisman continues to defy logic, age, and expectation. Six assists in five games — at 38 years old.",
    content: '', category: 'analysis',
    tags: ['World Cup 2026', 'Argentina', 'Messi'],
    imageUrl: img('1574629810360-7efbbe195018'), imageAlt: 'Messi World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    views: 421_000, readTime: 7, league: 'World Cup 2026',
  },
  {
    id: 'qf4', slug: 'argentina-switzerland-qf-preview', isBreaking: false,
    title: "Argentina vs Switzerland: Can the Champions Survive the Penalty Kings?",
    excerpt: "Messi and the reigning champions vs Switzerland's penalty specialists at Arrowhead Stadium, Kansas City.",
    content: '', category: 'preview',
    tags: ['World Cup 2026', 'Argentina', 'Switzerland', 'Quarter-Final', 'Messi'],
    imageUrl: img('1560272564-c83b66b1ad12'), imageAlt: 'Argentina vs Switzerland World Cup QF',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    views: 1_150_000, readTime: 6, league: 'World Cup 2026',
  },
  {
    id: 'wc7', slug: 'transfer-window-post-wc', isBreaking: false,
    title: 'Summer 2026 Transfer Window: Which Stars Will Move After the World Cup?',
    excerpt: "The tournament has created new value and new buyers. Wirtz to Real Madrid, Osimhen to Liverpool, Yamal's new deal — the summer is already moving.",
    content: '', category: 'transfer',
    tags: ['Transfers', 'Summer 2026', 'World Cup 2026'],
    imageUrl: img('1551958219-acbc45e32bdf'), imageAlt: 'Transfer window 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    views: 155_000, readTime: 7,
  },
  {
    id: 'wc10', slug: 'metlife-stadium-final-venue', isBreaking: false,
    title: "MetLife Stadium: The Cathedral That Will Host Football's Greatest Moment",
    excerpt: 'On July 19, 82,500 fans will witness the World Cup Final at East Rutherford, New Jersey.',
    content: '', category: 'analysis',
    tags: ['World Cup 2026', 'MetLife Stadium', 'Final', 'USA'],
    imageUrl: img('1531415074968-036ba1b575da'), imageAlt: 'MetLife Stadium',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    views: 98_000, readTime: 4,
  },
  {
    id: 'wc11', slug: 'spain-possession-stats', isBreaking: false,
    title: 'Spain by the Numbers: The Most Dominant Team at World Cup 2026',
    excerpt: '64% average possession. 14 goals. 3 conceded. Tiki-taka reimagined — Spain under De la Fuente is a masterclass.',
    content: '', category: 'analysis',
    tags: ['World Cup 2026', 'Spain', 'Stats'],
    imageUrl: img('1574629810360-7efbbe195018'), imageAlt: 'Spain statistics World Cup 2026',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    views: 88_000, readTime: 4, league: 'World Cup 2026',
  },
  {
    id: 'wc12', slug: '48-team-format-verdict', isBreaking: false,
    title: '48 Teams: Was the Expanded Format a Success? The Verdict After 5 Weeks',
    excerpt: 'More upsets. More nations. More stories. The 48-team World Cup delivered drama at every stage.',
    content: '', category: 'analysis',
    tags: ['World Cup 2026', 'FIFA', '48-team format'],
    imageUrl: img('1560272564-c83b66b1ad12'), imageAlt: '48 team World Cup format',
    author: 'GoalRush AI', publishedAt: new Date(Date.now() - 1000 * 60 * 1000).toISOString(),
    views: 75_000, readTime: 8,
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

export default async function NewsPage() {
  const articles = await fetchArticles();
  return (
    <>
      <BreadcrumbSchema crumbs={[{ name: 'Football News', path: '/news' }]} />
      <NewsClient articles={articles} />
    </>
  );
}
