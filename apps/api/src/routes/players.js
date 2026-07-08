const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { getTopScorers } = require('../services/footballApi');

const ok = (res, data) => res.json({ status: 'success', data });

// GET /players/topscorers/:leagueId
router.get('/topscorers/:leagueId', asyncHandler(async (req, res) => {
  const leagueId = parseInt(req.params.leagueId);
  if (isNaN(leagueId)) {
    return res.status(400).json({ status: 'error', message: 'Invalid league ID' });
  }

  const season = req.query.season ? parseInt(req.query.season) : new Date().getFullYear();
  const data = await getTopScorers(leagueId, season);
  ok(res, { leagueId, season, players: data });
}));

// GET /players/topscorers — Premier League default
router.get('/topscorers', asyncHandler(async (req, res) => {
  const season = req.query.season ? parseInt(req.query.season) : new Date().getFullYear();
  const data = await getTopScorers(39, season);
  ok(res, { leagueId: 39, leagueName: 'Premier League', season, players: data });
}));

module.exports = router;
