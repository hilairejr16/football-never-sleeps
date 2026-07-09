/**
 * AI-powered content generator using Claude claude-haiku-4-5
 * Generates platform-optimised captions for Twitter/X and Instagram
 */
require('dotenv').config({ path: '../../.env' });
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BRAND_TAGS  = '#GoalRushGlobal #FootballNeverSleeps';
const WC_TAGS     = '#WorldCup2026 #WorldCup #FIFA2026';
const GC_TAGS     = '#GoldCup2025 #CONCACAFGoldCup #CONCACAF';
const FOOTER_TAGS = '#Football #Soccer #LiveFootball';

// ─── Claude helpers ───────────────────────────────────────

async function claude(prompt, maxTokens = 200) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });
    return msg.content[0].text.trim();
  } catch (err) {
    console.error('[ContentGen] Claude error:', err.message);
    return null;
  }
}

async function generateTweetText(context, maxChars = 200) {
  const text = await claude(
    `Write a Twitter/X post for @GoalRushGlobal about: ${context}

Rules:
- Maximum ${maxChars} characters (hashtags added separately — do not include any)
- Football media tone: exciting, punchy, authoritative
- Lead with the key fact, not "Just in" or "Breaking"
- Use 1-3 emojis relevant to football (⚽ 🏆 🔥 ⚡ 🎯 💥)
- Return ONLY the tweet text, nothing else`
  );
  return text;
}

async function generateIGCaption(context) {
  const text = await claude(
    `Write an Instagram caption for @goalrushglobal00 about: ${context}

Rules:
- 3-5 lines, punchy — first line must hook the reader before the "more" cut-off
- Use emojis throughout to add visual rhythm
- Football media voice: energetic and knowledgeable
- Include a call-to-action (e.g. "Follow for live updates ↗️")
- NO hashtags (added separately)
- Return ONLY the caption, nothing else`,
    300
  );
  return text;
}

// ─── Tweet builder (respects 280-char limit) ──────────────

function buildTweet(body, extraTags = '') {
  const tags = [BRAND_TAGS, extraTags].filter(Boolean).join(' ');
  const separator = '\n\n';
  const full = `${body}${separator}${tags}`;
  if (full.length <= 280) return full;
  const maxBody = 280 - tags.length - separator.length - 3;
  return `${body.slice(0, maxBody)}...${separator}${tags}`;
}

// ─── Instagram caption builder ────────────────────────────

function buildIGCaption(body, extraTags = '') {
  const tagBlock = [BRAND_TAGS, extraTags, FOOTER_TAGS].filter(Boolean).join(' ');
  return `${body}\n\n.\n.\n.\n${tagBlock}`;
}

// ─── Score update ─────────────────────────────────────────

async function generateScoreUpdate(match) {
  const { homeTeam, awayTeam, homeScore, awayScore, status, minute, league } = match;
  const score = `${homeScore}–${awayScore}`;
  const liveStr = status === 'LIVE' ? `(${minute}')` : status === 'HT' ? '(HT)' : '(FT)';
  const context = `${homeTeam.name} ${score} ${awayTeam.name} ${liveStr} — ${league.name}`;

  const isWC = /world cup/i.test(league.name);
  const isGC = /gold cup|concacaf/i.test(league.name);
  const extraTags = isWC ? WC_TAGS : isGC ? GC_TAGS : '';

  const [tweetBody, igBody] = await Promise.all([
    generateTweetText(context),
    generateIGCaption(context),
  ]);

  return {
    tweet: tweetBody
      ? buildTweet(tweetBody, extraTags)
      : buildTweet(fallbackScoreTweet(match), extraTags),
    igCaption: igBody
      ? buildIGCaption(igBody, extraTags)
      : buildIGCaption(fallbackScoreIG(match), extraTags),
  };
}

// ─── Goal alert ───────────────────────────────────────────

async function generateGoalAlert(match, scorer, minute) {
  const { homeTeam, awayTeam, homeScore, awayScore, league } = match;
  const score = `${homeScore}–${awayScore}`;
  const context = `GOAL! ${scorer} scores for ${homeTeam.name}! ${homeTeam.name} ${score} ${awayTeam.name} in the ${minute}th minute — ${league.name}`;

  const isWC = /world cup/i.test(league.name);
  const isGC = /gold cup|concacaf/i.test(league.name);
  const extraTags = isWC ? WC_TAGS : isGC ? GC_TAGS : '';

  const [tweetBody, igBody] = await Promise.all([
    generateTweetText(`⚽ ${context}`, 195),
    generateIGCaption(context),
  ]);

  return {
    tweet: tweetBody
      ? buildTweet(`⚽ ${tweetBody}`, extraTags)
      : buildTweet(`⚽ GOAL!\n\n${homeTeam.name} ${score} ${awayTeam.name}\n🎯 ${scorer} (${minute}')`, extraTags),
    igCaption: igBody
      ? buildIGCaption(igBody, extraTags)
      : buildIGCaption(`⚽ GOAL! ${scorer} makes it ${score}!\n\n${homeTeam.name} ${score} ${awayTeam.name}\n⏱️ ${minute}' — ${league.name}\n\n📱 Follow @goalrushglobal00 for live updates`, extraTags),
  };
}

// ─── Half-time update ─────────────────────────────────────

async function generateHalfTimeUpdate(match) {
  const { homeTeam, awayTeam, homeScore, awayScore, league } = match;
  const score = `${homeScore}–${awayScore}`;
  const context = `Half time: ${homeTeam.name} ${score} ${awayTeam.name} — ${league.name}`;

  const isWC = /world cup/i.test(league.name);
  const extraTags = isWC ? WC_TAGS : '';

  const [tweetBody, igBody] = await Promise.all([
    generateTweetText(`🔔 ${context}`),
    generateIGCaption(context),
  ]);

  return {
    tweet: tweetBody
      ? buildTweet(`🔔 ${tweetBody}`, extraTags)
      : buildTweet(`🔔 HALF TIME\n\n${homeTeam.name} ${score} ${awayTeam.name}\n🏆 ${league.name}\n\nBack in 15 minutes...`, extraTags),
    igCaption: igBody
      ? buildIGCaption(igBody, extraTags)
      : buildIGCaption(`🔔 HALF TIME\n\n${homeTeam.name} ${score} ${awayTeam.name}\n🏆 ${league.name}\n\nWhat's your score prediction for the second half? 👇`, extraTags),
  };
}

// ─── Full-time result ─────────────────────────────────────

async function generateFullTimeResult(match) {
  const { homeTeam, awayTeam, homeScore, awayScore, league } = match;
  const score = `${homeScore}–${awayScore}`;
  const winner = homeScore > awayScore ? homeTeam.name : awayScore > homeScore ? awayTeam.name : null;
  const context = winner
    ? `Full time: ${homeTeam.name} ${score} ${awayTeam.name} — ${winner} wins! ${league.name}`
    : `Full time: ${homeTeam.name} ${score} ${awayTeam.name} — it's a draw! ${league.name}`;

  const isWC = /world cup/i.test(league.name);
  const isGC = /gold cup|concacaf/i.test(league.name);
  const extraTags = isWC ? WC_TAGS : isGC ? GC_TAGS : '';

  const [tweetBody, igBody] = await Promise.all([
    generateTweetText(`🏁 ${context}`),
    generateIGCaption(context),
  ]);

  return {
    tweet: tweetBody
      ? buildTweet(`🏁 ${tweetBody}`, extraTags)
      : buildTweet(`🏁 FULL TIME\n\n${homeTeam.name} ${score} ${awayTeam.name}\n🏆 ${league.name}${winner ? `\n\n${winner} advance!` : ''}`, extraTags),
    igCaption: igBody
      ? buildIGCaption(igBody, extraTags)
      : buildIGCaption(`🏁 FULL TIME RESULT\n\n${homeTeam.name} ${score} ${awayTeam.name}\n🏆 ${league.name}\n\nFull match report ↗️ goalrushglobal.com`, extraTags),
  };
}

// ─── Morning briefing ─────────────────────────────────────

async function generateMorningBriefing(matches) {
  const matchList = matches.slice(0, 4)
    .map(m => `${m.homeTeam.name} vs ${m.awayTeam.name}`)
    .join(', ');

  const context = matches.length > 0
    ? `Good morning! Today's football: ${matchList}`
    : "Good morning! A lighter day in football — but the game never stops";

  const hasWC = matches.some(m => /world cup/i.test(m.league?.name));
  const hasGC = matches.some(m => /gold cup|concacaf/i.test(m.league?.name));
  const extraTags = hasWC ? WC_TAGS : hasGC ? GC_TAGS : '';

  const [tweetBody, igBody] = await Promise.all([
    generateTweetText(`☀️ ${context}`),
    generateIGCaption(context),
  ]);

  return {
    tweet: tweetBody
      ? buildTweet(`☀️ ${tweetBody}`, extraTags)
      : buildTweet(`☀️ GOOD MORNING\n\nAnother day of football. Here's what's on 🗓️\n\n${matchList || 'Full schedule at goalrushglobal.com'}`, extraTags),
    igCaption: igBody
      ? buildIGCaption(igBody, extraTags)
      : buildIGCaption(`☀️ Good morning! Football never sleeps.\n\nToday's matches:\n${matchList || '→ goalrushglobal.com'}\n\nFollow for live scores and updates 📲`, extraTags),
  };
}

// ─── Evening recap ────────────────────────────────────────

async function generateEveningRecap(completedMatches) {
  const scoreLines = completedMatches.slice(0, 4)
    .map(m => `${m.homeTeam.name} ${m.homeScore}–${m.awayScore} ${m.awayTeam.name}`)
    .join('\n');

  const context = `Evening results: ${scoreLines || "No major matches today"}`;

  const hasWC = completedMatches.some(m => /world cup/i.test(m.league?.name));
  const hasGC = completedMatches.some(m => /gold cup|concacaf/i.test(m.league?.name));
  const extraTags = hasWC ? WC_TAGS : hasGC ? GC_TAGS : '';

  const [tweetBody, igBody] = await Promise.all([
    generateTweetText(`🌙 ${context}`),
    generateIGCaption(context),
  ]);

  return {
    tweet: tweetBody
      ? buildTweet(`🌙 ${tweetBody}`, extraTags)
      : buildTweet(`🌙 TODAY'S RESULTS\n\n${scoreLines || 'No matches today'}\n\nFull reports → goalrushglobal.com`, extraTags),
    igCaption: igBody
      ? buildIGCaption(igBody, extraTags)
      : buildIGCaption(`🌙 TODAY'S RESULTS\n\n${scoreLines || 'Quiet day, big matches tomorrow!'}\n\n📊 Full stats and analysis: goalrushglobal.com`, extraTags),
  };
}

// ─── Fallback templates ───────────────────────────────────

function fallbackScoreTweet(match) {
  const { homeTeam, awayTeam, homeScore, awayScore, status, minute, league } = match;
  const score = `${homeScore}–${awayScore}`;
  const statusStr = status === 'LIVE' ? `${minute}'` : status;
  return `🏆 ${homeTeam.name} ${score} ${awayTeam.name} [${statusStr}]\n📊 ${league.name}`;
}

function fallbackScoreIG(match) {
  const { homeTeam, awayTeam, homeScore, awayScore, league } = match;
  return `🏆 ${league.name}\n\n${homeTeam.name} ${homeScore}–${awayScore} ${awayTeam.name}\n\n📱 Follow @goalrushglobal00 for live updates`;
}

module.exports = {
  generateScoreUpdate,
  generateGoalAlert,
  generateHalfTimeUpdate,
  generateFullTimeResult,
  generateMorningBriefing,
  generateEveningRecap,
  buildTweet,
  buildIGCaption,
};
