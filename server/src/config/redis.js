const IORedis = require("ioredis");

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
connection.on("connect", () => {
  console.log("✅ Connected to Upstash");
});

connection.on("error", (err) => {
  console.log("❌ Redis Error:", err);
});

module.exports = connection;