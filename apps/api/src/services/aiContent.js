const Anthropic = require('@anthropic-ai/sdk');
const { cacheGetOrSet } = require('../config/redis');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Lazy OpenAI client — only instantiated if OPENAI_API_KEY is present
let _openai = null;
function getOpenAI() {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) return null;
    const OpenAI = require('openai');
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

// ─── Article Generation ────────────────────────────────────

async function generateNewsArticle({ topic, matchData, tone = 'exciting', length = 'medium' }) {
  const wordCount = length === 'short' ? 200 : length === 'medium' ? 500 : 900;

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You are a world-class football journalist for GoalRush Global, the premier AI-powered football media brand.

Write a ${tone} football news article about: ${topic}
${matchData ? `Match context: ${JSON.stringify(matchData)}` : ''}

Requirements:
- ${wordCount} words
- Punchy, viral headline
- SEO-optimized
- Include tactical insights where relevant
- Tone: ${tone}
- Style: modern sports journalism (ESPN / Bleacher Report quality)
- End with a key takeaway

Format your response as JSON:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...(2 sentences)",
  "content": "...(full article in markdown)",
  "tags": ["tag1", "tag2"],
  "seoTitle": "...",
  "seoDescription": "...",
  "readTime": number
}`,
    }],
  });

  const text = message.content[0].text;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch {
    return { title: topic, content: text, excerpt: text.slice(0, 150) };
  }
}

// ─── Match Summary ─────────────────────────────────────────

async function generateMatchSummary(match) {
  const cacheKey = `ai:summary:${match.id}`;

  return cacheGetOrSet(cacheKey, async () => {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Write an exciting match summary for:
${match.homeTeam.name} ${match.homeScore}-${match.awayScore} ${match.awayTeam.name}
League: ${match.league.name}
Events: ${JSON.stringify(match.events?.slice(0, 10) || [])}

Write 3-4 vivid paragraphs. Make it feel like Sky Sports commentary. Return plain text.`,
      }],
    });
    return message.content[0].text;
  }, 3600);
}

// ─── Match Prediction ──────────────────────────────────────

async function generateMatchPrediction(homeTeam, awayTeam, recentForm) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `Generate an AI football match prediction.

${homeTeam.name} (HOME) vs ${awayTeam.name} (AWAY)
Recent form: ${JSON.stringify(recentForm || {})}

Provide a tactical analysis and prediction. Return as JSON:
{
  "homeWinPct": number(0-100),
  "drawPct": number,
  "awayWinPct": number,
  "predictedScore": {"home": number, "away": number},
  "btts": boolean,
  "over25Goals": boolean,
  "keyFactor": "string(1 sentence)",
  "confidence": number(0-100),
  "analysis": "string(2-3 sentences)"
}
Ensure homeWinPct + drawPct + awayWinPct = 100.`,
    }],
  });

  const text = message.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
}

// ─── Video Script ──────────────────────────────────────────

async function generateVideoScript({ topic, platform, duration = 60, style = 'energetic' }) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Create a ${duration}-second ${platform} video script about: ${topic}

Style: ${style}, viral, fast-paced
Platform: ${platform} (optimize for algorithm)

Format as JSON:
{
  "hook": "First 3 seconds — must be viral",
  "script": "Full word-for-word voiceover script",
  "visualCues": ["cue1", "cue2", ...],
  "musicMood": "string",
  "captions": ["line1", "line2", ...],
  "hashtags": ["#tag1", "#tag2", ...],
  "cta": "Call to action text",
  "estimatedViews": "viral potential: low/medium/high/explosive"
}`,
    }],
  });

  const text = message.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
}

// ─── Social Media Post ─────────────────────────────────────

async function generateSocialPost({ content, platform, type = 'news' }) {
  const limits = { twitter: 280, instagram: 2200, tiktok: 150, facebook: 500 };
  const limit = limits[platform] || 280;

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Write a viral ${platform} post about: ${content}
Type: ${type}
Max chars: ${limit}
Style: engaging, emotional, football fan language
Include relevant emojis and 5-8 hashtags.
Return JSON: {"text": "...", "hashtags": [...]}`,
    }],
  });

  const text = message.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : { text: content, hashtags: ['#Football'] };
}

// ─── Transfer Analysis ─────────────────────────────────────

async function generateTransferAnalysis(transfer) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `Analyze this football transfer:
Player: ${transfer.player.name} (${transfer.player.position}, ${transfer.player.nationality})
From: ${transfer.fromTeam.name}
To: ${transfer.toTeam.name}
Fee: ${transfer.fee ? `€${(transfer.fee / 1e6).toFixed(0)}M` : 'Unknown'}

Write a 150-word tactical analysis: what this means for both clubs. Return plain text.`,
    }],
  });

  return message.content[0].text;
}

// ─── Hashtag Generator ─────────────────────────────────────

async function generateHashtags(topic, platform) {
  const { data } = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: `Generate 15 viral football hashtags for "${topic}" optimized for ${platform}.
Return JSON array: ["#Tag1", "#Tag2", ...]`,
    }],
    max_tokens: 200,
  });

  try {
    const text = data.choices[0].message.content;
    const match = text.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : ['#Football', '#GoalRush'];
  } catch {
    return ['#Football', '#GoalRush', '#LiveFootball'];
  }
}

module.exports = {
  generateNewsArticle,
  generateMatchSummary,
  generateMatchPrediction,
  generateVideoScript,
  generateSocialPost,
  generateTransferAnalysis,
  generateHashtags,
};
