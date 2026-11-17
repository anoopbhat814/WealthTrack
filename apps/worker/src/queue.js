'use strict';
const Redis = require('ioredis');

/** Tiny reliable-queue on Redis lists using BRPOPLPUSH-style processing. */
function startQueue(url, name) {
  const redis = new Redis(url);
  const processing = `${name}:processing`;
  let running = true;

  async function process(handler) {
    while (running) {
      const raw = await redis.brpoplpush(name, processing, 5);
      if (!raw) continue;
      try {
        await handler(JSON.parse(raw));
        await redis.lrem(processing, 1, raw);
      } catch (err) {
        console.error('job failed', err.message);
        await redis.lrem(processing, 1, raw);
        await redis.lpush(`${name}:dead`, raw);
      }
    }
  }

  return {
    process: (h) => { process(h); },
    close: async () => { running = false; await redis.quit(); },
  };
}

module.exports = { startQueue };
