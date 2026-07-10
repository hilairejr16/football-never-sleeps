const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { getLiveFixtures, getFixturesByDate, getFixtureById } = require('../services/footballApi');
const { cacheGetOrSet } = require('../config/redis');

const ok = (res, data, meta = {}) =>
  res.json({ status: 'success', data, ...meta });

// GET /matches/live
router.get('/live', asyncHandler(async (req, res) => {
  const { league } = req.query;
  try {
    const data = await getLiveFixtures(league ? parseInt(league) : null);
    ok(res, data);
  } catch {
    ok(res, []); // no live matches or upstream unavailable
  }
}));

// GET /matches/today
router.get('/today', asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const { league } = req.query;
  const data = await getFixturesByDate(today, league ? parseInt(league) : null);
  ok(res, data);
}));

// GET /matches/date/:date
router.get('/date/:date', asyncHandler(async (req, res) => {
  const { date } = req.params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ status: 'error', message: 'Invalid date format. Use YYYY-MM-DD' });
  }
  const data = await getFixturesByDate(date);
  ok(res, data);
}));

// GET /matches/fixtures
router.get('/fixtures', asyncHandler(async (req, res) => {
  const { league, page = 1 } = req.query;
  const cacheKey = `fixtures:upcoming:${league || 'all'}:${page}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    const upcoming = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().slice(0, 10);
      const matches = await getFixturesByDate(dateStr, league ? parseInt(league) : null);
      upcoming.push(...matches);
    }
    return upcoming;
  }, 1800);

  ok(res, data);
}));

// GET /matches/results
router.get('/results', asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;
  const cacheKey = `results:${page}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    const results = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const matches = await getFixturesByDate(dateStr);
      results.push(...matches.filter(m => m.status === 'FT' || m.status === 'AET'));
    }
    return results;
  }, 3600);

  ok(res, data);
}));

// GET /matches/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid match ID' });

  const data = await getFixtureById(id);
  if (!data) return res.status(404).json({ status: 'error', message: 'Match not found' });

  ok(res, data);
}));

module.exports = router;
