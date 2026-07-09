const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const { asyncHandler } = require('../middleware/errorHandler');
const { postArticleTweet, buildArticleTweet } = require('../services/twitter');

const ok  = (res, data) => res.json({ status: 'success', data });
const err = (res, msg, code = 400) => res.status(code).json({ status: 'error', message: msg });

// POST /social/tweet
// Body: { text } — post a raw tweet
router.post('/tweet', asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return err(res, 'text is required');
  if (text.length > 280) return err(res, 'Tweet exceeds 280 characters');
  const tweet = await postArticleTweet(text.trim(), '');
  ok(res, { id: tweet.id, text: tweet.text });
}));

// POST /social/tweet-article
// Body: { title, excerpt, slug } — post a formatted article tweet
router.post('/tweet-article', asyncHandler(async (req, res) => {
  const { title, excerpt, slug } = req.body;
  if (!title || !slug) return err(res, 'title and slug are required');
  const { text, url } = buildArticleTweet({ title, excerpt, slug });
  const tweet = await postArticleTweet(text, url);
  ok(res, { id: tweet.id, text: tweet.text, url });
}));

// POST /social/ai-tweet
// Body: { topic, matchup? } — generate + post an AI article tweet about a WC topic
router.post('/ai-tweet', asyncHandler(async (req, res) => {
  const { topic, matchup } = req.body;
  if (!topic) return err(res, 'topic is required');

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = matchup
    ? `Write a punchy, engaging tweet for @GoalRushGlobal about ${matchup} at FIFA World Cup 2026.
       Topic: ${topic}
       Requirements:
       - Max 220 characters (leave room for hashtags)
       - Football fan voice, exciting, factual
       - End with relevant emojis
       - Do NOT include hashtags (added automatically)
       - No quotes around the text
       Return ONLY the tweet text, nothing else.`
    : `Write a punchy tweet for @GoalRushGlobal about FIFA World Cup 2026.
       Topic: ${topic}
       Requirements:
       - Max 220 characters
       - Football fan voice, exciting, factual
       - End with relevant emojis
       - No hashtags (added automatically)
       Return ONLY the tweet text, nothing else.`;

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 100,
    messages: [{ role: 'user', content: prompt }],
  });

  const generated = message.content[0]?.text?.trim() || '';
  if (!generated) return err(res, 'AI failed to generate tweet content');

  const fullText = `${generated}\n\n#WorldCup2026 #GoalRush ⚽`;
  const tweet = await postArticleTweet(fullText, 'https://www.goalrushglobal.com');
  ok(res, { id: tweet.id, text: tweet.text, generated });
}));

module.exports = router;
