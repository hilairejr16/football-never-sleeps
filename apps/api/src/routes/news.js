const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { query } = require('../config/database');
const { cacheGetOrSet, cacheDel } = require('../config/redis');
const { generateNewsArticle } = require('../services/aiContent');
const { requireAdmin } = require('../middleware/auth');
const slugify = require('slugify');

const ok = (res, data, meta = {}) => res.json({ status: 'success', data, ...meta });

// GET /news
router.get('/', asyncHandler(async (req, res) => {
  const { limit = 20, page = 1, category } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const cacheKey = `news:list:${limit}:${page}:${category || 'all'}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    let sql = `SELECT * FROM articles WHERE published = true`;
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    sql += ` ORDER BY published_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), offset);

    const { rows } = await query(sql, params);
    return rows;
  }, 60);

  ok(res, data);
}));

// GET /news/breaking
router.get('/breaking', asyncHandler(async (req, res) => {
  const data = await cacheGetOrSet('news:breaking', async () => {
    const { rows } = await query(
      `SELECT * FROM articles WHERE is_breaking = true AND published = true ORDER BY published_at DESC LIMIT 10`,
    );
    return rows;
  }, 30);

  ok(res, data);
}));

// GET /news/search
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.status(400).json({ status: 'error', message: 'Query too short' });

  const { rows } = await query(
    `SELECT * FROM articles
     WHERE published = true
       AND (title ILIKE $1 OR excerpt ILIKE $1 OR tags::text ILIKE $1)
     ORDER BY published_at DESC LIMIT 20`,
    [`%${q}%`],
  );

  ok(res, rows);
}));

// GET /news/category/:category
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { rows } = await query(
    `SELECT * FROM articles WHERE category = $1 AND published = true
     ORDER BY published_at DESC LIMIT $2 OFFSET $3`,
    [category, parseInt(limit), offset],
  );

  ok(res, rows);
}));

// GET /news/:slug
router.get('/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const cacheKey = `news:${slug}`;

  const data = await cacheGetOrSet(cacheKey, async () => {
    const { rows } = await query(
      `SELECT * FROM articles WHERE slug = $1 AND published = true`,
      [slug],
    );
    return rows[0] || null;
  }, 300);

  if (!data) return res.status(404).json({ status: 'error', message: 'Article not found' });

  // Increment view count asynchronously
  query('UPDATE articles SET views = views + 1 WHERE slug = $1', [slug]).catch(() => {});

  ok(res, data);
}));

// POST /news/generate — Admin only
router.post('/generate', requireAdmin, asyncHandler(async (req, res) => {
  const { topic, matchData, tone, length } = req.body;
  if (!topic) return res.status(400).json({ status: 'error', message: 'Topic is required' });

  const article = await generateNewsArticle({ topic, matchData, tone, length });
  if (!article) return res.status(500).json({ status: 'error', message: 'AI generation failed' });

  const slug = slugify(article.title, { lower: true, strict: true });

  const { rows } = await query(
    `INSERT INTO articles (title, slug, excerpt, content, category, tags, author, seo_title, seo_description, read_time, published, is_breaking)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [
      article.title, slug, article.excerpt, article.content,
      'analysis', JSON.stringify(article.tags || []),
      'GoalRush AI', article.seoTitle, article.seoDescription,
      article.readTime || 3, true, false,
    ],
  );

  await cacheDel('news:list:20:1:all');
  ok(res, rows[0]);
}));

module.exports = router;
