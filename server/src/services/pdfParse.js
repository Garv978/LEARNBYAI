const { PDFParse } = require("pdf-parse");

async function parsePdfBuffer(buffer) {
  let parser;

  try {
    parser = new PDFParse({ data: buffer });

    const parsed = await parser.getText();

    return {
      pages: parsed.total,
      text: parsed.text,
      info: parsed.info,
      metadata: parsed.metadata,
    };
  } catch (err) {
    throw new Error(`Failed to parse PDF: ${err.message}`);
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

module.exports = parsePdfBuffer;