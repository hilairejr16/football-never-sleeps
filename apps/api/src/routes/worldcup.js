const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { cacheGetOrSet } = require('../config/redis');
const { getLiveFixtures, getFixturesByDate, getStandings, getTopScorers } = require('../services/footballApi');

const WC_LEAGUE_ID = 1;
const WC_SEASON    = 2026;
const WC_FINAL_DATE = '2026-07-19';

const ok = (res, data, meta = {}) => res.json({ status: 'success', data, ...meta });

function daysUntilFinal() {
  const now   = new Date();
  const final = new Date(WC_FINAL_DATE + 'T00:00:00Z');
  return Math.max(0, Math.ceil((final - now) / (1000 * 60 * 60 * 24)));
}

function tournamentStage() {
  const today = new Date();
  const d = today.toISOString().slice(0, 10);
  if (d <= '2026-07-02') return 'Group Stage';
  if (d <  '2026-07-08') return 'Round of 16';
  if (d <= '2026-07-12') return 'Quarter-Finals';
  if (d <= '2026-07-16') return 'Semi-Finals';
  if (d <= '2026-07-18') return '3rd Place Play-off';
  if (d === '2026-07-19') return 'THE FINAL';
  return 'Completed';
}

// GET /world-cup/info
router.get('/info', asyncHandler(async (req, res) => {
  ok(res, {
    leagueId:  WC_LEAGUE_ID,
    season:    WC_SEASON,
    finalDate: WC_FINAL_DATE,
    daysUntilFinal: daysUntilFinal(),
    currentStage:   tournamentStage(),
    hosts: ['USA', 'Canada', 'Mexico'],
    teams: 48,
    isLive: daysUntilFinal() >= 0 && new Date() < new Date(WC_FINAL_DATE + 'T23:59:59Z'),
  });
}));

// GET /world-cup/live
router.get('/live', asyncHandler(async (req, res) => {
  try {
    const data = await getLiveFixtures(WC_LEAGUE_ID);
    ok(res, data);
  } catch {
    ok(res, []); // no live matches right now
  }
}));

// GET /world-cup/today
router.get('/today', asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const cacheKey = `wc:today:${today}`;
  const data = await cacheGetOrSet(cacheKey, () =>
    getFixturesByDate(today, WC_LEAGUE_ID), 60);
  ok(res, data);
}));

// GET /world-cup/results  (last 7 days)
router.get('/results', asyncHandler(async (req, res) => {
  const cacheKey = `wc:results:${new Date().toISOString().slice(0, 10)}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    const matches = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const day = await getFixturesByDate(dateStr, WC_LEAGUE_ID);
      matches.push(...day.filter(m => ['FT', 'AET', 'PEN'].includes(m.status)));
    }
    return matches.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, 1800);

  ok(res, data);
}));

// GET /world-cup/upcoming  (next 7 days)
router.get('/upcoming', asyncHandler(async (req, res) => {
  const cacheKey = `wc:upcoming:${new Date().toISOString().slice(0, 10)}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    const matches = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      if (dateStr > WC_FINAL_DATE) break;
      const day = await getFixturesByDate(dateStr, WC_LEAGUE_ID);
      matches.push(...day);
    }
    return matches.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, 1800);

  ok(res, data);
}));

// GET /world-cup/standings
router.get('/standings', asyncHandler(async (req, res) => {
  const cacheKey = `wc:standings:${WC_SEASON}`;
  const data = await cacheGetOrSet(cacheKey, () =>
    getStandings(WC_LEAGUE_ID, WC_SEASON), 3600);
  ok(res, data);
}));

// GET /world-cup/highlights  — proxies YouTube Data API, keeps key server-side
router.get('/highlights', asyncHandler(async (req, res) => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return ok(res, []);

  const today = new Date().toISOString().slice(0, 10);
  const cacheKey = `wc:highlights:${today}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    const params = new URLSearchParams({
      part: 'snippet',
      q: 'FIFA World Cup 2026 highlights official',
      order: 'date',
      maxResults: '9',
      type: 'video',
      key,
    });
    const r = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    const json = await r.json();
    if (json.error) return [];
    return (json.items || [])
      .filter(item => item.id?.videoId)
      .map(item => ({
        id:          item.id.videoId,
        title:       item.snippet.title,
        thumbnail:   item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
        channelName: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }));
  }, 3600);

  ok(res, data);
}));

// GET /world-cup/scorers
router.get('/scorers', asyncHandler(async (req, res) => {
  const cacheKey = `wc:scorers:${WC_SEASON}`;
  const data = await cacheGetOrSet(cacheKey, () =>
    getTopScorers(WC_LEAGUE_ID, WC_SEASON), 3600);
  ok(res, data);
}));

module.exports = router;
