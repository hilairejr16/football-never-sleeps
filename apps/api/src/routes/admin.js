const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { aiRateLimit } = require('../middleware/rateLimit');
const { query } = require('../config/database');
const {
  generateNewsArticle,
  generateVideoScript,
  generateMatchPrediction,
  generateSocialPost,
} = require('../services/aiContent');

const ok = (res, data) => res.json({ status: 'success', data });

// All admin routes require authentication
router.use(requireAdmin);

// GET /admin/stats
router.get('/stats', asyncHandler(async (req, res) => {
  const [articles, views, posts] = await Promise.all([
    query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE DATE(published_at) = CURRENT_DATE) as today FROM articles WHERE published = true'),
    query('SELECT SUM(views) as total, SUM(views) FILTER (WHERE DATE(published_at) = CURRENT_DATE) as today FROM articles'),
    query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE DATE(published_at) = CURRENT_DATE) as today FROM social_posts WHERE status = $1', ['published']),
  ]);

  ok(res, {
    totalArticles: parseInt(articles.rows[0]?.total || 0),
    articlesToday: parseInt(articles.rows[0]?.today || 0),
    totalViews: parseInt(views.rows[0]?.total || 0),
    viewsToday: parseInt(views.rows[0]?.today || 0),
    socialPosts: parseInt(posts.rows[0]?.total || 0),
    socialPostsToday: parseInt(posts.rows[0]?.today || 0),
  });
}));

// POST /admin/generate
router.post('/generate', aiRateLimit, asyncHandler(async (req, res) => {
  const { type, params = {} } = req.body;

  let result;
  switch (type) {
    case 'news':
    case 'article':
      result = await generateNewsArticle({
        topic: params.topic || 'Latest football news',
        tone: params.tone || 'exciting',
        length: params.length || 'medium',
      });
      break;

    case 'video-script':
      result = await generateVideoScript({
        topic: params.topic || 'Top football moments',
        platform: params.platform || 'TikTok',
        duration: params.duration || 60,
      });
      break;

    case 'social-pack':
      result = await Promise.all(['twitter', 'instagram', 'tiktok'].map(platform =>
        generateSocialPost({ content: params.content || 'Football news', platform, type: params.type || 'news' })
      ));
      break;

    default:
      return res.status(400).json({ status: 'error', message: `Unknown generation type: ${type}` });
  }

  ok(res, { type, result, generatedAt: new Date().toISOString() });
}));

// GET /admin/scheduled
router.get('/scheduled', asyncHandler(async (req, res) => {
  const { rows } = await query(
    'SELECT * FROM social_posts WHERE status = $1 ORDER BY scheduled_at ASC LIMIT 50',
    ['scheduled'],
  );
  ok(res, rows);
}));

// GET /admin/metrics
router.get('/metrics', asyncHandler(async (req, res) => {
  const { rows } = await query(`
    SELECT
      DATE(published_at) as date,
      COUNT(*) as articles,
      SUM(views) as views
    FROM articles
    WHERE published_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(published_at)
    ORDER BY date DESC
  `);
  ok(res, rows);
}));

module.exports = router;
