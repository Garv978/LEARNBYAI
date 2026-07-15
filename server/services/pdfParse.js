const pdfParse = require("pdf-parse");

async function parsePdfBuffer(buffer) {
  try {
    const parsed = await pdfParse(buffer);

    return {
      pages: parsed.numpages,
      text: parsed.text,
      info: parsed.info,
      metadata: parsed.metadata,
      version: parsed.version,
    };
  } catch (err) {
    throw new Error(`Failed to parse PDF: ${err.message}`);
  }
}

module.exports = parsePdfBuffer;