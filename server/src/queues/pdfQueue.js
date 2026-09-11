const { Queue } = require("bullmq");
const connection = require("../config/redis");

const pdfQueue = new Queue("pdf-processing", {
  connection,
  defaultJobOptions: {
    attempts: 1, // retry 3 times if failed

    removeOnComplete: 5,

    removeOnFail: 5,
  },
});

module.exports = pdfQueue;