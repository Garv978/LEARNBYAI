const globalLimiter = require("./globalLimiter");

const globalRateLimit = async (req, res, next) => {
  try {
    const key = req.user?.userId || req.ip;

    const result = await globalLimiter.consume(key);

    next();
  } catch (rejRes) {
    const retryAfter = Math.ceil(rejRes.msBeforeNext / 1000);

    res.set("Retry-After", retryAfter);

    return res.status(429).json({
      success: false,
      error: "RATE_LIMIT_EXCEEDED",
      message: `Too many requests. Please try again later ${Math.ceil(retryAfter / 60)} minute(s)`,
    });
  }
};

module.exports = globalRateLimit;