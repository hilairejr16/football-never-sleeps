const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

const ok = (res, data) => res.json({ status: 'success', data });

// Hardcoded popular leagues — no API credit burn
const LEAGUES = [
  { id: 1,   name: 'FIFA World Cup',    country: 'World',    logo: 'https://media.api-sports.io/football/leagues/1.png',   type: 'Cup', featured: true, season: 2026 },
  { id: 39,  name: 'Premier League',    country: 'England',  logo: 'https://media.api-sports.io/football/leagues/39.png',  type: 'League' },
  { id: 140, name: 'La Liga',           country: 'Spain',    logo: 'https://media.api-sports.io/football/leagues/140.png', type: 'League' },
  { id: 135, name: 'Serie A',           country: 'Italy',    logo: 'https://media.api-sports.io/football/leagues/135.png', type: 'League' },
  { id: 78,  name: 'Bundesliga',        country: 'Germany',  logo: 'https://media.api-sports.io/football/leagues/78.png',  type: 'League' },
  { id: 61,  name: 'Ligue 1',           country: 'France',   logo: 'https://media.api-sports.io/football/leagues/61.png',  type: 'League' },
  { id: 94,  name: 'Primeira Liga',     country: 'Portugal', logo: 'https://media.api-sports.io/football/leagues/94.png',  type: 'League' },
  { id: 88,  name: 'Eredivisie',        country: 'Netherlands', logo: 'https://media.api-sports.io/football/leagues/88.png', type: 'League' },
  { id: 2,   name: 'Champions League',  country: 'World',    logo: 'https://media.api-sports.io/football/leagues/2.png',   type: 'Cup' },
  { id: 3,   name: 'Europa League',     country: 'World',    logo: 'https://media.api-sports.io/football/leagues/3.png',   type: 'Cup' },
  { id: 848, name: 'Conference League', country: 'World',    logo: 'https://media.api-sports.io/football/leagues/848.png', type: 'Cup' },
];

// GET /leagues
router.get('/', asyncHandler(async (req, res) => {
  const { type, country } = req.query;
  let result = LEAGUES;

  if (type) result = result.filter(l => l.type.toLowerCase() === type.toLowerCase());
  if (country) result = result.filter(l => l.country.toLowerCase() === country.toLowerCase());

  ok(res, result);
}));

// GET /leagues/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const league = LEAGUES.find(l => l.id === id);
  if (!league) return res.status(404).json({ status: 'error', message: 'League not found' });
  ok(res, league);
}));

module.exports = router;
