const { Queue } = require("bullmq");
const connection = require("../config/redis");

const pdfQueue = new Queue("pdf-processing", {
  connection,
  defaultJobOptions: {
    attempts: 3, // retry 3 times if failed

    removeOnComplete: 100,

    removeOnFail: 50,
  },
});

module.exports = pdfQueue;