'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { cn, formatTimeAgo, formatViews, truncate } from '@/lib/utils';
import type { NewsArticle } from '@/lib/types';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'hero' | 'compact' | 'horizontal';
  className?: string;
}

export default function NewsCard({
  article,
  variant = 'default',
  className,
}: NewsCardProps) {
  if (variant === 'hero') {
    return (
      <Link href={`/news/${article.slug}`} className={cn('group block', className)}>
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
          <Image
            src={article.imageUrl || '/placeholder-news.jpg'}
            alt={article.imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          {article.isBreaking && (
            <div className="absolute top-4 left-4">
              <span className="gr-badge-red text-xs font-bold uppercase tracking-wider">
                Breaking
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="gr-badge-gold text-xs mb-2 inline-block">
              {article.category.replace('-', ' ').toUpperCase()}
            </span>
            <h2 className="text-white font-bold text-xl leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
              {article.title}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-white/60 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatViews(article.views)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/news/${article.slug}`}
        className={cn('group gr-card-sm flex gap-4 p-3', className)}
      >
        <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={article.imageUrl || '/placeholder-news.jpg'}
            alt={article.imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col justify-between min-w-0">
          <h3 className="text-white text-sm font-semibold leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-brand-gray text-xs mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(article.publishedAt)}
            </span>
            {article.isBreaking && (
              <span className="text-brand-red font-bold">BREAKING</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/news/${article.slug}`}
        className={cn(
          'group flex items-start gap-3 py-3 border-b border-brand-border last:border-0',
          className
        )}
      >
        <span className="text-brand-red font-display text-lg leading-none flex-shrink-0">
          {String(1).padStart(2, '0')}
        </span>
        <div>
          <h3 className="text-white text-sm font-medium leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
            {article.title}
          </h3>
          <span className="text-brand-gray text-xs mt-0.5 block">
            {formatTimeAgo(article.publishedAt)}
          </span>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/news/${article.slug}`} className={cn('group gr-card block', className)}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={article.imageUrl || '/placeholder-news.jpg'}
          alt={article.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {article.isBreaking && (
          <div className="absolute top-3 left-3">
            <span className="gr-badge-red text-xs font-bold">BREAKING</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="gr-badge-gold text-xs">
            {article.category.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold leading-snug group-hover:text-brand-gold transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-brand-gray text-sm leading-relaxed line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-brand-gray text-xs">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatViews(article.views)}
          </span>
        </div>
      </div>
    </Link>
  );
}
