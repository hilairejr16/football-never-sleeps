const express = require('express');
const { Readable } = require('stream');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // ElevenLabs — Adam

const ttsRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TTS rate limit exceeded — please wait a few minutes.' },
});

router.post('/article', ttsRateLimit, async (req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'TTS not configured' });
  }

  const { text, title } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required and must be a string' });
  }
  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({ error: 'title must be a string' });
  }

  const content = [title, text].filter(Boolean).join('. ').slice(0, 5000);

  try {
    const elRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: content,
          model_id: 'eleven_turbo_v2',
          voice_settings: { stability: 0.4, similarity_boost: 0.75 },
        }),
      }
    );

    if (!elRes.ok) {
      const errText = await elRes.text();
      console.error('[TTS] ElevenLabs error', elRes.status, errText);
      return res.status(elRes.status).json({ error: 'TTS upstream error' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    Readable.fromWeb(elRes.body).pipe(res);
  } catch (err) {
    console.error('[TTS] generation failed', err);
    res.status(500).json({ error: 'TTS generation failed' });
  }
});

module.exports = router;
