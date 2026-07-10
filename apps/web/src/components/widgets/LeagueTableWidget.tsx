import { parseFormColor } from '@/lib/utils';
import type { Standing } from '@/lib/types';

interface LeagueTableWidgetProps {
  leagueId: number;
  leagueName: string;
}

// Final 2024/25 season standings (on summer break during WC 2026)
const FALLBACK: Record<number, Standing[]> = {
  // Premier League — Liverpool won 2024/25
  39: [
    { rank: 1, team: { id: 40,  name: 'Liverpool',    shortName: 'LIV', logo: '', country: 'England' }, played: 38, won: 28, drawn: 6,  lost: 4,  goalsFor: 90, goalsAgainst: 37, goalDiff: 53, points: 90, form: 'WWWDW' },
    { rank: 2, team: { id: 42,  name: 'Arsenal',      shortName: 'ARS', logo: '', country: 'England' }, played: 38, won: 24, drawn: 8,  lost: 6,  goalsFor: 79, goalsAgainst: 40, goalDiff: 39, points: 80, form: 'WWWLW' },
    { rank: 3, team: { id: 65,  name: 'Nott\'m Forest', shortName: 'NFO', logo: '', country: 'England' }, played: 38, won: 18, drawn: 10, lost: 10, goalsFor: 55, goalsAgainst: 47, goalDiff:  8, points: 64, form: 'DLWDW' },
    { rank: 4, team: { id: 49,  name: 'Chelsea',      shortName: 'CHE', logo: '', country: 'England' }, played: 38, won: 18, drawn: 9,  lost: 11, goalsFor: 67, goalsAgainst: 55, goalDiff: 12, points: 63, form: 'WWDLW' },
    { rank: 5, team: { id: 50,  name: 'Man City',     shortName: 'MCI', logo: '', country: 'England' }, played: 38, won: 17, drawn: 9,  lost: 12, goalsFor: 64, goalsAgainst: 56, goalDiff:  8, points: 60, form: 'WDLWL' },
    { rank: 6, team: { id: 34,  name: 'Newcastle',    shortName: 'NEW', logo: '', country: 'England' }, played: 38, won: 16, drawn: 8,  lost: 14, goalsFor: 58, goalsAgainst: 53, goalDiff:  5, points: 56, form: 'LDWWW' },
  ],
  // La Liga — Barcelona won 2024/25
  140: [
    { rank: 1, team: { id: 529, name: 'Barcelona',      shortName: 'BAR', logo: '', country: 'Spain' }, played: 38, won: 27, drawn: 6,  lost: 5,  goalsFor: 94, goalsAgainst: 38, goalDiff: 56, points: 87, form: 'WWWWW' },
    { rank: 2, team: { id: 541, name: 'Real Madrid',    shortName: 'RMA', logo: '', country: 'Spain' }, played: 38, won: 24, drawn: 7,  lost: 7,  goalsFor: 81, goalsAgainst: 43, goalDiff: 38, points: 79, form: 'WDWWL' },
    { rank: 3, team: { id: 530, name: 'Atlético Madrid',shortName: 'ATM', logo: '', country: 'Spain' }, played: 38, won: 21, drawn: 8,  lost: 9,  goalsFor: 66, goalsAgainst: 41, goalDiff: 25, points: 71, form: 'WWDLW' },
    { rank: 4, team: { id: 531, name: 'Athletic Bilbao',shortName: 'ATH', logo: '', country: 'Spain' }, played: 38, won: 19, drawn: 8,  lost: 11, goalsFor: 58, goalsAgainst: 44, goalDiff: 14, points: 65, form: 'WDLWW' },
    { rank: 5, team: { id: 533, name: 'Villarreal',     shortName: 'VIL', logo: '', country: 'Spain' }, played: 38, won: 17, drawn: 9,  lost: 12, goalsFor: 60, goalsAgainst: 51, goalDiff:  9, points: 60, form: 'DWWLD' },
    { rank: 6, team: { id: 548, name: 'Real Sociedad',  shortName: 'RSO', logo: '', country: 'Spain' }, played: 38, won: 16, drawn: 10, lost: 12, goalsFor: 55, goalsAgainst: 48, goalDiff:  7, points: 58, form: 'LDWDW' },
  ],
  // Serie A — Inter Milan won 2024/25
  2019: [
    { rank: 1, team: { id: 505, name: 'Inter Milan',  shortName: 'INT', logo: '', country: 'Italy' }, played: 38, won: 27, drawn: 7,  lost: 4,  goalsFor: 89, goalsAgainst: 34, goalDiff: 55, points: 88, form: 'WWWWW' },
    { rank: 2, team: { id: 489, name: 'Napoli',       shortName: 'NAP', logo: '', country: 'Italy' }, played: 38, won: 24, drawn: 8,  lost: 6,  goalsFor: 74, goalsAgainst: 38, goalDiff: 36, points: 80, form: 'WWDWL' },
    { rank: 3, team: { id: 496, name: 'Juventus',     shortName: 'JUV', logo: '', country: 'Italy' }, played: 38, won: 21, drawn: 9,  lost: 8,  goalsFor: 67, goalsAgainst: 41, goalDiff: 26, points: 72, form: 'WDWWL' },
    { rank: 4, team: { id: 492, name: 'Atalanta',     shortName: 'ATA', logo: '', country: 'Italy' }, played: 38, won: 20, drawn: 8,  lost: 10, goalsFor: 70, goalsAgainst: 47, goalDiff: 23, points: 68, form: 'LWWWD' },
    { rank: 5, team: { id: 488, name: 'AC Milan',     shortName: 'MIL', logo: '', country: 'Italy' }, played: 38, won: 18, drawn: 9,  lost: 11, goalsFor: 62, goalsAgainst: 48, goalDiff: 14, points: 63, form: 'WLDWW' },
    { rank: 6, team: { id: 487, name: 'Lazio',        shortName: 'LAZ', logo: '', country: 'Italy' }, played: 38, won: 17, drawn: 8,  lost: 13, goalsFor: 59, goalsAgainst: 52, goalDiff:  7, points: 59, form: 'DWWLD' },
  ],
  // MLS — LA Galaxy won 2025 MLS Cup
  2016: [
    { rank: 1, team: { id: 1607, name: 'LA Galaxy',       shortName: 'LAG', logo: '', country: 'USA' }, played: 34, won: 20, drawn: 7,  lost: 7,  goalsFor: 68, goalsAgainst: 42, goalDiff: 26, points: 67, form: 'WWWWW' },
    { rank: 2, team: { id: 1608, name: 'LAFC',            shortName: 'LAF', logo: '', country: 'USA' }, played: 34, won: 18, drawn: 9,  lost: 7,  goalsFor: 62, goalsAgainst: 38, goalDiff: 24, points: 63, form: 'WDWWL' },
    { rank: 3, team: { id: 1599, name: 'Inter Miami',     shortName: 'MIA', logo: '', country: 'USA' }, played: 34, won: 17, drawn: 8,  lost: 9,  goalsFor: 65, goalsAgainst: 48, goalDiff: 17, points: 59, form: 'WWDLW' },
    { rank: 4, team: { id: 1581, name: 'Columbus Crew',   shortName: 'CLB', logo: '', country: 'USA' }, played: 34, won: 16, drawn: 7,  lost: 11, goalsFor: 54, goalsAgainst: 45, goalDiff:  9, points: 55, form: 'WDLWW' },
    { rank: 5, team: { id: 1580, name: 'NY City FC',      shortName: 'NYC', logo: '', country: 'USA' }, played: 34, won: 14, drawn: 9,  lost: 11, goalsFor: 50, goalsAgainst: 46, goalDiff:  4, points: 51, form: 'LDWDW' },
    { rank: 6, team: { id: 1577, name: 'Seattle Sounders',shortName: 'SEA', logo: '', country: 'USA' }, played: 34, won: 13, drawn: 8,  lost: 13, goalsFor: 48, goalsAgainst: 49, goalDiff: -1, points: 47, form: 'WLLWW' },
  ],
};

const DEFAULT_STANDINGS: Standing[] = FALLBACK[39];

export default function LeagueTableWidget({ leagueId, leagueName }: LeagueTableWidgetProps) {
  const standings = FALLBACK[leagueId] ?? DEFAULT_STANDINGS;

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

      {/* Zone legend */}
      <div className="px-4 py-3 border-t border-brand-border flex items-center gap-4 text-[10px] text-brand-gray">
        {leagueId === 2016 ? (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-brand-red rounded-full" /> Playoff
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-brand-gold rounded-full" /> Supporters' Shield
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-brand-red rounded-full" /> Champions League
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-brand-gold rounded-full" /> Europa League
            </span>
          </>
        )}
      </div>
    </div>
  );
}
