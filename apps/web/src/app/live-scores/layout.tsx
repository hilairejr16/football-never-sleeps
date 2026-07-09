import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Football Scores — World Cup 2026 & Major Leagues',
  description: 'Live match scores, real-time goals, and minute-by-minute updates from FIFA World Cup 2026, Premier League, La Liga, and every major football league.',
  alternates: { canonical: '/live-scores' },
  openGraph: {
    title: 'Live Football Scores — GoalRush Global',
    description: 'Real-time scores from World Cup 2026 and every major league. Football never stops.',
  },
};

export default function LiveScoresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
