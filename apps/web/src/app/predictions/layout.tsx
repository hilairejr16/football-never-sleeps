import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Match Predictions — World Cup 2026 Quarter-Finals',
  description: 'AI-powered match predictions and win probability for FIFA World Cup 2026 quarter-finals. France vs Morocco, Spain vs Belgium, Norway vs England, Argentina vs Switzerland.',
  alternates: { canonical: '/predictions' },
  openGraph: {
    title: 'AI Match Predictions — World Cup 2026 | GoalRush Global',
    description: 'Win probability and AI analysis for France vs Morocco, Spain vs Belgium, Norway vs England and Argentina vs Switzerland.',
  },
};

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
