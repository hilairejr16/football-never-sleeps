'use strict';

const fs = require('fs');

const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB

async function uploadToTikTok({ videoPath, caption }) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  if (!accessToken) throw new Error('TIKTOK_ACCESS_TOKEN not configured');

  const stat     = await fs.promises.stat(videoPath);
  const fileSize = stat.size;
  const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

  // Step 1 — Init upload
  const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      post_info: {
        title: caption.slice(0, 150),
        privacy_level: 'PUBLIC_TO_EVERYONE',
        disable_duet: false,
        disable_stitch: false,
        disable_comment: false,
        video_cover_timestamp_ms: 2000,
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: fileSize,
        chunk_size: CHUNK_SIZE,
        total_chunk_count: totalChunks,
      },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  const initData = await initRes.json();
  if (!initRes.ok || initData.error?.code !== 'ok') {
    throw new Error(`TikTok init failed: ${JSON.stringify(initData)}`);
  }

  const { upload_url, publish_id } = initData.data;

  // Step 2 — Upload chunks
  const buf = await fs.promises.readFile(videoPath);
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end   = Math.min(start + CHUNK_SIZE, fileSize);
    const chunk = buf.slice(start, end);

    const chunkRes = await fetch(upload_url, {
      method: 'PUT',
      headers: {
        'Content-Range': `bytes ${start}-${end - 1}/${fileSize}`,
        'Content-Length': String(chunk.length),
        'Content-Type': 'video/mp4',
      },
      body: chunk,
      signal: AbortSignal.timeout(120_000),
    });

    if (!chunkRes.ok && chunkRes.status !== 206) {
      throw new Error(`TikTok chunk ${i + 1}/${totalChunks} failed: HTTP ${chunkRes.status}`);
    }
  }

  console.log(`[TikTok] Upload complete — publishId: ${publish_id}`);
  return { publishId: publish_id, platform: 'tiktok' };
}

module.exports = { uploadToTikTok };
