const pineconeClient = require("../config/pinecone");

async function getIndex() {
  const desc = await pineconeClient.describeIndex(process.env.PINECONE_INDEX);

  console.log("HOST:", desc.host);

  return pineconeClient.index({
    host: desc.host,
  });
}

async function upsertVectors(index, vectors) {
  console.log("About to upsert", vectors.length);

  return await index.upsert({
    records: vectors,
  });
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