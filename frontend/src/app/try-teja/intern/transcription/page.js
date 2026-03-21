"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TranscriptionWork() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [uploadDriveLink, setUploadDriveLink] = useState("");
  const [downloadDriveLink, setDownloadDriveLink] = useState("");
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreviewName(selectedFile.name);
      setProgress(25);
    }
  }

  function handleSubmit() {
    if (!file && !uploadDriveLink.trim()) {
      alert("Please upload file or paste drive link.");
      return;
    }

    setSubmitting(true);
    setProgress(60);

    setTimeout(() => {
      setProgress(100);

      // ✅ SAVE STATUS HERE (IMPORTANT)
      localStorage.setItem("transcriptionStatus", "Completed");

      setTimeout(() => {
        router.push("/try-teja/intern");
      }, 800);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-white text-black px-10 py-16 max-w-4xl mx-auto">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="mb-10 text-black/70 hover:text-black transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-semibold mb-12">
        Transcription Task
      </h1>

      {/* LANGUAGE SECTION */}
      <div className="mb-12">
        <label className="block mb-4 font-semibold text-lg">
          Language
        </label>

        <div className="flex items-center gap-6">
          <select className="border p-3 rounded-xl w-40">
            <option>Hindi</option>
            <option>English</option>
            <option>Tamil</option>
            <option>Telugu</option>
            <option>Kannada</option>
          </select>

          <span className="text-xl">→</span>

          <select className="border p-3 rounded-xl w-40">
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
            <option>Kannada</option>
          </select>
        </div>
      </div>

      {/* DOWNLOAD FILE */}
      <div className="mb-10">
        <label className="block mb-3 font-medium">
          Download File
        </label>

        <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
          Download Audio File
        </button>
      </div>

      {/* DOWNLOAD DRIVE LINK */}
      <div className="mb-12">
        <label className="block mb-3 font-medium">
          Download via Drive Link
        </label>

        <input
          type="text"
          placeholder="Paste drive link here"
          value={downloadDriveLink}
          onChange={(e) => setDownloadDriveLink(e.target.value)}
          className="w-full border border-black/20 p-4 rounded-xl"
        />
      </div>

      {/* UPLOAD FILE */}
      <div className="mb-10">
        <label className="block mb-3 font-medium">
          Upload Transcript File
        </label>

        <input
          type="file"
          onChange={handleFileChange}
          className="w-full border border-black/20 p-4 rounded-xl"
        />

        {previewName && (
          <p className="mt-4 text-sm text-black/60">
            Selected File: {previewName}
          </p>
        )}
      </div>

      {/* UPLOAD DRIVE LINK */}
      <div className="mb-12">
        <label className="block mb-3 font-medium">
          Upload via Drive Link
        </label>

        <input
          type="text"
          placeholder="Paste your completed drive link here"
          value={uploadDriveLink}
          onChange={(e) => setUploadDriveLink(e.target.value)}
          className="w-full border border-black/20 p-4 rounded-xl"
        />
      </div>

      {/* PROGRESS BAR */}
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-3 mb-10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-black h-3 rounded-full"
          />
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Task"}
      </button>

    </div>
  );
}