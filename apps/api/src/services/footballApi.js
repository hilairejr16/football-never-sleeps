const axios = require('axios');
const { cacheGetOrSet } = require('../config/redis');

const apiClient = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-rapidapi-host': 'v3.football.api-sports.io',
    'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
  },
  timeout: 10_000,
});

// ─── Live Fixtures ─────────────────────────────────────────

async function getLiveFixtures(leagueId = null) {
  const cacheKey = `live:fixtures${leagueId ? `:${leagueId}` : ''}`;

  return cacheGetOrSet(cacheKey, async () => {
    const params = { live: 'all' };
    if (leagueId) params.league = leagueId;

    const { data } = await apiClient.get('/fixtures', { params });
    return normalizeFixtures(data.response || []);
  }, 30); // Cache for 30 seconds
}

// ─── Fixtures by Date ─────────────────────────────────────

async function getFixturesByDate(date, leagueId = null) {
  const cacheKey = `fixtures:${date}${leagueId ? `:${leagueId}` : ''}`;

  return cacheGetOrSet(cacheKey, async () => {
    const params = { date, timezone: 'UTC' };
    if (leagueId) params.league = leagueId;

    const { data } = await apiClient.get('/fixtures', { params });
    return normalizeFixtures(data.response || []);
  }, 300); // Cache for 5 minutes
}

// ─── Single Fixture ────────────────────────────────────────

async function getFixtureById(id) {
  const cacheKey = `fixture:${id}`;

  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/fixtures', { params: { id } });
    const fixtures = normalizeFixtures(data.response || []);
    return fixtures[0] || null;
  }, 60);
}

// ─── Standings ─────────────────────────────────────────────

async function getStandings(leagueId, season = new Date().getFullYear()) {
  const cacheKey = `standings:${leagueId}:${season}`;

  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/standings', {
      params: { league: leagueId, season },
    });
    return (data.response?.[0]?.league?.standings?.[0] || []).map(s => ({
      rank: s.rank,
      team: {
        id: s.team.id,
        name: s.team.name,
        shortName: s.team.name,
        logo: s.team.logo,
        country: '',
      },
      played: s.all.played,
      won: s.all.win,
      drawn: s.all.draw,
      lost: s.all.lose,
      goalsFor: s.all.goals.for,
      goalsAgainst: s.all.goals.against,
      goalDiff: s.goalsDiff,
      points: s.points,
      form: s.form || '',
    }));
  }, 3600); // Cache for 1 hour
}

// ─── Top Scorers ───────────────────────────────────────────

async function getTopScorers(leagueId, season = new Date().getFullYear()) {
  const cacheKey = `topscorers:${leagueId}:${season}`;

  return cacheGetOrSet(cacheKey, async () => {
    const { data } = await apiClient.get('/players/topscorers', {
      params: { league: leagueId, season },
    });
    return (data.response || []).map(r => ({
      id: r.player.id,
      name: r.player.name,
      firstName: r.player.firstname,
      lastName: r.player.lastname,
      nationality: r.player.nationality,
      age: r.player.age,
      photo: r.player.photo,
      position: r.statistics[0]?.games?.position || 'Unknown',
      teamId: r.statistics[0]?.team?.id,
      team: r.statistics[0]?.team,
      stats: {
        goals: r.statistics[0]?.goals?.total || 0,
        assists: r.statistics[0]?.goals?.assists || 0,
        appearances: r.statistics[0]?.games?.appearences || 0,
        yellowCards: r.statistics[0]?.cards?.yellow || 0,
        redCards: r.statistics[0]?.cards?.red || 0,
        minutesPlayed: r.statistics[0]?.games?.minutes || 0,
        rating: parseFloat(r.statistics[0]?.games?.rating || '0'),
      },
    }));
  }, 3600);
}

// ─── Normalizer ────────────────────────────────────────────

function normalizeFixtures(raw) {
  return raw.map(f => ({
    id: f.fixture.id,
    status: normalizeStatus(f.fixture.status.short),
    minute: f.fixture.status.elapsed,
    date: f.fixture.date,
    venue: f.fixture.venue?.name,
    referee: f.fixture.referee,
    homeTeam: {
      id: f.teams.home.id,
      name: f.teams.home.name,
      shortName: f.teams.home.name.slice(0, 10),
      logo: f.teams.home.logo,
      country: f.league.country,
    },
    awayTeam: {
      id: f.teams.away.id,
      name: f.teams.away.name,
      shortName: f.teams.away.name.slice(0, 10),
      logo: f.teams.away.logo,
      country: f.league.country,
    },
    homeScore: f.goals.home,
    awayScore: f.goals.away,
    league: {
      id: f.league.id,
      name: f.league.name,
      shortName: f.league.name,
      logo: f.league.logo,
      country: f.league.country,
      season: f.league.season,
      type: 'League',
    },
    events: (f.events || []).map(e => ({
      id: e.time.elapsed,
      minute: e.time.elapsed,
      type: normalizeEventType(e.type),
      detail: e.detail,
      player: { id: e.player.id, name: e.player.name },
      assist: e.assist?.id ? { id: e.assist.id, name: e.assist.name } : undefined,
      team: { id: e.team.id, name: e.team.name, shortName: e.team.name, logo: e.team.logo, country: '' },
    })),
  }));
}

function normalizeStatus(apiStatus) {
  const map = {
    'NS': 'SCHEDULED', '1H': 'LIVE', '2H': 'LIVE', 'ET': 'LIVE',
    'HT': 'HT', 'P': 'PEN', 'FT': 'FT', 'AET': 'AET',
    'SUSP': 'SUSP', 'ABD': 'ABD', 'CANC': 'CANC', 'TBD': 'TBD',
  };
  return map[apiStatus] || 'SCHEDULED';
}

function normalizeEventType(t) {
  if (t === 'Goal') return 'GOAL';
  if (t === 'Card') return 'CARD';
  if (t === 'subst') return 'SUBST';
  if (t === 'Var') return 'VAR';
  return 'GOAL';
}

module.exports = { getLiveFixtures, getFixturesByDate, getFixtureById, getStandings, getTopScorers };
