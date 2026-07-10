const rateLimit = require('express-rate-limit');

// Use Redis store if available so limits are shared across all Railway instances.
// Falls back to in-memory store if Redis is unavailable.
function makeStore() {
  try {
    const { RedisStore } = require('rate-limit-redis');
    const { getClient }  = require('../config/redis');
    const client = getClient();
    if (client) {
      return new RedisStore({ sendCommand: (...args) => client.call(...args) });
    }
  } catch {}
  return undefined; // default in-memory store
}

const store = makeStore();

exports.globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: { status: 'error', message: 'Too many requests, please try again later.' },
});

exports.authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: { status: 'error', message: 'Too many auth attempts, please wait 15 minutes.' },
});

exports.aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: { status: 'error', message: 'AI generation rate limit reached. Try again in a minute.' },
});
