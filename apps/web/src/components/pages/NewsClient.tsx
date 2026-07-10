'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, TrendingUp, Trophy } from 'lucide-react';
import NewsCard from '@/components/cards/NewsCard';
import type { NewsArticle } from '@/lib/types';

const CATEGORIES = [
  { id: 'all',          label: 'All' },
  { id: 'world-cup',    label: '🏆 World Cup' },
  { id: 'breaking',     label: 'Breaking' },
  { id: 'match-report', label: 'Match Reports' },
  { id: 'transfer',     label: 'Transfers' },
  { id: 'analysis',     label: 'Analysis' },
  { id: 'preview',      label: 'Previews' },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const BATCH = 8;

interface Props { articles: NewsArticle[]; }

export default function NewsClient({ articles }: Props) {
  const [activeCat, setActiveCat] = useState('all');
  const [count, setCount]         = useState(BATCH);

  const filtered = activeCat === 'all'
    ? articles
    : articles.filter(a => {
        if (activeCat === 'world-cup')    return a.tags?.some(t => t.toLowerCase().includes('world cup'));
        if (activeCat === 'breaking')     return !!a.isBreaking;
        if (activeCat === 'match-report') return a.category === 'match-report';
        if (activeCat === 'transfer')     return a.category === 'transfer';
        if (activeCat === 'analysis')     return a.category === 'analysis';
        if (activeCat === 'preview')      return a.category === 'preview';
        return true;
      });

  const breaking = articles.filter(a => a.isBreaking);
  const featured = filtered[0];
  const rest     = filtered.slice(1, count + 1);
  const hasMore  = filtered.length > count + 1;

  const wcArticles = rest.filter(a => a.tags?.some(t => t.toLowerCase().includes('world cup')));
  const otherArticles = rest.filter(a => !a.tags?.some(t => t.toLowerCase().includes('world cup')));

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
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
              <Link key={a.id} href={`/news/${a.slug}`} className="text-white text-sm whitespace-nowrap hover:text-brand-gold transition-colors">
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* WC Banner */}
      <div className="gr-card p-5 mb-6 flex items-center gap-4 border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent">
        <Trophy className="w-8 h-8 text-yellow-400 flex-shrink-0"/>
        <div>
          <div className="text-yellow-400 font-bold text-sm">World Cup 2026 — Quarter-Finals</div>
          <div className="text-brand-gray text-xs">Jul 9–11 · France vs Morocco · Spain vs Belgium · Norway vs England · Argentina vs Switzerland</div>
        </div>
        <Link href="/world-cup" className="ml-auto text-yellow-400 text-xs font-semibold whitespace-nowrap hover:text-yellow-300 flex-shrink-0">WC Hub →</Link>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCat(cat.id); setCount(BATCH); }}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              activeCat === cat.id
                ? 'bg-brand-red text-white'
                : cat.id === 'world-cup'
                  ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                  : 'bg-brand-card border border-brand-border text-brand-gray hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="gr-card p-12 text-center text-brand-gray">
          No {activeCat} articles right now — check back soon.
        </div>
      ) : (
        <>
          {/* Hero article */}
          {featured && (
            <div className="mb-8">
              <NewsCard article={featured} variant="hero" className="max-h-[500px]"/>
            </div>
          )}

          {/* WC section (only when showing all) */}
          {activeCat === 'all' && wcArticles.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="gr-section-title flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-yellow-400"/>World Cup 2026
                </h2>
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
            {(activeCat === 'all' ? otherArticles : rest).map(a => (
              <NewsCard key={a.id} article={a}/>
            ))}
          </div>
        </>
      )}

      <div className="mt-6 flex items-center gap-2 text-brand-gray text-xs justify-center">
        <Clock className="w-3.5 h-3.5"/>
        Last updated {timeAgo(articles[0]?.publishedAt ?? new Date().toISOString())} · Refreshes every 60s
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setCount(c => c + BATCH)}
            className="gr-btn-primary px-10"
          >
            Load More Stories
          </button>
        </div>
      )}
    </div>
  );
}
