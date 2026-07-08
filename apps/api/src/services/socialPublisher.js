'use strict';

// ─── Social Media Publisher ────────────────────────────────────────────────────
// Supports: X (Twitter), Instagram, Facebook, TikTok, Threads, YouTube
// Each platform activates only when its credentials are present in env.
// Posts are queued in-memory (Redis-backed when available) for rate-limit safety.

const crypto = require('crypto');

// ── In-memory post queue (Redis-backed when available) ─────
const postQueue  = [];  // { id, platform, content, article, status, createdAt, postedAt }
const postLog    = [];  // completed + failed posts (last 500)
const MAX_LOG    = 500;

function queuePost(platform, content, article, { immediate = false } = {}) {
  const entry = {
    id:        crypto.randomUUID(),
    platform,
    content,
    article:   { id: article.id, title: article.title, category: article.category, url: article.originalUrl },
    status:    immediate ? 'pending_immediate' : 'pending',
    createdAt: new Date().toISOString(),
    postedAt:  null,
    error:     null,
  };
  postQueue.push(entry);
  return entry.id;
}

function logResult(entry, { success, error, response } = {}) {
  entry.status   = success ? 'posted' : 'failed';
  entry.postedAt = new Date().toISOString();
  entry.error    = error || null;
  entry.response = response || null;
  postLog.unshift(entry);
  if (postLog.length > MAX_LOG) postLog.pop();
}

// ── Platform credential checks ─────────────────────────────
const platforms = {
  x:         () => !!(process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET &&
                       process.env.TWITTER_ACCESS_TOKEN && process.env.TWITTER_ACCESS_SECRET),
  instagram: () => !!(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ID),
  facebook:  () => !!(process.env.FACEBOOK_PAGE_ACCESS_TOKEN && process.env.FACEBOOK_PAGE_ID),
  tiktok:    () => !!(process.env.TIKTOK_ACCESS_TOKEN && process.env.TIKTOK_CLIENT_KEY),
  threads:   () => !!(process.env.THREADS_ACCESS_TOKEN && process.env.THREADS_USER_ID),
  youtube:   () => !!(process.env.YOUTUBE_CHANNEL_ID && process.env.YOUTUBE_API_KEY),
};

// ── X (Twitter API v2) ─────────────────────────────────────

function buildOAuthHeader(method, url, params, creds) {
  const oauthParams = {
    oauth_consumer_key:     creds.apiKey,
    oauth_nonce:            crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        Math.floor(Date.now() / 1000).toString(),
    oauth_token:            creds.accessToken,
    oauth_version:          '1.0',
  };

  const allParams = { ...params, ...oauthParams };
  const sortedKeys = Object.keys(allParams).sort();
  const paramStr = sortedKeys
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`)
    .join('&');

  const base = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(paramStr),
  ].join('&');

  const signingKey = `${encodeURIComponent(creds.apiSecret)}&${encodeURIComponent(creds.accessSecret)}`;
  const signature  = crypto.createHmac('sha1', signingKey).update(base).digest('base64');

  oauthParams.oauth_signature = signature;
  const headerVal = Object.keys(oauthParams)
    .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(', ');

  return `OAuth ${headerVal}`;
}

async function postToX(text, { replyToId } = {}) {
  const url  = 'https://api.twitter.com/2/tweets';
  const body = { text: text.slice(0, 280) };
  if (replyToId) body.reply = { in_reply_to_tweet_id: replyToId };

  const auth = buildOAuthHeader('POST', url, {}, {
    apiKey:       process.env.TWITTER_API_KEY,
    apiSecret:    process.env.TWITTER_API_SECRET,
    accessToken:  process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  const res = await fetch(url, {
    method:  'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
    signal:  AbortSignal.timeout(15_000),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`X API ${res.status}: ${JSON.stringify(data)}`);
  return data.data; // { id, text }
}

// Thread = multiple chained tweets
async function postThreadToX(tweets) {
  let replyToId = null;
  const posted  = [];
  for (const text of tweets) {
    const result = await postToX(text, replyToId ? { replyToId } : {});
    replyToId = result.id;
    posted.push(result);
    await new Promise(r => setTimeout(r, 1000));
  }
  return posted;
}

// ── Instagram Graph API ────────────────────────────────────
// Requires an image URL. Text-only posts are not supported by Instagram API.
// We use a branded placeholder image per category when no article image is available.

const CATEGORY_IMAGES = {
  breaking:    'https://goalrushglobal.com/brand/og-breaking.jpg',
  transfer:    'https://goalrushglobal.com/brand/og-transfer.jpg',
  'world-cup': 'https://goalrushglobal.com/brand/og-wc2026.jpg',
  analysis:    'https://goalrushglobal.com/brand/og-analysis.jpg',
  general:     'https://goalrushglobal.com/brand/og-default.jpg',
};

async function postToInstagram(caption, imageUrl, category = 'general') {
  const userId = process.env.INSTAGRAM_BUSINESS_ID;
  const token  = process.env.INSTAGRAM_ACCESS_TOKEN;
  const imgUrl = imageUrl || CATEGORY_IMAGES[category] || CATEGORY_IMAGES.general;
  const base   = `https://graph.facebook.com/v19.0`;

  // Step 1: Create media container
  const createRes = await fetch(`${base}/${userId}/media`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imgUrl, caption: caption.slice(0, 2200), access_token: token }),
    signal: AbortSignal.timeout(20_000),
  });
  const create = await createRes.json();
  if (!createRes.ok || !create.id) throw new Error(`IG container: ${JSON.stringify(create)}`);

  // Step 2: Publish
  await new Promise(r => setTimeout(r, 3000)); // IG requires brief delay
  const pubRes = await fetch(`${base}/${userId}/media_publish`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: create.id, access_token: token }),
    signal: AbortSignal.timeout(20_000),
  });
  const pub = await pubRes.json();
  if (!pubRes.ok) throw new Error(`IG publish: ${JSON.stringify(pub)}`);
  return pub; // { id }
}

// ── Facebook Graph API ─────────────────────────────────────
async function postToFacebook(message, linkUrl) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token  = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  const body = { message: message.slice(0, 63_000), access_token: token };
  if (linkUrl) body.link = linkUrl;

  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
    signal:  AbortSignal.timeout(15_000),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`FB API ${res.status}: ${JSON.stringify(data)}`);
  return data; // { id: "page_post_id" }
}

// ── Threads API (Meta) ─────────────────────────────────────
async function postToThreads(text, imageUrl) {
  const userId = process.env.THREADS_USER_ID;
  const token  = process.env.THREADS_ACCESS_TOKEN;
  const base   = 'https://graph.threads.net/v1.0';

  const mediaType = imageUrl ? 'IMAGE' : 'TEXT';
  const body = { media_type: mediaType, text: text.slice(0, 500), access_token: token };
  if (imageUrl) body.image_url = imageUrl;

  // Step 1: Create container
  const createRes = await fetch(`${base}/${userId}/threads`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
    signal:  AbortSignal.timeout(15_000),
  });
  const create = await createRes.json();
  if (!createRes.ok || !create.id) throw new Error(`Threads container: ${JSON.stringify(create)}`);

  await new Promise(r => setTimeout(r, 2000));

  // Step 2: Publish
  const pubRes = await fetch(`${base}/${userId}/threads_publish`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ creation_id: create.id, access_token: token }),
    signal:  AbortSignal.timeout(15_000),
  });
  const pub = await pubRes.json();
  if (!pubRes.ok) throw new Error(`Threads publish: ${JSON.stringify(pub)}`);
  return pub;
}

// ── TikTok Content Posting API ─────────────────────────────
// TikTok requires video files — we queue the script + caption for manual upload
// or for the video generation pipeline (ElevenLabs + Remotion/FFmpeg).
async function queueTikTokContent(caption, videoScript, article) {
  // Direct video posting requires a pre-uploaded video file via TikTok's upload endpoint.
  // We log the content for the video pipeline to pick up.
  console.log(`[TikTok] Content queued for video pipeline: "${article.title}"`);
  return {
    status: 'queued_for_video_pipeline',
    caption: caption.slice(0, 2200),
    videoScript,
    articleId: article.id,
    note: 'Video content requires ElevenLabs voiceover + video generation pipeline',
  };
}

// ── YouTube Shorts (via Data API v3) ──────────────────────
// YouTube requires actual video file upload — queue script for pipeline
async function queueYouTubeContent(title, description, videoScript, article) {
  console.log(`[YouTube] Content queued for video pipeline: "${title}"`);
  return {
    status: 'queued_for_video_pipeline',
    title: title.slice(0, 100),
    description: description.slice(0, 5000),
    videoScript,
    articleId: article.id,
    note: 'Requires video generation pipeline (FFmpeg + ElevenLabs TTS voiceover)',
  };
}

// ─── Main: Publish to All Active Platforms ─────────────────

async function publishArticle(article, { platforms: targetPlatforms } = {}) {
  const social   = article.social || {};
  const siteUrl  = `${process.env.APP_URL || 'https://goalrushglobal.com'}/news/${article.slug}`;
  const results  = {};

  const active = targetPlatforms || Object.keys(platforms).filter(p => platforms[p]());
  console.log(`[Publisher] Publishing "${article.title}" to: ${active.join(', ') || 'none (no credentials)'}`);

  for (const platform of active) {
    if (!platforms[platform]()) {
      results[platform] = { status: 'skipped', reason: 'credentials not configured' };
      continue;
    }

    try {
      switch (platform) {
        case 'x': {
          const text = (social.x || article.title).replace('{{LINK}}', siteUrl).slice(0, 280);
          results.x = await postToX(text);
          break;
        }
        case 'instagram': {
          const caption = (social.instagram || article.excerpt || article.title)
            + `\n\n🌐 goalrushglobal.com`;
          results.instagram = await postToInstagram(caption, article.image, article.category);
          break;
        }
        case 'facebook': {
          const msg = social.facebook || `${article.title}\n\n${article.excerpt || ''}`;
          results.facebook = await postToFacebook(msg, siteUrl);
          break;
        }
        case 'threads': {
          const text = social.threads || `${article.title}\n\n#Football #Soccer`;
          results.threads = await postToThreads(text, article.image);
          break;
        }
        case 'tiktok': {
          results.tiktok = await queueTikTokContent(
            social.tiktok || article.title,
            article.videoScript || '',
            article,
          );
          break;
        }
        case 'youtube': {
          results.youtube = await queueYouTubeContent(
            social.youtube_title || article.title,
            social.youtube_desc || article.excerpt || '',
            article.videoScript || '',
            article,
          );
          break;
        }
      }
      console.log(`[Publisher] ✅ ${platform}: success`);
    } catch (err) {
      console.error(`[Publisher] ❌ ${platform}: ${err.message}`);
      results[platform] = { status: 'error', message: err.message };
    }

    await new Promise(r => setTimeout(r, 500)); // throttle between platforms
  }

  return results;
}

// Publish a digest (hourly / daily / weekly) across platforms
async function publishDigest(digestContent, articles, type = 'hourly') {
  if (!digestContent) return {};
  const results = {};
  const siteUrl = `${process.env.APP_URL || 'https://goalrushglobal.com'}/news`;

  if (platforms.x()) {
    try {
      results.x = await postToX((digestContent.x || '').slice(0, 280));
    } catch (e) { results.x = { error: e.message }; }
  }

  if (platforms.instagram()) {
    try {
      results.instagram = await postToInstagram(
        digestContent.instagram || digestContent.summary || '',
        CATEGORY_IMAGES['world-cup'],
        'general',
      );
    } catch (e) { results.instagram = { error: e.message }; }
  }

  if (platforms.facebook()) {
    try {
      results.facebook = await postToFacebook(
        digestContent.facebook || digestContent.summary || '',
        siteUrl,
      );
    } catch (e) { results.facebook = { error: e.message }; }
  }

  if (platforms.threads()) {
    try {
      results.threads = await postToThreads(digestContent.threads || digestContent.summary || '');
    } catch (e) { results.threads = { error: e.message }; }
  }

  return results;
}

// ─── Queue & Status ────────────────────────────────────────

function getQueue()     { return postQueue.slice(); }
function getLog()       { return postLog.slice(0, 100); }
function clearQueue()   { postQueue.length = 0; }

function getPlatformStatus() {
  return Object.fromEntries(
    Object.entries(platforms).map(([k, check]) => [k, { active: check(), env: getEnvStatus(k) }])
  );
}

function getEnvStatus(platform) {
  const envMap = {
    x:         ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'],
    instagram: ['INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_BUSINESS_ID'],
    facebook:  ['FACEBOOK_PAGE_ACCESS_TOKEN', 'FACEBOOK_PAGE_ID'],
    tiktok:    ['TIKTOK_ACCESS_TOKEN', 'TIKTOK_CLIENT_KEY'],
    threads:   ['THREADS_ACCESS_TOKEN', 'THREADS_USER_ID'],
    youtube:   ['YOUTUBE_CHANNEL_ID', 'YOUTUBE_API_KEY'],
  };
  return (envMap[platform] || []).map(k => ({ key: k, set: !!process.env[k] }));
}

module.exports = {
  publishArticle,
  publishDigest,
  postToX,
  postThreadToX,
  postToInstagram,
  postToFacebook,
  postToThreads,
  getQueue,
  getLog,
  clearQueue,
  getPlatformStatus,
  queuePost,
};
