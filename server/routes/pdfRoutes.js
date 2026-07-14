const express = require('express');
const router = express.Router();

const {
  getAllPdfs,
  getPdf,
  uploadPdf,
  deletePdf,
  getPdfStatus,
} = require('../controllers/pdfController');

// ✅ Routes
router.get('/pdfs', getAllPdfs);                  // Get all PDFs for logged-in user
router.get('/pdfs/:pdfId', getPdf);               // Get single PDF by ID
router.post('/pdfs/upload', uploadPdf);           // Upload a new PDF          // Update metadata of a PDF
router.delete('/pdfs/:pdfId', deletePdf);         // Delete a PDF
router.get('/pdfs/:pdfId/status', getPdfStatus);  // Get processing status of a PDF

module.exports = router;
