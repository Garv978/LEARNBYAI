require("dotenv").config();

const pdfQueue = require("../queues/pdfQueue");

async function test() {
  const job = await pdfQueue.add("process-pdf", {
    pdfId: "123",
  });

  console.log("Job added:", job.id);
  process.exit(0);
}

test().catch(console.error);