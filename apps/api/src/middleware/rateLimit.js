const rateLimit = require('express-rate-limit');

exports.globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later.' },
});

exports.authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: 'error', message: 'Too many auth attempts, please wait 15 minutes.' },
});

exports.aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { status: 'error', message: 'AI generation rate limit reached. Try again in a minute.' },
});
