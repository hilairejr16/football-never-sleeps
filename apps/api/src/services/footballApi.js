const axios = require('axios');
const { cacheGetOrSet } = require('../config/redis');

// Shared client — imported by route files so the key is injected once
const apiClient = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-rapidapi-host': 'v3.football.api-sports.io',
    'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
  },
  timeout: 10_000,
});

// ─── League catalogue ─────────────────────────────────────
const LEAGUES = {
  WORLD_CUP:      { id: 1,   season: 2026, name: 'FIFA World Cup'          },
  GOLD_CUP:       { id: 22,  season: 2025, name: 'CONCACAF Gold Cup'       },
  CHAMPIONS:      { id: 2,   season: 2025, name: 'UEFA Champions League'   },
  EUROPA:         { id: 3,   season: 2025, name: 'UEFA Europa League'      },
  CONFERENCE:     { id: 848, season: 2025, name: 'UEFA Conference League'  },
  PREMIER_LEAGUE: { id: 39,  season: 2025, name: 'Premier League'          },
  LA_LIGA:        { id: 140, season: 2025, name: 'La Liga'                 },
  BUNDESLIGA:     { id: 78,  season: 2025, name: 'Bundesliga'              },
  SERIE_A:        { id: 135, season: 2025, name: 'Serie A'                 },
  LIGUE_1:        { id: 61,  season: 2025, name: 'Ligue 1'                 },
  EREDIVISIE:     { id: 88,  season: 2025, name: 'Eredivisie'              },
  PRIMEIRA_LIGA:  { id: 94,  season: 2025, name: 'Primeira Liga'           },
  MLS:            { id: 253, season: 2026, name: 'MLS'                     },
  SAUDI_PRO:      { id: 307, season: 2025, name: 'Saudi Pro League'        },
  COPA_LIBERTADORES: { id: 13, season: 2026, name: 'Copa Libertadores'     },
  AFCON:          { id: 6,   season: 2025, name: 'Africa Cup of Nations'   },
};

// ─── Live fixtures ────────────────────────────────────────

async function getLiveFixtures(leagueId = null) {
  const cacheKey = `live:fixtures${leagueId ? `:${leagueId}` : ''}`;
  return cacheGetOrSet(cacheKey, async () => {
    const params = { live: 'all' };
    if (leagueId) params.league = leagueId;
    const { data } = await apiClient.get('/fixtures', { params });
    return normalizeFixtures(data.response || []);
  }, 30);
}

// ─── Fixtures by date ─────────────────────────────────────

async function getFixturesByDate(date, leagueId = null) {
  const cacheKey = `fixtures:${date}${leagueId ? `:${leagueId}` : ''}`;
  return cacheGetOrSet(cacheKey, async () => {
    const params = { date, timezone: 'UTC' };
    if (leagueId) params.league = leagueId;
    const { data } = await apiClient.get('/fixtures', { params });
    return normalizeFixtures(data.response || []);
  }, 300);
}

// ─── Fixtures by league & season ─────────────────────────

async function getFixturesByLeague(leagueId, season, { from, to, status, last } = {}) {
  const key = [leagueId, season, from, to, status, last].join(':');
  const cacheKey = `fixtures:league:${key}`;
  return cacheGetOrSet(cacheKey, async () => {
    const params = { league: leagueId, season };
    if (from)   params.from   = from;
    if (to)     params.to     = to;
    if (status) params.status = status;
    if (last)   params.last   = last;
    const { data } = await apiClient.get('/fixtures', { params });
    return normalizeFixtures(data.response || []);
  }, 300);
}

// ─── Single fixture ───────────────────────────────────────

async function getFixtureById(id) {
  const cacheKey = `fixture:${id}`;
  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/fixtures', { params: { id } });
    const fixtures = normalizeFixtures(data.response || []);
    return fixtures[0] || null;
  }, 60);
}

// ─── Fixture statistics (shots, possession, cards …) ──────

async function getFixtureStatistics(fixtureId) {
  const cacheKey = `fixture:stats:${fixtureId}`;
  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/fixtures/statistics', { params: { fixture: fixtureId } });
    return (data.response || []).map(t => ({
      team: { id: t.team.id, name: t.team.name, logo: t.team.logo },
      stats: Object.fromEntries(
        (t.statistics || []).map(s => [s.type.toLowerCase().replace(/\s+/g, '_'), s.value])
      ),
    }));
  }, 60);
}

// ─── Fixture lineups ──────────────────────────────────────

async function getFixtureLineups(fixtureId) {
  const cacheKey = `fixture:lineups:${fixtureId}`;
  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/fixtures/lineups', { params: { fixture: fixtureId } });
    return (data.response || []).map(t => ({
      team:       { id: t.team.id, name: t.team.name, logo: t.team.logo },
      formation:  t.formation,
      coach:      { id: t.coach?.id, name: t.coach?.name, photo: t.coach?.photo },
      startXI:    (t.startXI    || []).map(p => ({ id: p.player.id, name: p.player.name, number: p.player.number, position: p.player.pos, grid: p.player.grid })),
      substitutes:(t.substitutes|| []).map(p => ({ id: p.player.id, name: p.player.name, number: p.player.number, position: p.player.pos })),
    }));
  }, 3600);
}

// ─── Head-to-head ─────────────────────────────────────────

async function getH2H(team1Id, team2Id, last = 10) {
  const [a, b] = [Math.min(team1Id, team2Id), Math.max(team1Id, team2Id)];
  const cacheKey = `h2h:${a}:${b}:${last}`;
  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/fixtures/headtohead', {
      params: { h2h: `${team1Id}-${team2Id}`, last },
    });
    return normalizeFixtures(data.response || []);
  }, 3600);
}

// ─── Standings ────────────────────────────────────────────

async function getStandings(leagueId, season = new Date().getFullYear()) {
  const cacheKey = `standings:${leagueId}:${season}`;
  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/standings', { params: { league: leagueId, season } });
    return (data.response?.[0]?.league?.standings?.[0] || []).map(s => ({
      rank:         s.rank,
      team: {
        id:         s.team.id,
        name:       s.team.name,
        shortName:  s.team.name,
        logo:       s.team.logo,
        country:    '',
      },
      played:       s.all.played,
      won:          s.all.win,
      drawn:        s.all.draw,
      lost:         s.all.lose,
      goalsFor:     s.all.goals.for,
      goalsAgainst: s.all.goals.against,
      goalDiff:     s.goalsDiff,
      points:       s.points,
      form:         s.form || '',
    }));
  }, 3600);
}

// ─── Top scorers ──────────────────────────────────────────

async function getTopScorers(leagueId, season = new Date().getFullYear()) {
  const cacheKey = `topscorers:${leagueId}:${season}`;
  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/players/topscorers', { params: { league: leagueId, season } });
    return normalizePlayerStats(data.response || []);
  }, 3600);
}

// ─── Top assists ──────────────────────────────────────────

async function getTopAssists(leagueId, season = new Date().getFullYear()) {
  const cacheKey = `topassists:${leagueId}:${season}`;
  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/players/topassists', { params: { league: leagueId, season } });
    return normalizePlayerStats(data.response || []);
  }, 3600);
}

// ─── Injuries ─────────────────────────────────────────────

async function getInjuries(leagueId, season, teamId = null) {
  const cacheKey = `injuries:${leagueId}:${season}${teamId ? `:${teamId}` : ''}`;
  return cacheGetOrSet(cacheKey, async () => {
    const params = { league: leagueId, season };
    if (teamId) params.team = teamId;
    const { data } = await apiClient.get('/injuries', { params });
    return (data.response || []).map(r => ({
      player:  { id: r.player.id, name: r.player.name, photo: r.player.photo, type: r.player.type, reason: r.player.reason },
      team:    { id: r.team.id,   name: r.team.name,   logo:  r.team.logo   },
      fixture: { id: r.fixture.id, date: r.fixture.date },
    }));
  }, 1800);
}

// ─── Match predictions ────────────────────────────────────

async function getPredictions(fixtureId) {
  const cacheKey = `predictions:${fixtureId}`;
  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/predictions', { params: { fixture: fixtureId } });
    const r = data.response?.[0];
    if (!r) return null;
    return {
      winner:   r.predictions?.winner   || null,
      advice:   r.predictions?.advice   || '',
      percent:  r.predictions?.percent  || {},
      goals:    r.predictions?.goals    || {},
      h2h:      (r.h2h || []).slice(0, 5).map(m => normalizeFixtures([m])[0]).filter(Boolean),
      homeTeam: r.teams?.home ? { lastFive: r.teams.home.last_5, form: r.teams.home.league?.form } : null,
      awayTeam: r.teams?.away ? { lastFive: r.teams.away.last_5, form: r.teams.away.league?.form } : null,
    };
  }, 3600);
}

// ─── Normalisers ──────────────────────────────────────────

function normalizeFixtures(raw) {
  return raw.map(f => ({
    id:     f.fixture.id,
    status: normalizeStatus(f.fixture.status.short),
    minute: f.fixture.status.elapsed,
    date:   f.fixture.date,
    venue:  f.fixture.venue?.name,
    city:   f.fixture.venue?.city,
    referee:f.fixture.referee,
    homeTeam: {
      id:        f.teams.home.id,
      name:      f.teams.home.name,
      shortName: f.teams.home.name.slice(0, 12),
      logo:      f.teams.home.logo,
      country:   f.league.country,
      winner:    f.teams.home.winner,
    },
    awayTeam: {
      id:        f.teams.away.id,
      name:      f.teams.away.name,
      shortName: f.teams.away.name.slice(0, 12),
      logo:      f.teams.away.logo,
      country:   f.league.country,
      winner:    f.teams.away.winner,
    },
    homeScore:        f.goals.home,
    awayScore:        f.goals.away,
    halftimeScore:    { home: f.score?.halftime?.home,  away: f.score?.halftime?.away  },
    fulltimeScore:    { home: f.score?.fulltime?.home,  away: f.score?.fulltime?.away  },
    extraTimeScore:   { home: f.score?.extratime?.home, away: f.score?.extratime?.away },
    penaltiesScore:   { home: f.score?.penalty?.home,   away: f.score?.penalty?.away   },
    league: {
      id:        f.league.id,
      name:      f.league.name,
      shortName: f.league.name,
      logo:      f.league.logo,
      country:   f.league.country,
      season:    f.league.season,
      round:     f.league.round,
      type:      'League',
    },
    events: (f.events || []).map(e => ({
      id:          `${e.time.elapsed}_${e.team?.id}_${e.player?.id}`,
      minute:      e.time.elapsed,
      extraMinute: e.time.extra,
      type:        normalizeEventType(e.type),
      detail:      e.detail,
      player:      { id: e.player?.id, name: e.player?.name },
      assist:      e.assist?.id ? { id: e.assist.id, name: e.assist.name } : undefined,
      team:        { id: e.team?.id, name: e.team?.name, shortName: e.team?.name, logo: e.team?.logo, country: '' },
    })),
  }));
}

function normalizePlayerStats(response) {
  return response.map(r => ({
    id:          r.player.id,
    name:        r.player.name,
    firstName:   r.player.firstname,
    lastName:    r.player.lastname,
    nationality: r.player.nationality,
    age:         r.player.age,
    photo:       r.player.photo,
    position:    r.statistics[0]?.games?.position || 'Unknown',
    teamId:      r.statistics[0]?.team?.id,
    team:        r.statistics[0]?.team,
    stats: {
      goals:         r.statistics[0]?.goals?.total    || 0,
      assists:       r.statistics[0]?.goals?.assists  || 0,
      appearances:   r.statistics[0]?.games?.appearences || 0,
      minutesPlayed: r.statistics[0]?.games?.minutes  || 0,
      yellowCards:   r.statistics[0]?.cards?.yellow   || 0,
      redCards:      r.statistics[0]?.cards?.red      || 0,
      rating:        parseFloat(r.statistics[0]?.games?.rating || '0'),
    },
  }));
}

function normalizeStatus(s) {
  const map = {
    NS: 'SCHEDULED', '1H': 'LIVE', '2H': 'LIVE', ET: 'LIVE', INT: 'LIVE',
    HT: 'HT', P: 'PEN', PEN: 'PEN', FT: 'FT', AET: 'AET',
    SUSP: 'SUSP', ABD: 'ABD', CANC: 'CANC', TBD: 'TBD', PST: 'PST', WO: 'FT',
  };
  return map[s] || 'SCHEDULED';
}

function normalizeEventType(t) {
  if (t === 'Goal')  return 'GOAL';
  if (t === 'Card')  return 'CARD';
  if (t === 'subst') return 'SUBST';
  if (t === 'Var')   return 'VAR';
  return 'OTHER';
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
