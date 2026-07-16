const pineconeClient = require("../config/pinecone");

function getIndex() {
  return pineconeClient.index(process.env.PINECONE_INDEX);
}

async function upsertVectors(index, vectors) {
  await index.upsert(vectors);
}

async function queryIndex(index, queryVector, topK = 5) {
  const results = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  return results.matches;
}

module.exports = {
  getIndex,
  upsertVectors,
  queryIndex,
};