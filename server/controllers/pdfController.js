const mongoose = require("mongoose");
const Pdf = require("../models/Pdf");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const pdfQueue = require("../queues/pdfQueue");

const sendServerError = (res, error) => {
  return res.status(500).json({
    success: false,
    message: error.message || "Server error",
  });
};

const findUserPdf = async (pdfId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(pdfId)) {
    return {
      error: {
        status: 400,
        message: "Invalid PDF id",
      },
    };
  }

  const pdf = await Pdf.findOne({
    _id: pdfId,
    user: userId,
  });

  if (!pdf) {
    return {
      error: {
        status: 404,
        message: "PDF not found",
      },
    };
  }

  return { pdf };
};

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
    return sendServerError(res, error);
  }
};

const getPdf = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user.userId;

    const { pdf, error } = await findUserPdf(pdfId, userId);

    if (error) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    await pdf.markOpened();

    res.status(200).json({
      success: true,
      pdf,
    });
  } catch (error) {
    return sendServerError(res, error);
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
          if (error) {
            return reject(error);
          }

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

    await pdfQueue.add("process-pdf", {
      pdfId: pdf._id,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

const deletePdf = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user.userId;

    const { pdf, error } = await findUserPdf(pdfId, userId);

    if (error) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
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
    return sendServerError(res, error);
  }
};

const getPdfStatus = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user.userId;

    const { pdf, error } = await findUserPdf(pdfId, userId);

    if (error) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      status: pdf.processingStatus,
      error: pdf.processingError,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

module.exports = {
  getAllPdfs,
  getPdf,
  uploadPdf,
  deletePdf,
  getPdfStatus,
};