import API from "../api";

// Get all PDFs
export const getAllPdfs = () => {
  return API.get("/pdfs");
};

// Get single PDF
export const getPdf = (pdfId) => {
  return API.get(`/pdfs/${pdfId}`);
};

// Upload PDF
export const uploadPdf = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/pdfs/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Delete PDF
export const deletePdf = (pdfId) => {
  return API.delete(`/pdfs/${pdfId}`);
};

// Get PDF status
export const getPdfStatus = (pdfId) => {
  return API.get(`/pdfs/${pdfId}/status`);
};
