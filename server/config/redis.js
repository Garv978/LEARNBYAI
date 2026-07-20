const IORedis = require("ioredis");
console.log("REDIS_URL =", process.env.REDIS_URL);
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

module.exports = connection;