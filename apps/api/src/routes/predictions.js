const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { cacheGetOrSet } = require('../config/redis');
const { getFixturesByDate } = require('../services/footballApi');
const { generateMatchPrediction } = require('../services/aiContent');

const ok = (res, data) => res.json({ status: 'success', data });

// GET /predictions/today
router.get('/today', asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const cacheKey = `predictions:today:${today}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    const matches = await getFixturesByDate(today);
    const upcoming = matches.filter(m => m.status === 'SCHEDULED').slice(0, 6);

    const predictions = await Promise.all(
      upcoming.map(async match => {
        const pred = await generateMatchPrediction(
          match.homeTeam,
          match.awayTeam,
          null,
        );
        if (!pred) return null;

        return {
          id: `pred_${match.id}`,
          match,
          ...pred,
          generatedAt: new Date().toISOString(),
        };
      }),
    );

    return predictions.filter(Boolean);
  }, 3600);

  ok(res, data);
}));

// GET /predictions/match/:matchId
router.get('/match/:matchId', asyncHandler(async (req, res) => {
  const matchId = parseInt(req.params.matchId);
  if (isNaN(matchId)) return res.status(400).json({ status: 'error', message: 'Invalid match ID' });

  const cacheKey = `predictions:match:${matchId}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    const { getFixtureById } = require('../services/footballApi');
    const match = await getFixtureById(matchId);
    if (!match) return null;

    const pred = await generateMatchPrediction(match.homeTeam, match.awayTeam, null);
    if (!pred) return null;

    return { id: `pred_${matchId}`, match, ...pred, generatedAt: new Date().toISOString() };
  }, 3600);

  if (!data) return res.status(404).json({ status: 'error', message: 'Prediction not available' });
  ok(res, data);
}));

module.exports = router;
