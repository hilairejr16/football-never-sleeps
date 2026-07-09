import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Match Predictions — World Cup 2026 Quarter-Finals',
  description: 'AI-powered match predictions and win probability for FIFA World Cup 2026 quarter-finals. Spain vs Germany, France vs Brazil and more with detailed analysis.',
  alternates: { canonical: '/predictions' },
  openGraph: {
    title: 'AI Match Predictions — World Cup 2026 | GoalRush Global',
    description: 'Win probability and AI analysis for every World Cup 2026 quarter-final.',
  },
};

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
