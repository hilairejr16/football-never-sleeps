const express = require('express');
const router = express.Router();
const { apiClient } = require('../services/footballApi');
const { asyncHandler } = require('../middleware/errorHandler');
const { cacheGetOrSet } = require('../config/redis');

const ok = (res, data) => res.json({ status: 'success', data });

// GET /teams/league/:leagueId
router.get('/league/:leagueId', asyncHandler(async (req, res) => {
  const leagueId = parseInt(req.params.leagueId);
  if (isNaN(leagueId)) {
    return res.status(400).json({ status: 'error', message: 'Invalid league ID' });
  }

  const season = req.query.season ? parseInt(req.query.season) : new Date().getFullYear();
  const cacheKey = `teams:league:${leagueId}:${season}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    const { data: res } = await apiClient.get('/teams', { params: { league: leagueId, season } });
    return (res.response || []).map(r => ({
      id: r.team.id,
      name: r.team.name,
      code: r.team.code,
      country: r.team.country,
      logo: r.team.logo,
      national: r.team.national,
      venue: r.venue ? {
        id: r.venue.id,
        name: r.venue.name,
        city: r.venue.city,
        capacity: r.venue.capacity,
      } : null,
    }));
  }, 86400); // Cache 24 hours

  ok(res, { leagueId, season, teams: data });
}));

// GET /teams/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid team ID' });

  const cacheKey = `team:${id}`;
  const data = await cacheGetOrSet(cacheKey, async () => {
    const { data: apiRes } = await apiClient.get('/teams', { params: { id } });
    const r = apiRes.response?.[0];
    if (!r) return null;
    return {
      id: r.team.id,
      name: r.team.name,
      code: r.team.code,
      country: r.team.country,
      logo: r.team.logo,
      national: r.team.national,
      venue: r.venue ? {
        id: r.venue.id,
        name: r.venue.name,
        city: r.venue.city,
        capacity: r.venue.capacity,
      } : null,
    };
  }, 86400);

  if (!data) return res.status(404).json({ status: 'error', message: 'Team not found' });
  ok(res, data);
}));

module.exports = router;
