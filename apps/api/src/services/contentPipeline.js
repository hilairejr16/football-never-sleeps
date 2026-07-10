'use strict';

// ─── GoalRush Global Faceless Content Pipeline ────────────────────────────────
// Match ends → Claude generates report → ElevenLabs voices it →
// FFmpeg builds 9:16 video → YouTube Shorts upload → Tweet + TikTok

const path   = require('path');
const os     = require('os');
const fs     = require('fs');
const crypto = require('crypto');

const { generateMatchSummary, generateVideoScript } = require('./aiContent');
const { generateSpeechFile }                        = require('./elevenLabs');
const { generateMatchVideo, cleanupDir }            = require('./videoGenerator');
const { uploadToYouTube }                           = require('./youtubeUpload');
const { uploadToTikTok }                            = require('./tiktokUpload');
const { postToX }                                   = require('./socialPublisher');

// ── In-memory job tracker (last 50 jobs) ───────────────────────────────────────
const jobs = new Map();
const MAX_JOBS = 50;

function createJob(match) {
  const id  = crypto.randomUUID();
  const job = {
    id,
    status:    'pending',
    match:     { id: match.id, homeTeam: match.homeTeam?.name, awayTeam: match.awayTeam?.name, score: `${match.homeScore}-${match.awayScore}` },
    result:    null,
    error:     null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  jobs.set(id, job);
  if (jobs.size > MAX_JOBS) jobs.delete([...jobs.keys()][0]);
  return id;
}

function updateJob(id, patch) {
  const job = jobs.get(id);
  if (job) Object.assign(job, patch, { updatedAt: new Date().toISOString() });
}

function getJob(id)   { return jobs.get(id) || null; }
function getAllJobs()  { return [...jobs.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }

// ── Silent audio fallback (when ElevenLabs not configured) ────────────────────
async function generateSilentAudio(outputPath, durationSeconds = 58) {
  return new Promise((resolve, reject) => {
    const ffmpeg = require('fluent-ffmpeg');
    try { ffmpeg.setFfmpegPath(require('ffmpeg-static')); } catch {}
    ffmpeg()
      .input('anullsrc=r=44100:cl=stereo').inputOptions(['-f lavfi'])
      .outputOptions([`-t ${durationSeconds}`, '-c:a aac', '-b:a 128k'])
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}

// ── Main Pipeline ─────────────────────────────────────────────────────────────
async function runVideoPipeline(match, existingJobId) {
  const jobId  = existingJobId || createJob(match);
  const tmpDir = path.join(os.tmpdir(), 'goalrush-videos', jobId);
  await fs.promises.mkdir(tmpDir, { recursive: true });

  const home = match.homeTeam?.name || 'Home';
  const away = match.awayTeam?.name || 'Away';
  const hs   = match.homeScore ?? 0;
  const as_  = match.awayScore ?? 0;

  try {
    // ── 1. Generate match summary via Claude ──
    updateJob(jobId, { status: 'generating_script', step: '1/5 — AI match report' });
    let commentary = `${home} ${hs}-${as_} ${away} at ${match.league?.name || 'FIFA World Cup 2026'}.`;
    let hashtags   = ['#WorldCup2026', '#Football', '#GoalRush', '#Shorts'];

    try {
      const summary    = await generateMatchSummary(match);
      const scriptData = await generateVideoScript({
        topic:    `${home} ${hs}-${as_} ${away} ${match.league?.round?.replace(/_/g, ' ') || ''}`,
        platform: 'youtube',
        duration: 55,
        style:    'energetic',
      });
      commentary = scriptData?.script || summary || commentary;
      hashtags   = scriptData?.hashtags?.slice(0, 8) || hashtags;
    } catch (e) {
      console.warn('[Pipeline] AI generation failed, using fallback:', e.message);
    }

    // ── 2. ElevenLabs TTS voiceover ──
    updateJob(jobId, { status: 'generating_audio', step: '2/5 — Voiceover' });
    const audioPath = path.join(tmpDir, 'voiceover.mp3');
    if (process.env.ELEVENLABS_API_KEY) {
      await generateSpeechFile(commentary, audioPath);
    } else {
      await generateSilentAudio(audioPath, 58);
      console.warn('[Pipeline] ElevenLabs not configured — using silent audio');
    }

    // ── 3. Generate video ──
    updateJob(jobId, { status: 'generating_video', step: '3/5 — Building video' });
    const { videoPath } = await generateMatchVideo({ match, commentary, audioPath, outDir: tmpDir });

    // ── 4. Upload ──
    updateJob(jobId, { status: 'uploading', step: '4/5 — Uploading' });
    const title       = `${home} ${hs}-${as_} ${away} | ${match.league?.name || 'WC 2026'} Highlights #Shorts`;
    const description = `${home} ${hs}-${as_} ${away} full match analysis.\n\n${commentary.slice(0, 400)}`;
    const tags        = [home, away, 'WorldCup2026', 'Football', 'Soccer', 'GoalRush', 'Highlights', 'Shorts'].filter(Boolean);
    const result      = { jobId, match: { home, away, score: `${hs}-${as_}` } };

    // YouTube Shorts
    if (process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_REFRESH_TOKEN) {
      try {
        result.youtube = await uploadToYouTube({ videoPath, title, description, tags });
        console.log(`[Pipeline] ✅ YouTube: ${result.youtube.youtubeUrl}`);
      } catch (e) {
        console.error('[Pipeline] YouTube failed:', e.message);
        result.youtube = { error: e.message };
      }
    } else {
      result.youtube = { status: 'skipped', reason: 'YouTube OAuth not configured' };
    }

    // Twitter — link to YouTube Short
    updateJob(jobId, { step: '5/5 — Social posting' });
    if (process.env.TWITTER_API_KEY) {
      try {
        const tweetParts = [
          `⚽ ${home} ${hs}–${as_} ${away}`,
          `${match.league?.round?.replace(/_/g, ' ') || 'WC 2026'} Match Report`,
          '',
          hashtags.slice(0, 4).join(' '),
        ];
        if (result.youtube?.youtubeUrl) tweetParts.push('', result.youtube.youtubeUrl);
        const tweetText = tweetParts.join('\n').slice(0, 280);
        result.twitter = await postToX(tweetText);
        console.log(`[Pipeline] ✅ Twitter: tweet ${result.twitter.id}`);
      } catch (e) {
        console.error('[Pipeline] Twitter failed:', e.message);
        result.twitter = { error: e.message };
      }
    }

    // TikTok
    if (process.env.TIKTOK_ACCESS_TOKEN) {
      try {
        const caption = `${home} vs ${away} FULL HIGHLIGHTS ⚽🔥 ${hashtags.slice(0, 6).join(' ')}`.slice(0, 150);
        result.tiktok = await uploadToTikTok({ videoPath, caption });
        console.log(`[Pipeline] ✅ TikTok: ${result.tiktok.publishId}`);
      } catch (e) {
        console.error('[Pipeline] TikTok failed:', e.message);
        result.tiktok = { error: e.message };
      }
    } else {
      result.tiktok = { status: 'skipped', reason: 'TIKTOK_ACCESS_TOKEN not configured' };
    }

    updateJob(jobId, { status: 'done', result, step: 'Complete' });
    await cleanupDir(tmpDir);
    return { jobId, result };

  } catch (err) {
    console.error(`[Pipeline] Job ${jobId} fatal error:`, err.message);
    updateJob(jobId, { status: 'error', error: err.message });
    await cleanupDir(tmpDir).catch(() => {});
    throw err;
  }
}

// ── Auto-detect completed matches and trigger pipeline ────────────────────────
const processedMatchIds = new Set();

async function checkAndAutoPost() {
  try {
    const { getLiveFixtures } = require('./footballApi');
    const matches = await getLiveFixtures();

    const completed = (matches || []).filter(m =>
      ['FT', 'AET', 'PEN'].includes(m.status) &&
      m.homeScore !== null && m.awayScore !== null &&
      !processedMatchIds.has(m.id)
    );

    for (const match of completed.slice(0, 2)) {
      processedMatchIds.add(match.id);
      const jobId = createJob(match);
      console.log(`[Pipeline] Auto-trigger: ${match.homeTeam?.name} vs ${match.awayTeam?.name} (job ${jobId})`);
      runVideoPipeline(match, jobId).catch(err =>
        console.error(`[Pipeline] Job ${jobId} error:`, err.message)
      );
    }

    return completed.length;
  } catch (err) {
    console.error('[Pipeline] Auto-check error:', err.message);
    return 0;
  }
}

module.exports = { runVideoPipeline, checkAndAutoPost, createJob, getJob, getAllJobs };
