const mongoose = require("mongoose");
const Pdf = require("../models/Pdf");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const getAllPdfs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const pdfs = await Pdf.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pdfs.length,
      pdfs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getPdf = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(pdfId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF id",
      });
    }

    const pdf = await Pdf.findOne({
      _id: pdfId,
      user: userId,
    });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    await pdf.markOpened();

    res.status(200).json({
      success: true,
      pdf,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    const userId = req.user.userId;

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "learnwithai/pdfs",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const pdf = await Pdf.create({
      user: userId,
      title: req.file.originalname.replace(/\.pdf$/i, ""),
      originalName: req.file.originalname,
      publicId: result.public_id,
      fileUrl: result.secure_url,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      processingStatus: "queued",
    });

    res.status(201).json({
      success: true,
      pdf,
    });

    // Later:
    // await pdfQueue.add("parse-pdf", { pdfId: pdf._id });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const deletePdf = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(pdfId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF id",
      });
    }

    const pdf = await Pdf.findOne({
      _id: pdfId,
      user: userId,
    });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    await cloudinary.uploader.destroy(pdf.publicId, {
      resource_type: "raw",
    });

    await pdf.deleteOne();

    res.status(200).json({
      success: true,
      message: "PDF deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getPdfStatus = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(pdfId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF id",
      });
    }

    const pdf = await Pdf.findOne({
      _id: pdfId,
      user: userId,
    });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    res.status(200).json({
      success: true,
      status: pdf.processingStatus,
      error: pdf.processingError,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  getAllPdfs,
  getPdf,
  uploadPdf,
  deletePdf,
  getPdfStatus,
};