const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

/**
 * Splits text into overlapping chunks using LangChain's RecursiveCharacterTextSplitter.
 * @param {string} text - The raw text you want to split.
 * @param {number} chunkSize - Max size of each chunk (default 1000).
 * @param {number} chunkOverlap - Overlap between chunks (default 200).
 * @returns {Promise<Array>} - Array of chunked documents.
 */
async function splitTextIntoChunks(text, chunkSize = 1000, chunkOverlap = 200) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
    });

    return await splitter.splitText(text);
}
module.exports= splitTextIntoChunks;