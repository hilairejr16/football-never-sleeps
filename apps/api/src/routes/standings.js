const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { getStandings } = require('../services/footballApi');

const POPULAR_LEAGUES = {
  39: 'Premier League',
  140: 'La Liga',
  135: 'Serie A',
  78: 'Bundesliga',
  61: 'Ligue 1',
  2: 'Champions League',
  3: 'Europa League',
};

const ok = (res, data) => res.json({ status: 'success', data });

// GET /standings/:leagueId
router.get('/:leagueId', asyncHandler(async (req, res) => {
  const leagueId = parseInt(req.params.leagueId);
  if (isNaN(leagueId)) {
    return res.status(400).json({ status: 'error', message: 'Invalid league ID' });
  }

  const season = req.query.season ? parseInt(req.query.season) : new Date().getFullYear();
  const data = await getStandings(leagueId, season);
  ok(res, { leagueId, season, standings: data });
}));

// GET /standings — top 5 leagues
router.get('/', asyncHandler(async (req, res) => {
  const season = req.query.season ? parseInt(req.query.season) : new Date().getFullYear();
  const leagueIds = [39, 140, 135, 78, 61];

  const results = await Promise.allSettled(
    leagueIds.map(id => getStandings(id, season).then(standings => ({ leagueId: id, name: POPULAR_LEAGUES[id], season, standings }))),
  );

  const data = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  ok(res, data);
}));

module.exports = router;
