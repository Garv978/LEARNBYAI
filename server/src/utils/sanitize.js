const sanitizeHtml = require("sanitize-html");

function sanitizeText(text) {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}
module.exports={
  sanitizeText
}