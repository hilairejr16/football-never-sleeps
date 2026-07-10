'use strict';

const fs = require('fs');

async function getAccessToken() {
  const { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN } = process.env;
  if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
    throw new Error('YouTube OAuth not configured — set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN');
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: YOUTUBE_CLIENT_ID,
      client_secret: YOUTUBE_CLIENT_SECRET,
      refresh_token: YOUTUBE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`YouTube token refresh failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function uploadToYouTube({ videoPath, title, description, tags = [], categoryId = '17' }) {
  const accessToken = await getAccessToken();
  const fileBuffer  = await fs.promises.readFile(videoPath);
  const fileSize    = fileBuffer.length;

  // Step 1 — Initiate resumable upload session
  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': 'video/mp4',
        'X-Upload-Content-Length': String(fileSize),
      },
      body: JSON.stringify({
        snippet: {
          title: title.slice(0, 100),
          description: [
            description,
            '',
            '#Shorts #WorldCup2026 #Football #GoalRush #Soccer',
            '',
            'GoalRush Global — Football Never Sleeps',
            'https://goalrushglobal.com',
          ].join('\n'),
          tags: [...new Set([...tags, 'Shorts', 'WorldCup2026', 'Football', 'Soccer', 'GoalRush'])].slice(0, 500),
          categoryId, // 17 = Sports
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en',
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
          madeForKids: false,
        },
      }),
      signal: AbortSignal.timeout(30_000),
    }
  );

  if (!initRes.ok) {
    const err = await initRes.text();
    throw new Error(`YouTube init upload failed (${initRes.status}): ${err}`);
  }

  const uploadUrl = initRes.headers.get('location');
  if (!uploadUrl) throw new Error('YouTube did not return an upload URL');

  // Step 2 — Upload the binary
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': String(fileSize),
    },
    body: fileBuffer,
    signal: AbortSignal.timeout(600_000), // 10-min timeout for large files
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`YouTube upload failed (${uploadRes.status}): ${err}`);
  }

  const data = await uploadRes.json();
  if (!data.id) throw new Error(`YouTube did not return a video ID: ${JSON.stringify(data)}`);

  return {
    videoId: data.id,
    youtubeUrl: `https://www.youtube.com/shorts/${data.id}`,
    title: data.snippet?.title || title,
  };
}

module.exports = { uploadToYouTube };
