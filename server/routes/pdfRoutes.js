const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getAllPdfs,
  getPdf,
  uploadPdf,
  deletePdf,
  getPdfStatus,
} = require("../controllers/pdfController");

// Get all PDFs
router.get("/pdfs", getAllPdfs);

// Get a single PDF
router.get("/pdfs/:pdfId", getPdf);

// Upload PDF
router.post(
  "/pdfs/upload",
  upload.single("file"),
  uploadPdf
);

// Delete PDF
router.delete("/pdfs/:pdfId", deletePdf);

// Get processing status
router.get("/pdfs/:pdfId/status", getPdfStatus);

module.exports = router;