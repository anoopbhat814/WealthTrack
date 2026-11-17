'use strict';

/** Run `fn` every day at the given UTC hour and minute. */
function scheduleDaily(hour, minute, fn) {
  function next() {
    const now = new Date();
    const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, minute));
    if (target <= now) target.setUTCDate(target.getUTCDate() + 1);
    return target.getTime() - now.getTime();
  }
  const arm = () => setTimeout(async () => {
    try { await fn(); } catch (e) { console.error('scheduled job failed', e); }
    arm();
  }, next());
  arm();
}

module.exports = { scheduleDaily };
