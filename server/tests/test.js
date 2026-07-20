const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});
const pdfQueue = require("../queues/pdfQueue");

async function test() {
  console.log("Before add");

  const job = await pdfQueue.add("process-pdf", {
    pdfId: "123",
  });

  console.log("After add");
  console.log("Job added:", job.id);

  process.exit(0);
}

test().catch((err) => {
  console.error(err);
});