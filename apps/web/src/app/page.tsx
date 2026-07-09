import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import WorldCupBanner from '@/components/sections/WorldCupBanner';
import LiveScoresSection from '@/components/sections/LiveScoresSection';
import VideoHighlightsSection from '@/components/sections/VideoHighlightsSection';
import LatestNewsSection from '@/components/sections/LatestNewsSection';
import TransferNewsSection from '@/components/sections/TransferNewsSection';
import PredictionsSection from '@/components/sections/PredictionsSection';
import LeagueTableWidget from '@/components/widgets/LeagueTableWidget';
import TrendingWidget from '@/components/widgets/TrendingWidget';

export const metadata: Metadata = {
  title: 'GoalRush Global — Football Never Sleeps',
  description: 'Live football scores, breaking news, transfer updates, and match predictions from every major league worldwide.',
  alternates: { canonical: '/' },
};

export const revalidate = 60; // ISR — revalidate every 60 seconds

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* World Cup 2026 — Featured Banner (shows until July 19) */}
      <WorldCupBanner />

      {/* Hero — Breaking News + Featured Match */}
      <HeroSection />

      {/* Live Scores */}
      <section className="max-w-screen-2xl mx-auto px-4 lg:px-6 mt-10">
        <LiveScoresSection />
      </section>

      {/* WC 2026 Video Highlights */}
      <section className="max-w-screen-2xl mx-auto px-4 lg:px-6 mt-10">
        <VideoHighlightsSection />
      </section>

      {/* Main Content Grid */}
      <section className="max-w-screen-2xl mx-auto px-4 lg:px-6 mt-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
          {/* Left Column */}
          <div className="space-y-12">
            <LatestNewsSection />
            <TransferNewsSection />
            <PredictionsSection />
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            <LeagueTableWidget leagueId={39} leagueName="Premier League" />
            <TrendingWidget />
            {/* Ad placeholder */}
            <div className="gr-card p-4 text-center">
              <div className="h-64 bg-brand-dark rounded-lg flex items-center justify-center border border-dashed border-brand-border">
                <span className="text-brand-gray text-xs">Advertisement</span>
              </div>
            </div>
            <LeagueTableWidget leagueId={140} leagueName="La Liga" />
          </aside>
        </div>
      </section>
    </div>
  );
}
