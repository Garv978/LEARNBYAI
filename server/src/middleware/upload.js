const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 8000000, // 8 MB
    files: 1,
    fields: 10,
    parts: 11,
  },

  fileFilter(req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed."));
    }

    cb(null, true);
  },
});

module.exports = upload;
