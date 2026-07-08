import type { Metadata } from 'next';
import { Users, Trophy, Star, Flag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'World Cup 2026 Teams',
  description: 'All 8 FIFA World Cup 2026 quarter-finalists with squad profiles, tournament stats, and knockout path.',
};

export const revalidate = 300;

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://renewed-ambition-production-ea0a.up.railway.app';

async function fetchStandings() {
  try {
    const res = await fetch(`${BASE}/world-cup/standings`, { next: { revalidate: 300 } });
    if (res.ok) { const { data } = await res.json(); return data ?? []; }
  } catch {}
  return [];
}

const QF_TEAMS = [
  {
    name: 'Spain', code: 'ESP', flag: '🇪🇸', group: 'A Winners', manager: 'Luis de la Fuente',
    formation: '4-3-3', ranking: 2, goalsFor: 14, goalsAgainst: 3,
    keyPlayers: ['Lamine Yamal (7G 5A)', 'Pedri (4A)', 'Morata (5G)'],
    form: 'WWWWW', strength: 92,
    path: ['Group A — 1st', 'R16: vs Japan 2–0', 'QF: TBD'],
    info: 'Imperious in every phase. Yamal has been the tournament\'s standout player at just 18.',
  },
  {
    name: 'Germany', code: 'GER', flag: '🇩🇪', group: 'B Runners-Up', manager: 'Julian Nagelsmann',
    formation: '4-2-3-1', ranking: 4, goalsFor: 11, goalsAgainst: 6,
    keyPlayers: ['Florian Wirtz (4G 3A)', 'Kai Havertz (5G)', 'Kimmich (4A)'],
    form: 'WDWWW', strength: 87,
    path: ['Group B — 2nd', 'R16: vs Belgium 2–1', 'QF: TBD'],
    info: 'Defensively exposed at times but deadly on the counter with Wirtz pulling strings.',
  },
  {
    name: 'France', code: 'FRA', flag: '🇫🇷', group: 'C Winners', manager: 'Didier Deschamps',
    formation: '4-3-3', ranking: 3, goalsFor: 9, goalsAgainst: 4,
    keyPlayers: ['Kylian Mbappé (6G 2A)', 'Griezmann (3A)', 'Camavinga (CM)'],
    form: 'WWWLW', strength: 89,
    path: ['Group C — 1st', 'R16: vs Poland 4–1', 'QF: TBD'],
    info: 'La machine is purring. Mbappé at his irresistible best — already the Golden Boot frontrunner.',
  },
  {
    name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'D Winners', manager: 'Gareth Southgate',
    formation: '4-2-3-1', ranking: 5, goalsFor: 10, goalsAgainst: 5,
    keyPlayers: ['Harry Kane (5G)', 'Bellingham (3G 4A)', 'Saka (3G 3A)'],
    form: 'WWWDW', strength: 85,
    path: ['Group D — 1st', 'R16: vs Senegal 2–0', 'QF: TBD'],
    info: 'Defensively solid and clinical in front of goal. It\'s finally coming home? This squad says yes.',
  },
  {
    name: 'Brazil', code: 'BRA', flag: '🇧🇷', group: 'E Winners', manager: 'Fernando Diniz',
    formation: '4-2-3-1', ranking: 1, goalsFor: 16, goalsAgainst: 4,
    keyPlayers: ['Vinícius Jr (5G 4A)', 'Rodrygo (4G)', 'Casemiro (DM)'],
    form: 'WWWWW', strength: 91,
    path: ['Group E — 1st', 'R16: vs Mexico 3–1', 'QF: TBD'],
    info: 'The most dangerous attack in the tournament. Vinicius Jr is terrifying defenders at every turn.',
  },
  {
    name: 'Argentina', code: 'ARG', flag: '🇦🇷', group: 'F Winners', manager: 'Lionel Scaloni',
    formation: '4-3-3', ranking: 1, goalsFor: 13, goalsAgainst: 5,
    keyPlayers: ['Lionel Messi (4G 6A)', 'Julián Álvarez (5G)', 'Mac Allister (CM)'],
    form: 'DWWWW', strength: 90,
    path: ['Group F — 1st', 'R16: vs Morocco 2–1 AET', 'QF: TBD'],
    info: 'The world champions grinding through. Messi showing the world he still has another miracle in him.',
  },
  {
    name: 'Portugal', code: 'POR', flag: '🇵🇹', group: 'G Winners', manager: 'Roberto Martínez',
    formation: '4-2-3-1', ranking: 6, goalsFor: 12, goalsAgainst: 4,
    keyPlayers: ['Cristiano Ronaldo (4G)', 'Bruno Fernandes (2G 5A)', 'Rafael Leão (3G 3A)'],
    form: 'WWWWW', strength: 86,
    path: ['Group G — 1st', 'R16: vs Switzerland 3–0', 'QF: TBD'],
    info: 'Ronaldo\'s final World Cup, and he\'s making it count. A balanced squad with genuine depth.',
  },
  {
    name: 'USA', code: 'USA', flag: '🇺🇸', group: 'H Winners', manager: 'Gregg Berhalter',
    formation: '4-3-3', ranking: 13, goalsFor: 8, goalsAgainst: 6,
    keyPlayers: ['Christian Pulisic (4G 2A)', 'Gio Reyna (3G)', 'Tyler Adams (DM)'],
    form: 'WWDWW', strength: 78,
    path: ['Group H — 1st', 'R16: vs Iran 2–1', 'QF: TBD'],
    info: 'The great hosts surprise. America\'s finest generation — buoyed by 80,000-strong home crowds.',
  },
];

function FormBadge({ result }: { result: string }) {
  const colors: Record<string, string> = { W: 'bg-emerald-500', D: 'bg-amber-500', L: 'bg-red-500' };
  return <span className={`w-5 h-5 rounded-full ${colors[result] ?? 'bg-brand-muted'} flex items-center justify-center text-[9px] font-bold text-white`}>{result}</span>;
}

function StrengthBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? 'bg-yellow-400' : pct >= 85 ? 'bg-emerald-500' : pct >= 80 ? 'bg-blue-400' : 'bg-brand-red';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-brand-dark rounded-full h-1.5"><div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }}/></div>
      <span className="text-xs text-brand-gray w-7 text-right">{pct}</span>
    </div>
  );
}

export default async function TeamsPage() {
  await fetchStandings();

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-wider text-white flex items-center gap-3 mb-2">
          <Users className="w-7 h-7 text-brand-gold"/>TEAMS
        </h1>
        <p className="text-brand-gray">FIFA World Cup 2026 — Quarter-Finalists</p>
      </div>

      {/* Tournament info strip */}
      <div className="gr-card p-5 mb-8 bg-gradient-to-r from-brand-card to-brand-dark border border-yellow-500/20">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400"/>
            <div><div className="text-white font-semibold text-sm">Quarter-Finals</div><div className="text-brand-gray text-xs">July 10–12 · 8 Nations Remain</div></div>
          </div>
          {[{l:'Host Nations',v:'3'},{l:'Continents',v:'6'},{l:'Goals Scored',v:'93'},{l:'Avg per Game',v:'2.9'}].map(s=>(
            <div key={s.l} className="text-center">
              <div className="font-display text-2xl text-brand-gold">{s.v}</div>
              <div className="text-brand-gray text-xs">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* QF matchups preview */}
      <div className="gr-card mb-8 border border-yellow-500/20">
        <div className="px-5 py-4 border-b border-yellow-500/20">
          <h2 className="text-yellow-400 font-semibold flex items-center gap-2"><Star className="w-4 h-4"/>Quarter-Final Draw</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-yellow-500/10">
          {[['Spain','Germany'],['France','England'],['Brazil','Argentina'],['Portugal','USA']].map(([h,a],i)=>(
            <div key={i} className="px-5 py-4 flex items-center justify-between gap-4">
              <span className="text-white font-semibold text-sm">{h}</span>
              <span className="text-yellow-400 text-xs font-bold px-3 py-1 bg-yellow-500/10 rounded">QF {i+1}</span>
              <span className="text-white font-semibold text-sm text-right">{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Teams grid */}
      <h2 className="gr-section-title mb-6">Squad Profiles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {QF_TEAMS.map(team => (
          <div key={team.code} className="gr-card p-6 hover:border-yellow-500/20 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{team.flag}</span>
                <div>
                  <h3 className="text-white font-bold text-lg">{team.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-brand-gray text-xs">{team.group}</span>
                    <span className="text-brand-muted">·</span>
                    <Flag className="w-3 h-3 text-brand-muted"/>
                    <span className="text-brand-gray text-xs">{team.manager}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg text-brand-gold">{team.goalsFor}</div>
                <div className="text-brand-gray text-[10px]">goals</div>
              </div>
            </div>

            {/* Strength bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-brand-gray text-xs">AI Strength Rating</span>
                <span className="text-xs font-bold text-white">{team.formation}</span>
              </div>
              <StrengthBar pct={team.strength}/>
            </div>

            {/* Form */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-brand-gray text-xs w-10">Form</span>
              <div className="flex gap-1">{team.form.split('').map((r,i)=><FormBadge key={i} result={r}/>)}</div>
              <span className="text-brand-gray text-xs ml-auto">{team.goalsFor}–{team.goalsAgainst}</span>
            </div>

            {/* Key players */}
            <div className="mb-4">
              <div className="text-brand-gray text-xs mb-2">Key Players</div>
              <div className="flex flex-wrap gap-1.5">
                {team.keyPlayers.map(p=>(
                  <span key={p} className="px-2 py-0.5 bg-brand-dark text-brand-gray text-xs rounded">{p}</span>
                ))}
              </div>
            </div>

            {/* Tournament path */}
            <div className="mb-4">
              <div className="text-brand-gray text-xs mb-2">Tournament Path</div>
              <div className="flex flex-wrap gap-1.5">
                {team.path.map((p,i)=>(
                  <span key={i} className={`px-2 py-0.5 rounded text-xs ${p.includes('QF')?'bg-yellow-500/10 text-yellow-400':'bg-brand-dark text-brand-gray'}`}>{p}</span>
                ))}
              </div>
            </div>

            <p className="text-brand-gray text-xs italic border-t border-brand-border pt-3 leading-relaxed">{team.info}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
