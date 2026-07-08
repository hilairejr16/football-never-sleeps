const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../middleware/errorHandler');
const { authRateLimit } = require('../middleware/rateLimit');
const { requireAuth } = require('../middleware/auth');
const { query } = require('../config/database');

const ok = (res, data) => res.json({ status: 'success', data });

const signToken = user =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' },
  );

// POST /auth/register
router.post('/register', authRateLimit, asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ status: 'error', message: 'email, password and name are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters' });
  }

  const { rows: existing } = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.length) {
    return res.status(409).json({ status: 'error', message: 'Email already registered' });
  }

  const hash = await bcrypt.hash(password, 12);
  const { rows } = await query(
    `INSERT INTO users (email, password, name, role, created_at)
     VALUES ($1, $2, $3, 'viewer', NOW()) RETURNING id, email, name, role, created_at`,
    [email.toLowerCase(), hash, name],
  );

  ok(res, { user: rows[0], token: signToken(rows[0]) });
}));

// POST /auth/login
router.post('/login', authRateLimit, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'email and password are required' });
  }

  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = rows[0];
  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  }

  const { password: _pw, ...safeUser } = user;
  ok(res, { user: safeUser, token: signToken(user) });
}));

// GET /auth/me
router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
    [req.user.id],
  );
  if (!rows[0]) return res.status(404).json({ status: 'error', message: 'User not found' });
  ok(res, rows[0]);
}));

// POST /auth/refresh
router.post('/refresh', requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    'SELECT id, email, name, role FROM users WHERE id = $1',
    [req.user.id],
  );
  if (!rows[0]) return res.status(404).json({ status: 'error', message: 'User not found' });
  ok(res, { token: signToken(rows[0]) });
}));

module.exports = router;
