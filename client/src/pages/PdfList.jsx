import React, { useEffect, useRef, useState } from "react";
import { getAllPdfs, getPdfStatus, uploadPdf } from "../services/PdfServices";

import { Link } from "react-router-dom";

const UploadPdf = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Maximum file size is 10 MB.");
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    await onUpload(file);

    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-white">Upload PDF</h2>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => handleFile(e.target.files[0])}
        className="mb-4 block w-full text-gray-300
        file:mr-4 file:rounded file:border-0
        file:bg-blue-600 file:px-4 file:py-2
        file:text-white hover:file:bg-blue-700"
      />

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      {file && <p className="mb-3 text-gray-300">{file.name}</p>}

      <button
        disabled={!file}
        onClick={handleUpload}
        className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:bg-gray-600"
      >
        Upload
      </button>
    </div>
  );
};

const PdfCard = ({ pdf }) => {
  const statusColor = {
    queued: "text-yellow-400",
    uploading: "text-blue-400",
    processing: "text-purple-400",
    extracting: "text-indigo-400",
    embedding: "text-pink-400",
    completed: "text-green-400",
    failed: "text-red-400",
  };

  return (
    <div className="rounded-xl bg-gray-800 p-5 shadow-lg">
      <h3 className="truncate text-lg font-semibold text-white">{pdf.title}</h3>

      <p className="mt-2 text-sm text-gray-400">
        {pdf.description || "Uploaded PDF"}
      </p>

      <p
        className={`mt-4 font-medium ${
          statusColor[pdf.processingStatus] || "text-gray-300"
        }`}
      >
        ● {pdf.processingStatus}
      </p>

      <p className="mt-2 text-xs text-gray-500">
        {new Date(pdf.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

const PdfList = () => {
  const [pdfs, setPdfs] = useState([]);

  const fetchPdfs = async () => {
    try {
      const { data } = await getAllPdfs();
      setPdfs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setPdfs((prev) =>
          Promise.all(
            prev.map(async (pdf) => {
              const { data } = await getPdfStatus(pdf._id);

              return {
                ...pdf,
                processingStatus: data.status,
              };
            }),
          ),
        );
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (file) => {
    try {
      const { data } = await uploadPdf(file);

      setPdfs((prev) => [data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-white">My PDFs</h1>

        <UploadPdf onUpload={handleUpload} />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((pdf) => (
            <Link to={`/user/pdfs/${pdf._id}`}>
              <PdfCard pdf={pdf} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PdfList;
