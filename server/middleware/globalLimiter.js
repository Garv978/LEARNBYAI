const { RateLimiterRedis, RateLimiterMemory } = require("rate-limiter-flexible");
const redis = require("../config/redis");

const insuranceLimiter = new RateLimiterMemory({
  points: 100,
  duration: 15 * 60,
});

const globalLimiter = new RateLimiterRedis({
  storeClient: redis,

  keyPrefix: "rl_global",

  points: 100,

  duration: 15 * 60,

  insuranceLimiter,
});

module.exports = globalLimiter;