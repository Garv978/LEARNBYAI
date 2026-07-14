const { Worker } = require("bullmq");
const connection = require("../config/redis");

const Pdf = require("../models/Pdf");

const worker = new Worker(
  "pdf-processing",

  async (job) => {
    console.log("📄 Processing PDF:", job.data.pdfId);

    const pdf = await Pdf.findById(job.data.pdfId);

    if (!pdf) {
      throw new Error("PDF not found");
    }

    await pdf.markProcessing();

    // -----------------------
    // Later we'll do:
    //
    // Download PDF
    // Parse PDF
    // Chunk Text
    // Generate Embeddings
    // Save Vectors
    //
    // -----------------------

    await pdf.markCompleted("Dummy extracted text");

    console.log("✅ Finished:", pdf.title);
  },

  {
    connection,
    concurrency: 2,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job ${job.id} failed`);

  console.log(err.message);
});

console.log("🚀 PDF Worker Started");