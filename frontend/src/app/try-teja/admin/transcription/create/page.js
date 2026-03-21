"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TranscriptionCreate() {
  const user = useAuth("admin");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    sourceType: "audio",
    fileFormat: "mp3",
    language: "English",
    duration: "",
    url: "",
    notes: "",
    priority: "normal",
    deadline: "",
  });

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Redirect to list page
    router.push("/try-teja/admin/transcription");
  };

  const languages = [
    "English", "Hindi", "Spanish", "French", "German", 
    "Japanese", "Chinese", "Korean", "Portuguese", "Italian"
  ];

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-10">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Link href="/try-teja/admin/transcription">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-black/60 hover:text-black"
            >
              ← Back
            </motion.button>
          </Link>
          <h1 className="text-3xl font-semibold">Create Transcription Task</h1>
        </div>
        <p className="text-black/60 mt-1 ml-14">Fill in the details to create a new transcription task</p>
      </div>

      {/* FORM */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-w-2xl"
      >
        <div className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Task Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              className="w-full p-3 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black focus:bg-black/10 transition"
            />
          </div>

          {/* Source Type & Format */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Source Type *</label>
              <select
                value={formData.sourceType}
                onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                className="w-full p-3 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black focus:bg-black/10 transition"
              >
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">File Format *</label>
              <select
                value={formData.fileFormat}
                onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value })}
                className="w-full p-3 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black focus:bg-black/10 transition"
              >
                <option value="mp3">MP3</option>
                <option value="mp4">MP4</option>
                <option value="wav">WAV</option>
                <option value="m4a">M4A</option>
                <option value="webm">WebM</option>
              </select>
            </div>
          </div>

          {/* Language & Duration */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language *</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full p-3 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black focus:bg-black/10 transition"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 45:00"
                className="w-full p-3 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black focus:bg-black/10 transition"
              />
            </div>
          </div>

          {/* File URL */}
          <div>
            <label className="block text-sm font-medium mb-2">File URL *</label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="Enter file URL or upload file"
              className="w-full p-3 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black focus:bg-black/10 transition"
            />
          </div>

          {/* Priority & Deadline */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-3 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black focus:bg-black/10 transition"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full p-3 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black focus:bg-black/10 transition"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special instructions or speaker identification..."
              className="w-full p-3 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black focus:bg-black/10 transition resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <motion.div
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </motion.button>

            <Link href="/try-teja/admin/transcription">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border border-black/20 px-6 py-3 rounded-lg hover:bg-black/5 transition"
              >
                Cancel
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
