const { Pinecone } = require("@pinecone-database/pinecone");

// Initialize Pinecone client with API key
const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

module.exports = pineconeClient;
