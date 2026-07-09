/**
 * Fetches live and recent scores from the football API
 * Supports World Cup 2026, CONCACAF Gold Cup, and major leagues
 */
require('dotenv').config({ path: '../../.env' });
const axios = require('axios');

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const FOOTBALL_API_URL = 'https://v3.football.api-sports.io';

// Tournament league IDs (API-Football)
const LEAGUES = {
  WORLD_CUP:  1,   // FIFA World Cup
  GOLD_CUP:   22,  // CONCACAF Gold Cup
  CHAMPIONS:  2,   // UEFA Champions League
  PREMIER:    39,  // Premier League
  LA_LIGA:    140, // La Liga
  BUNDESLIGA: 78,  // Bundesliga
  SERIE_A:    135, // Serie A
  LIGUE_1:    61,  // Ligue 1
  MLS:        253, // MLS
};

const apiHeaders = () => ({
  'x-rapidapi-host': 'v3.football.api-sports.io',
  'x-rapidapi-key': FOOTBALL_API_KEY,
});

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function getCurrentSeason() {
  return new Date().getFullYear();
}

// Fetch all live matches across every monitored competition
async function fetchLiveScores() {
  if (!FOOTBALL_API_KEY) {
    console.warn('[ScoresFetcher] FOOTBALL_API_KEY not configured — returning empty');
    return [];
  }
  try {
    const { data } = await axios.get(`${FOOTBALL_API_URL}/fixtures`, {
      headers: apiHeaders(),
      params: { live: 'all' },
      timeout: 10_000,
    });
    return (data.response || []).map(normalizeFixture);
  } catch (err) {
    console.error('[ScoresFetcher] Live scores error:', err.message);
    return [];
  }
}

// Today's Gold Cup matches (live + scheduled)
async function fetchGoldCupToday() {
  return fetchTournamentDay(LEAGUES.GOLD_CUP, getCurrentSeason());
}

// Today's World Cup 2026 matches
async function fetchWorldCupToday() {
  return fetchTournamentDay(LEAGUES.WORLD_CUP, 2026);
}

// Gold Cup results from last 24 hours
async function fetchGoldCupResults() {
  if (!FOOTBALL_API_KEY) return [];
  try {
    const { data } = await axios.get(`${FOOTBALL_API_URL}/fixtures`, {
      headers: apiHeaders(),
      params: {
        league: LEAGUES.GOLD_CUP,
        season: getCurrentSeason(),
        from: yesterdayStr(),
        to: todayStr(),
        status: 'FT',
      },
      timeout: 10_000,
    });
    return (data.response || []).map(normalizeFixture);
  } catch (err) {
    console.error('[ScoresFetcher] Gold Cup results error:', err.message);
    return [];
  }
}

// World Cup 2026 results from last 24 hours
async function fetchWorldCupResults() {
  if (!FOOTBALL_API_KEY) return [];
  try {
    const { data } = await axios.get(`${FOOTBALL_API_URL}/fixtures`, {
      headers: apiHeaders(),
      params: {
        league: LEAGUES.WORLD_CUP,
        season: 2026,
        from: yesterdayStr(),
        to: todayStr(),
        status: 'FT',
      },
      timeout: 10_000,
    });
    return (data.response || []).map(normalizeFixture);
  } catch (err) {
    console.error('[ScoresFetcher] WC results error:', err.message);
    return [];
  }
}

async function fetchTournamentDay(leagueId, season) {
  if (!FOOTBALL_API_KEY) return [];
  try {
    const { data } = await axios.get(`${FOOTBALL_API_URL}/fixtures`, {
      headers: apiHeaders(),
      params: { league: leagueId, season, date: todayStr() },
      timeout: 10_000,
    });
    return (data.response || []).map(normalizeFixture);
  } catch (err) {
    console.error(`[ScoresFetcher] Tournament ${leagueId} error:`, err.message);
    return [];
  }
}

// Normalize API-Football fixture → internal shape
function normalizeFixture(raw) {
  const { fixture, teams, goals, league } = raw;
  return {
    id: fixture.id,
    status: mapStatus(fixture.status.short),
    minute: fixture.status.elapsed || null,
    date: fixture.date,
    venue: fixture.venue?.name || null,
    homeTeam: {
      id: teams.home.id,
      name: teams.home.name,
      shortName: teams.home.name.slice(0, 3).toUpperCase(),
      logo: teams.home.logo,
      country: teams.home.name,
    },
    awayTeam: {
      id: teams.away.id,
      name: teams.away.name,
      shortName: teams.away.name.slice(0, 3).toUpperCase(),
      logo: teams.away.logo,
      country: teams.away.name,
    },
    homeScore: goals.home,
    awayScore: goals.away,
    league: {
      id: league.id,
      name: league.name,
      shortName: league.name.substring(0, 6).toUpperCase(),
      logo: league.logo,
      country: league.country,
      season: league.season,
      type: 'Cup',
    },
  };
}

function mapStatus(s) {
  const map = {
    '1H': 'LIVE', '2H': 'LIVE', 'ET': 'LIVE', 'P': 'LIVE',
    'HT': 'HT', 'FT': 'FT', 'AET': 'AET', 'PEN': 'PEN',
    'NS': 'SCHEDULED', 'PST': 'SUSP', 'CANC': 'CANC',
  };
  return map[s] || 'SCHEDULED';
}

// Format a single match score line for display
function formatScore(match) {
  const { homeTeam, awayTeam, homeScore, awayScore, status, minute } = match;
  const score = homeScore !== null ? `${homeScore}–${awayScore}` : 'vs';
  const statusStr = status === 'LIVE' ? `🔴 ${minute}'` : status === 'HT' ? '🟡 HT' : ['FT','AET','PEN'].includes(status) ? '✅ FT' : '⏳';
  return `${homeTeam.name} ${score} ${awayTeam.name} ${statusStr}`;
}

// Check whether any monitored tournament has games today
async function hasMatchesToday() {
  const [wc, gc] = await Promise.all([fetchWorldCupToday(), fetchGoldCupToday()]);
  return wc.length + gc.length > 0;
}

module.exports = {
  fetchLiveScores,
  fetchGoldCupToday,
  fetchWorldCupToday,
  fetchGoldCupResults,
  fetchWorldCupResults,
  fetchTournamentDay,
  formatScore,
  hasMatchesToday,
  LEAGUES,
};
