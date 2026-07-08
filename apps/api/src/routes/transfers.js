const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { query } = require('../config/database');
const { cacheGetOrSet } = require('../config/redis');

const ok = (res, data, meta = {}) => res.json({ status: 'success', data, ...meta });

// GET /transfers
router.get('/', asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const page  = Math.max(parseInt(req.query.page)  || 1,  1);
  const { status } = req.query;
  const offset = (page - 1) * limit;
  const cacheKey = `transfers:${limit}:${page}:${status || 'all'}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    let sql = `SELECT * FROM transfers`;
    const params = [];

    if (status && status !== 'all') {
      params.push(status);
      sql += ` WHERE status = $${params.length}`;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), offset);

    const { rows } = await query(sql, params);
    return rows;
  }, 300);

  ok(res, data);
}));

// GET /transfers/recent
router.get('/recent', asyncHandler(async (req, res) => {
  const cacheKey = 'transfers:recent';

  const data = await cacheGetOrSet(cacheKey, async () => {
    const { rows } = await query(
      `SELECT * FROM transfers ORDER BY transfer_date DESC LIMIT 10`,
    );
    return rows;
  }, 300);

  ok(res, data);
}));

// GET /transfers/rumours
router.get('/rumours', asyncHandler(async (req, res) => {
  const data = await cacheGetOrSet('transfers:rumours', async () => {
    const { rows } = await query(
      `SELECT * FROM transfers WHERE status = 'rumour' ORDER BY created_at DESC LIMIT 20`,
    );
    return rows;
  }, 120);

  ok(res, data);
}));

// GET /transfers/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid transfer ID' });

  const { rows } = await query('SELECT * FROM transfers WHERE id = $1', [id]);
  if (!rows[0]) return res.status(404).json({ status: 'error', message: 'Transfer not found' });

  ok(res, rows[0]);
}));

module.exports = router;
