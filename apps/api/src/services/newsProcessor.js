'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const slugify   = require('slugify');

let _client = null;
function getClient() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

// ─── Process a single raw RSS article through Claude ──────────────────────────
// Returns enriched article + platform-specific social posts
async function processArticle(raw) {
  const client = getClient();

  const prompt = `You are the editorial AI for GoalRush Global — the world's premier AI football media brand.

A news article has been fetched from an external source. Your job is to:
1. Rewrite it in GoalRush voice (punchy, exciting, authoritative — like ESPN + Sky Sports combined)
2. Generate social media posts for every platform
3. Extract structured metadata

SOURCE ARTICLE:
Title: ${raw.title}
Source: ${raw.source} (${raw.sourceRegion})
Category hint: ${raw.category}
Excerpt: ${raw.excerpt}
Published: ${raw.publishedAt}
Original URL: ${raw.url}

INSTRUCTIONS:
- Rewrite the headline and excerpt in GoalRush voice (keep factual accuracy)
- Write a 200-300 word article body expanding on the excerpt with football context
- For social posts: be platform-native, use emojis freely, maximize engagement
- Always attribute: "via ${raw.source}" at end of article
- Detect entity names (teams, players, competitions)

Return ONLY valid JSON (no markdown):
{
  "title": "rewritten headline",
  "slug": "url-safe-slug",
  "excerpt": "2-sentence hook",
  "content": "full 200-300w article body in markdown",
  "category": "${raw.category}",
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "entities": {"teams":["..."],"players":["..."],"competitions":["..."]},
  "readTime": 2,
  "isBreaking": true/false,
  "social": {
    "x": "Max 280 chars. Punchy, 3-5 hashtags. Include link placeholder {{LINK}}",
    "instagram": "Max 2200 chars. Longer, storytelling style, 15-20 hashtags, CTA at end",
    "facebook": "Max 500 chars. Conversational, link preview friendly, 3-5 hashtags",
    "tiktok": "Max 150 chars caption for a video post, 5-8 trending hashtags",
    "threads": "Max 500 chars. Conversational, opinion-forward, 2-3 hashtags",
    "youtube_title": "Max 70 chars YouTube Shorts title",
    "youtube_desc": "Max 500 chars description with hashtags"
  },
  "videoScript": "60-second spoken script for YouTube Shorts / TikTok voiceover (energetic, hook in first 3 seconds)",
  "attribution": "Source: ${raw.source} | Original: ${raw.url}"
}`;

  try {
    const msg = await client.messages.create({
      model:      'claude-haiku-4-5-20251001', // Fast + cheap for high-volume processing
      max_tokens: 1800,
      messages:   [{ role: 'user', content: prompt }],
    });

    const text = msg.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const processed = JSON.parse(jsonMatch[0]);

    // Auto-generate slug if missing
    if (!processed.slug) {
      processed.slug = slugify(processed.title || raw.title, { lower: true, strict: true });
    }

    return {
      ...raw,
      ...processed,
      originalUrl:    raw.url,
      originalSource: raw.source,
      processedAt:    new Date().toISOString(),
      processed:      true,
    };
  } catch (err) {
    console.error('[newsProcessor] AI processing failed:', err.message);
    // Return raw article with minimal social posts so pipeline continues
    return {
      ...raw,
      slug:     slugify(raw.title || 'football-news', { lower: true, strict: true }),
      content:  raw.excerpt,
      tags:     ['Football', 'GoalRush'],
      isBreaking: raw.category === 'breaking',
      social: {
        x:           `${raw.title} | Read more at GoalRush Global #Football #Soccer`,
        instagram:   `${raw.title}\n\nRead the full story at GoalRush Global 🌐\n\n#Football #Soccer #GoalRush`,
        facebook:    `${raw.title} — via ${raw.source}`,
        tiktok:      `${raw.title.slice(0, 100)} #Football #Soccer #WC2026`,
        threads:     `${raw.title} — thoughts? #Football`,
      },
      attribution:  `Source: ${raw.source} | Original: ${raw.url}`,
      processedAt:  new Date().toISOString(),
      processed:    true,
    };
  }
}

// Batch process up to N articles in series (avoid rate limits)
async function processBatch(articles, { maxItems = 10, delayMs = 500 } = {}) {
  const results = [];
  const batch = articles.slice(0, maxItems);

  for (const article of batch) {
    const result = await processArticle(article);
    results.push(result);
    if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
  }

  return results;
}

// Generate a digest post (hourly / daily / weekly) from multiple articles
async function generateDigest(articles, type = 'hourly') {
  if (!articles.length) return null;
  const client = getClient();

  const headlines = articles.slice(0, 10).map((a, i) =>
    `${i + 1}. [${a.category?.toUpperCase()}] ${a.title} (${a.source})`
  ).join('\n');

  const typeConfig = {
    hourly: { label: 'Hourly Digest',    maxItems: 5,  xPrefix: '⚡ HOUR RECAP',  igPrefix: '⚡ This Hour in Football' },
    daily:  { label: 'Daily Roundup',    maxItems: 8,  xPrefix: '📰 DAILY WRAP', igPrefix: '📰 Today in Football'     },
    weekly: { label: 'Weekly Highlights', maxItems: 10, xPrefix: '🗞️ WEEK WRAP',  igPrefix: '🗞️ The Week in Football'  },
  };
  const cfg = typeConfig[type] || typeConfig.daily;

  const msg = await client.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    messages: [{
      role: 'user',
      content: `You are the editorial AI for GoalRush Global.

Create a ${cfg.label} social media post package from these football headlines:
${headlines}

Return ONLY valid JSON:
{
  "x": "${cfg.xPrefix} | max 280 chars covering top 3 stories, 4-6 hashtags",
  "instagram": "${cfg.igPrefix} — long form, each story gets 1-2 lines, 15-20 hashtags, CTA",
  "facebook": "Conversational digest, link to website, 500 chars max",
  "tiktok": "150 char caption for a highlights video, 6-8 hashtags",
  "threads": "Opinion-forward digest, 500 chars, 2-3 hashtags",
  "headline": "Short digest headline for website",
  "summary": "2-sentence website summary"
}`,
    }],
  });

  try {
    const m = msg.content[0].text.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  } catch {
    return null;
  }
}

module.exports = { processArticle, processBatch, generateDigest };
