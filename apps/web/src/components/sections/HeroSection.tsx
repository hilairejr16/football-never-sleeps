import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import NewsCard from '@/components/cards/NewsCard';
import MatchCard from '@/components/cards/MatchCard';
import type { NewsArticle, Match } from '@/lib/types';

// In production these come from the API; mocked here for build
const HERO_ARTICLE: NewsArticle = {
  id: '1',
  title: 'BREAKING: Champions League Semi-Finals Set as Giants Clash in Epic Quarter-Final Showdown',
  slug: 'champions-league-semi-finals-set',
  excerpt: 'Real Madrid and Manchester City advance in stunning fashion as the draw for the semi-finals promises the most dramatic UEFA Champions League finish in years.',
  content: '',
  category: 'breaking',
  tags: ['Champions League', 'Real Madrid', 'Man City'],
  imageUrl: '/news/hero-1.jpg',
  imageAlt: 'Champions League action',
  author: 'GoalRush AI',
  publishedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  isBreaking: true,
  views: 284000,
  readTime: 4,
};

const SIDE_ARTICLES: NewsArticle[] = [
  {
    id: '2',
    title: 'Mbappe Hat-Trick Destroys Rivals in El Clasico Destruction',
    slug: 'mbappe-hat-trick-el-clasico',
    excerpt: '',
    content: '',
    category: 'match-report',
    tags: ['El Clasico', 'Mbappe', 'Real Madrid'],
    imageUrl: '/news/side-1.jpg',
    imageAlt: 'Mbappe celebrating',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isBreaking: false,
    views: 156000,
    readTime: 3,
  },
  {
    id: '3',
    title: 'Premier League Title Race: Arsenal vs City With Three Games to Go',
    slug: 'premier-league-title-race',
    excerpt: '',
    content: '',
    category: 'analysis',
    tags: ['Premier League', 'Arsenal', 'Man City'],
    imageUrl: '/news/side-2.jpg',
    imageAlt: 'Premier League trophy',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isBreaking: false,
    views: 98000,
    readTime: 5,
  },
  {
    id: '4',
    title: "Vini Jr. vs Salah: Who Is the World's Most Dangerous Winger Right Now?",
    slug: 'vinicius-vs-salah-comparison',
    excerpt: '',
    content: '',
    category: 'analysis',
    tags: ['Vinicius', 'Salah', 'Player Comparison'],
    imageUrl: '/news/side-3.jpg',
    imageAlt: 'Vinicius and Salah',
    author: 'GoalRush AI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isBreaking: false,
    views: 74000,
    readTime: 6,
  },
];

export default function HeroSection() {
  return (
    <section className="bg-hero-gradient border-b border-brand-border">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Main Hero Article */}
          <div className="space-y-6">
            <NewsCard article={HERO_ARTICLE} variant="hero" />

            {/* Secondary articles row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SIDE_ARTICLES.map(article => (
                <NewsCard key={article.id} article={article} variant="default" />
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Stats Banner */}
            <div className="gr-card p-4 bg-red-gradient border-0">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-bold uppercase tracking-widest">
                  Today in Football
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Live Matches', value: '12' },
                  { label: 'Goals Today', value: '34' },
                  { label: "Today's Articles", value: '47' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="font-display text-3xl text-white">{stat.value}</div>
                    <div className="text-red-100 text-[10px] font-medium mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest 5 news headlines */}
            <div className="gr-card p-4">
              <div className="gr-section-title text-lg mb-4">Top Stories</div>
              <div className="divide-y divide-brand-border">
                {[...SIDE_ARTICLES, HERO_ARTICLE, SIDE_ARTICLES[0]].slice(0, 5).map(
                  (article, i) => (
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
                  )
                )}
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
