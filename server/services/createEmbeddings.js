const hfClient = require("../config/huggingFace");

/**
 * Create an embedding for a given text using Hugging Face Inference API.
 * @param {string} text - The input text to embed.
 * @returns {Promise<Array<number>>} - The embedding vector.
 */
async function createEmbedding(text) {
  try {
    const embedding = await hfClient.featureExtraction({
      model: "BAAI/bge-small-en-v1.5",
      inputs: text,
    });
    return embedding;
  } catch (error) {
    console.error("Embedding Error:", error);
    throw new Error("Failed to create embedding");
  }
}

module.exports = createEmbedding;
