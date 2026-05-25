import { parseFormColor } from '@/lib/utils';
import type { Standing } from '@/lib/types';

interface LeagueTableWidgetProps {
  leagueId: number;
  leagueName: string;
}

const MOCK_STANDINGS: Standing[] = [
  { rank: 1, team: { id: 42, name: 'Arsenal', shortName: 'ARS', logo: '', country: 'England' }, played: 35, won: 24, drawn: 6, lost: 5, goalsFor: 82, goalsAgainst: 34, goalDiff: 48, points: 78, form: 'WWWDW' },
  { rank: 2, team: { id: 50, name: 'Man City', shortName: 'MCI', logo: '', country: 'England' }, played: 35, won: 23, drawn: 7, lost: 5, goalsFor: 78, goalsAgainst: 38, goalDiff: 40, points: 76, form: 'WWLDW' },
  { rank: 3, team: { id: 34, name: 'Liverpool', shortName: 'LIV', logo: '', country: 'England' }, played: 35, won: 22, drawn: 8, lost: 5, goalsFor: 75, goalsAgainst: 40, goalDiff: 35, points: 74, form: 'DWWWW' },
  { rank: 4, team: { id: 49, name: 'Chelsea', shortName: 'CHE', logo: '', country: 'England' }, played: 35, won: 20, drawn: 7, lost: 8, goalsFor: 68, goalsAgainst: 46, goalDiff: 22, points: 67, form: 'WDWLW' },
  { rank: 5, team: { id: 47, name: 'Tottenham', shortName: 'TOT', logo: '', country: 'England' }, played: 35, won: 18, drawn: 9, lost: 8, goalsFor: 64, goalsAgainst: 48, goalDiff: 16, points: 63, form: 'DLWWD' },
  { rank: 6, team: { id: 33, name: 'Man United', shortName: 'MUN', logo: '', country: 'England' }, played: 35, won: 16, drawn: 8, lost: 11, goalsFor: 54, goalsAgainst: 52, goalDiff: 2, points: 56, form: 'WLLWD' },
];

export default function LeagueTableWidget({ leagueId, leagueName }: LeagueTableWidgetProps) {
  const standings = MOCK_STANDINGS;

  return (
    <div className="gr-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
        <h3 className="text-white font-semibold text-sm">{leagueName}</h3>
        <a href={`/league/${leagueId}/table`} className="text-brand-red text-xs font-semibold hover:underline">
          Full Table →
        </a>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 px-4 py-2 text-brand-gray text-[10px] font-semibold uppercase tracking-wider border-b border-brand-border">
        <span className="w-5">#</span>
        <span>Team</span>
        <span className="w-7 text-center">P</span>
        <span className="w-7 text-center">GD</span>
        <span className="w-7 text-center font-bold text-white">Pts</span>
        <span className="w-16 text-center">Form</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-brand-border/50">
        {standings.map(s => (
          <div
            key={s.rank}
            className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 items-center px-4 py-2.5 hover:bg-brand-card transition-colors ${
              s.rank <= 4 ? 'border-l-2 border-brand-red' : ''
            }`}
          >
            <span className="text-brand-gray text-xs w-5">{s.rank}</span>
            <span className="text-white text-xs font-medium truncate">{s.team.shortName}</span>
            <span className="text-brand-gray text-xs w-7 text-center">{s.played}</span>
            <span className={`text-xs w-7 text-center ${s.goalDiff > 0 ? 'text-live' : s.goalDiff < 0 ? 'text-brand-red' : 'text-brand-gray'}`}>
              {s.goalDiff > 0 ? `+${s.goalDiff}` : s.goalDiff}
            </span>
            <span className="text-white text-xs font-bold w-7 text-center">{s.points}</span>
            <div className="flex gap-0.5 justify-end">
              {s.form.split('').map((r, i) => (
                <span
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center text-white ${parseFormColor(r)}`}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Champions League zone legend */}
      <div className="px-4 py-3 border-t border-brand-border flex items-center gap-4 text-[10px] text-brand-gray">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-brand-red rounded-full" /> Champions League
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-brand-gold rounded-full" /> Europa League
        </span>
      </div>
    </div>
  );
}
