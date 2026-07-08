'use client';

import ListenButton from './ListenButton';

interface WCSummaryPlayerProps {
  stage: string;
  daysLeft: number;
  topScorers: { name: string; nationality: string; goals: number }[];
}

export default function WCSummaryPlayer({ stage, daysLeft, topScorers }: WCSummaryPlayerProps) {
  const scorerLines = topScorers
    .slice(0, 5)
    .map((s, i) => `${i + 1}. ${s.name} of ${s.nationality} with ${s.goals} goals`)
    .join(', ');

  const summary = `FIFA World Cup 2026 audio recap.
We are currently in the ${stage} stage.
${daysLeft > 0 ? `${daysLeft} days remain until the World Cup Final on July 19th at MetLife Stadium in New Jersey.` : 'The World Cup Final is today at MetLife Stadium in New Jersey.'}
The top scorers so far are: ${scorerLines}.
This has been your GoalRush Global World Cup audio update. Football Never Sleeps.`;

  return (
    <ListenButton
      text={summary}
      title="World Cup 2026 Audio Recap"
      className="text-xs"
    />
  );
}
