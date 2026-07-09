const axios = require('axios');
const { cacheGetOrSet } = require('../config/redis');

// football-data.org v4 — free tier covers WC, CL, PL, PD, BL1, SA, FL1, DED, PPL
const apiClient = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_KEY },
  timeout: 10_000,
});

// Internal league IDs → football-data.org competition codes
const ID_TO_CODE = {
  1:   'WC',   // FIFA World Cup
  2:   'CL',   // UEFA Champions League
  39:  'PL',   // Premier League
  140: 'PD',   // La Liga
  78:  'BL1',  // Bundesliga
  135: 'SA',   // Serie A
  61:  'FL1',  // Ligue 1
  88:  'DED',  // Eredivisie
  94:  'PPL',  // Primeira Liga
};

const ALL_CODES = Object.values(ID_TO_CODE).join(',');

const LEAGUES = {
  WORLD_CUP:      { id: 1,   code: 'WC',  season: 2026, name: 'FIFA World Cup'         },
  CHAMPIONS:      { id: 2,   code: 'CL',  season: 2025, name: 'UEFA Champions League'  },
  PREMIER_LEAGUE: { id: 39,  code: 'PL',  season: 2025, name: 'Premier League'         },
  LA_LIGA:        { id: 140, code: 'PD',  season: 2025, name: 'La Liga'                },
  BUNDESLIGA:     { id: 78,  code: 'BL1', season: 2025, name: 'Bundesliga'             },
  SERIE_A:        { id: 135, code: 'SA',  season: 2025, name: 'Serie A'               },
  LIGUE_1:        { id: 61,  code: 'FL1', season: 2025, name: 'Ligue 1'              },
  EREDIVISIE:     { id: 88,  code: 'DED', season: 2025, name: 'Eredivisie'           },
  PRIMEIRA_LIGA:  { id: 94,  code: 'PPL', season: 2025, name: 'Primeira Liga'        },
};

// ─── Live fixtures ─────────────────────────────────────────────────────────

async function getLiveFixtures(leagueId = null) {
  const cacheKey = `live:fdo${leagueId ? `:${leagueId}` : ''}`;
  return cacheGetOrSet(cacheKey, async () => {
    const liveStatus = 'IN_PLAY,PAUSED,EXTRA_TIME,PENALTY_SHOOTOUT';
    if (leagueId && ID_TO_CODE[leagueId]) {
      const { data } = await apiClient.get(`/competitions/${ID_TO_CODE[leagueId]}/matches`, {
        params: { status: liveStatus },
      });
      return normalizeMatches(data.matches || [], leagueId);
    }
    const { data } = await apiClient.get('/matches', {
      params: { status: liveStatus, competitions: ALL_CODES },
    });
    return normalizeMatches(data.matches || []);
  }, 30);
}

// ─── Fixtures by date ──────────────────────────────────────────────────────

async function getFixturesByDate(date, leagueId = null) {
  const cacheKey = `fdo:date:${date}${leagueId ? `:${leagueId}` : ''}`;
  return cacheGetOrSet(cacheKey, async () => {
    if (leagueId && ID_TO_CODE[leagueId]) {
      const { data } = await apiClient.get(`/competitions/${ID_TO_CODE[leagueId]}/matches`, {
        params: { dateFrom: date, dateTo: date },
      });
      return normalizeMatches(data.matches || [], leagueId);
    }
    const { data } = await apiClient.get('/matches', {
      params: { dateFrom: date, dateTo: date, competitions: ALL_CODES },
    });
    return normalizeMatches(data.matches || []);
  }, 300);
}

// ─── Fixtures by league & date range ──────────────────────────────────────

async function getFixturesByLeague(leagueId, season, { from, to, status, last } = {}) {
  const code = ID_TO_CODE[leagueId];
  if (!code) return [];
  const key = [leagueId, season, from, to, status, last].join(':');
  return cacheGetOrSet(`fdo:league:${key}`, async () => {
    const params = {};
    if (from)   params.dateFrom = from;
    if (to)     params.dateTo   = to;
    if (status) params.status   = status === 'LIVE' ? 'IN_PLAY,EXTRA_TIME' : status;
    const { data } = await apiClient.get(`/competitions/${code}/matches`, { params });
    let matches = normalizeMatches(data.matches || [], leagueId);
    if (last) matches = matches.slice(-Math.abs(last));
    return matches;
  }, 300);
}

// ─── Single fixture ────────────────────────────────────────────────────────

async function getFixtureById(id) {
  return cacheGetOrSet(`fdo:match:${id}`, async () => {
    const { data } = await apiClient.get(`/matches/${id}`);
    return normalizeMatch(data);
  }, 60);
}

// ─── Standings ─────────────────────────────────────────────────────────────

async function getStandings(leagueId, season = new Date().getFullYear()) {
  const code = ID_TO_CODE[leagueId];
  if (!code) return [];
  return cacheGetOrSet(`fdo:standings:${leagueId}:${season}`, async () => {
    const { data } = await apiClient.get(`/competitions/${code}/standings`);
    const total = (data.standings || []).find(s => s.type === 'TOTAL');
    if (!total) return [];
    return (total.table || []).map(s => ({
      rank:         s.position,
      team: {
        id:         s.team.id,
        name:       s.team.name,
        shortName:  s.team.shortName || s.team.tla || s.team.name,
        logo:       s.team.crest || '',
        country:    '',
      },
      played:       s.playedGames,
      won:          s.won,
      drawn:        s.draw,
      lost:         s.lost,
      goalsFor:     s.goalsFor,
      goalsAgainst: s.goalsAgainst,
      goalDiff:     s.goalDifference,
      points:       s.points,
      form:         s.form || '',
    }));
  }, 3600);
}

// ─── Top scorers ───────────────────────────────────────────────────────────

async function getTopScorers(leagueId, season = new Date().getFullYear()) {
  const code = ID_TO_CODE[leagueId];
  if (!code) return [];
  return cacheGetOrSet(`fdo:scorers:${leagueId}:${season}`, async () => {
    const { data } = await apiClient.get(`/competitions/${code}/scorers`);
    return (data.scorers || []).map(s => ({
      id:          s.player.id,
      name:        s.player.name,
      firstName:   s.player.firstName || '',
      lastName:    s.player.lastName  || '',
      nationality: s.player.nationality || '',
      age:         null,
      photo:       '',
      position:    'Forward',
      teamId:      s.team?.id,
      team:        s.team ? { id: s.team.id, name: s.team.name, logo: s.team.crest || '' } : null,
      stats: {
        goals:         s.goals        || 0,
        assists:       s.assists      || 0,
        appearances:   s.playedMatches || 0,
        minutesPlayed: 0,
        yellowCards:   0,
        redCards:      0,
        rating:        0,
      },
    }));
  }, 3600);
}

// ─── Stubs (not in free tier) ──────────────────────────────────────────────

async function getFixtureStatistics() { return []; }
async function getFixtureLineups()    { return []; }
async function getH2H()               { return []; }
async function getPredictions()       { return null; }
async function getInjuries()          { return []; }
async function getTopAssists(leagueId, season) { return getTopScorers(leagueId, season); }

// ─── Normalisers ───────────────────────────────────────────────────────────

function normalizeMatches(matches, fallbackLeagueId = null) {
  return matches.map(m => normalizeMatch(m, fallbackLeagueId));
}

function normalizeMatch(m, fallbackLeagueId = null) {
  const comp = m.competition || {};
  const leagueId = fallbackLeagueId
    ?? Number(Object.entries(ID_TO_CODE).find(([, c]) => c === comp.code)?.[0] ?? 0);

  return {
    id:       m.id,
    status:   normalizeStatus(m.status),
    minute:   m.minute ?? null,
    date:     m.utcDate,
    venue:    null,
    city:     null,
    referee:  null,
    homeTeam: {
      id:        m.homeTeam?.id   ?? 0,
      name:      m.homeTeam?.name ?? 'TBD',
      shortName: m.homeTeam?.shortName || m.homeTeam?.tla || (m.homeTeam?.name ?? '').slice(0, 12),
      logo:      m.homeTeam?.crest ?? '',
      country:   '',
      winner:    m.score?.winner === 'HOME_TEAM',
    },
    awayTeam: {
      id:        m.awayTeam?.id   ?? 0,
      name:      m.awayTeam?.name ?? 'TBD',
      shortName: m.awayTeam?.shortName || m.awayTeam?.tla || (m.awayTeam?.name ?? '').slice(0, 12),
      logo:      m.awayTeam?.crest ?? '',
      country:   '',
      winner:    m.score?.winner === 'AWAY_TEAM',
    },
    homeScore:      m.score?.fullTime?.home  ?? null,
    awayScore:      m.score?.fullTime?.away  ?? null,
    halftimeScore:  { home: m.score?.halfTime?.home  ?? null, away: m.score?.halfTime?.away  ?? null },
    fulltimeScore:  { home: m.score?.fullTime?.home  ?? null, away: m.score?.fullTime?.away  ?? null },
    extraTimeScore: { home: null, away: null },
    penaltiesScore: { home: null, away: null },
    league: {
      id:        Number(leagueId),
      name:      comp.name || '',
      shortName: comp.code || '',
      logo:      comp.emblem || '',
      country:   '',
      season:    m.season?.startDate?.slice(0, 4) ?? new Date().getFullYear(),
      round:     m.matchday ? `Matchday ${m.matchday}` : (m.stage ?? ''),
      type:      'Cup',
    },
    events: [],
  };
}

function normalizeStatus(s) {
  const map = {
    SCHEDULED:         'SCHEDULED',
    TIMED:             'SCHEDULED',
    IN_PLAY:           'LIVE',
    PAUSED:            'HT',
    EXTRA_TIME:        'LIVE',
    PENALTY_SHOOTOUT:  'PEN',
    FINISHED:          'FT',
    POSTPONED:         'PST',
    SUSPENDED:         'SUSP',
    CANCELLED:         'CANC',
  };
  return map[s] ?? 'SCHEDULED';
}

module.exports = {
  apiClient,
  LEAGUES,
  getLiveFixtures,
  getFixturesByDate,
  getFixturesByLeague,
  getFixtureById,
  getFixtureStatistics,
  getFixtureLineups,
  getH2H,
  getStandings,
  getTopScorers,
  getTopAssists,
  getInjuries,
  getPredictions,
};
