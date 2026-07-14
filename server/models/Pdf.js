const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    // Cloudinary
    publicId: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      default: "application/pdf",
    },

    pages: Number,

    processingStatus: {
      type: String,
      enum: [
        "queued",
        "uploading",
        "processing",
        "extracting",
        "embedding",
        "completed",
        "failed",
      ],
      default: "queued",
    },

    processingError: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lastOpenedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

pdfSchema.index({
  user: 1,
  createdAt: -1,
});

pdfSchema.methods.markOpened = function () {
  this.lastOpenedAt = new Date();
  return this.save();
};

pdfSchema.methods.markProcessing = function () {
  this.processingStatus = "processing";
  return this.save();
};

pdfSchema.methods.markCompleted = function (extractedText) {
  this.processingStatus = "completed";
  return this.save();
};

pdfSchema.methods.markFailed = function (errorMessage) {
  this.processingStatus = "failed";
  this.processingError = errorMessage;
  return this.save();
};
module.exports = mongoose.model("Pdf", pdfSchema);
