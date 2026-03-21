"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TranslationWork() {
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [notes, setNotes] = useState("");
  const [progress, setProgress] = useState(0);

  // 🔄 Progress Animation After Submit
  useEffect(() => {
    if (submitted) {
      let value = 0;

      const interval = setInterval(() => {
        value += 10;
        setProgress(value);

        if (value >= 100) {
          clearInterval(interval);

          // Save status (for future use)
          localStorage.setItem("translationStatus", "Completed");

          // Redirect to intern dashboard
          setTimeout(() => {
            router.push("/try-teja/intern");
          }, 800);
        }
      }, 100);
    }
  }, [submitted, router]);

  function handleSubmit() {
    // ✅ Validation (File OR Drive link required)
    if (!file && !driveLink.trim()) {
      alert("Please upload file or add drive link before submitting.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black px-6 md:px-16 py-16">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => router.back()}
          className="text-sm underline hover:text-gray-600 transition"
        >
          ← Back
        </button>

        <span className="px-4 py-1 text-sm rounded-full bg-yellow-400 text-black">
          Pending
        </span>
      </div>

      <h1 className="text-4xl font-semibold mb-12">
        Translation Task
      </h1>

      {/* TASK INFO */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-12">
        <h2 className="text-xl font-medium mb-4">
          Task Information
        </h2>

        <p className="text-black/60 mb-3">
          Language: Hindi → English
        </p>

        <a
          href="#"
          className="inline-block underline hover:text-gray-600 transition"
        >
          Download Source File
        </a>
      </div>

      {/* SUBMISSION SECTION */}
      <div className="bg-white rounded-2xl shadow-md p-8">

        <h2 className="text-xl font-medium mb-6">
          Submit Your Work
        </h2>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Upload Completed File
          </label>

          <input
            type="file"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
                setFileName(selected.name);
              }
            }}
            className="w-full border border-black/20 p-3 rounded-lg focus:outline-none focus:border-black transition"
          />

          {fileName && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {fileName}
            </p>
          )}
        </div>

        {/* Drive Link */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Paste Drive Link
          </label>

          <input
            type="text"
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            placeholder="Paste Google Drive link here"
            className="w-full border border-black/20 p-3 rounded-lg focus:outline-none focus:border-black transition"
          />
        </div>

        {/* Notes */}
        <div className="mb-8">
          <label className="block mb-2 font-medium">
            Notes / Comments
          </label>

          <textarea
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes regarding your submission..."
            className="w-full border border-black/20 p-3 rounded-lg focus:outline-none focus:border-black transition"
          />
        </div>

        {/* Submit Button */}
        {!submitted && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSubmit}
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Submit Task
          </motion.button>
        )}

        {/* Progress Section */}
        {submitted && (
          <div className="mt-8">
            <p className="mb-2 font-medium">
              Submitting...
            </p>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-black h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {progress === 100 && (
              <p className="mt-4 text-green-600 font-medium">
                ✅ Task submitted successfully!
              </p>
            )}
          </div>
        )}

      </div>

    </div>
  );
}   