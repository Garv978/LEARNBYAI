const { Worker } = require("bullmq");
const axios = require("axios");

const connection = require("../config/redis");
const Pdf = require("../models/Pdf");

const {
  parsePdfBuffer,
  splitTextIntoChunks,
  createEmbedding,
  getIndex,
  upsertVectors,
} = require("../services");

const worker = new Worker(
  "pdf-processing",

  async (job) => {
    console.log("📄 Processing PDF:", job.data.pdfId);

    const pdf = await Pdf.findById(job.data.pdfId);

    if (!pdf) {
      throw new Error("PDF not found");
    }

    await pdf.markProcessing();

    try {
      // -----------------------------
      // Download PDF
      // -----------------------------
      const response = await axios.get(pdf.fileUrl, {
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(response.data);

      // -----------------------------
      // Parse PDF
      // -----------------------------
      const parsed = await parsePdfBuffer(buffer);

      if (!parsed.text.trim()) {
        throw new Error("No text found in PDF");
      }

      pdf.pages = parsed.pages;

      // -----------------------------
      // Clean Text
      // -----------------------------
      const cleanText = parsed.text
        .normalize("NFKC")
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .replace(/-\n/g, "")
        .replace(/(?<![.!?:])\n(?!\n)/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ ]{2,}/g, " ")
        .trim();

      // -----------------------------
      // Chunk Text
      // -----------------------------
      const chunks = await splitTextIntoChunks(cleanText);

      console.log(`Created ${chunks.length} chunks`);

      // -----------------------------
      // Pinecone Index
      // -----------------------------
      const index = getIndex();
      await upsertVectors(index, vectors);

      // -----------------------------
      // Generate Embeddings
      // -----------------------------
      const vectors = await Promise.all(
        chunks.map(async (chunk, i) => {
          const embedding = await createEmbedding(chunk);

          return {
            id: `${pdf._id}_${i}`,
            values: embedding,
            metadata: {
              pdfId: pdf._id.toString(),
              title: pdf.title,
              chunkIndex: i,
              text: chunk,
            },
          };
        })
      );

      // -----------------------------
      // Upload to Pinecone
      // -----------------------------
      await upsertVectors(index, vectors);

      // -----------------------------
      // Finish
      // -----------------------------
      await pdf.markCompleted(cleanText);

      console.log(`✅ ${pdf.title} processed successfully`);
    } catch (error) {
      await pdf.markFailed(error.message);
      throw error;
    }
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
  console.log(`❌ Job ${job?.id} failed`);
  console.log(err.message);
});

console.log("🚀 PDF Worker Started");