const { HfInference } = require("@huggingface/inference");

// Initialize Hugging Face client with API key
const hfClient = new HfInference(process.env.HUGGING_FACE_API_KEY);

module.exports = hfClient;
